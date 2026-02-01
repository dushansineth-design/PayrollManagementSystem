import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePayslip = (employee, monthYear) => {
  const doc = new jsPDF();

  // --- Configuration ---
  const margin = 15;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const contentWidth = pageWidth - (margin * 2);
  const lineSpacing = 7;

  // Font setup
  const setFontBold = (size = 10) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
  };

  const setFontNormal = (size = 10) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
  };

  const formatCurrency = (val) => {
    return Number(val).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  let y = 20;

  // --- Header Section ---
  setFontBold(14);
  doc.text("Walk to Glow", margin, y);

  y += 6;
  setFontNormal(10);
  doc.text("No.93 S.De.Jayasinghe Mawatha", margin, y);
  y += 5;
  doc.text("Kohuwala, Nugegoda", margin, y);

  y += 8;
  // Name Row
  doc.text("Name", margin, y);
  doc.text(employee.name || "", margin + 40, y);

  y += 5;
  // Month Row
  doc.text("Month", margin, y);
  doc.text(monthYear || "", margin + 40, y);

  y += 5;
  // EPF No Row
  doc.text("EPF NO.", margin, y);
  doc.text(employee.epfNo || employee.employeeId || "", margin + 40, y); // Fallback to empId if epfNo missing

  y += 3; // Space before table

  // --- Main Table Layout ---
  const tableTop = y;

  // Padding Logic
  const padding = 3;
  const col1X = margin + padding; // Left text start
  const rightColX = pageWidth - margin - padding; // Right text alignment

  // Columns
  const valueColWidth = 40;
  const valueColStartX = pageWidth - margin - valueColWidth;

  // Draw Top Line
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  const drawRow = (label, value, isBold = false, indent = 0) => {
    if (isBold) setFontBold(); else setFontNormal();
    doc.text(label, col1X + indent, y + 5);
    if (value !== undefined && value !== null && value !== "") {
      doc.text(formatCurrency(value), rightColX, y + 5, { align: "right" });
    }
    y += lineSpacing;
  };

  // 1. Basic Salary Section
  setFontBold();
  doc.text("Basic Salary", col1X, y + 5);
  doc.text(formatCurrency(employee.originalBasic), rightColX, y + 5, { align: "right" });
  y += lineSpacing;

  drawRow("Budget Allowance 1", "");
  drawRow("Budget Allowance 2", "");

  // Total For EPF
  let totalForEpf = parseFloat(employee.originalBasic || 0);
  drawRow("Total for EPF", totalForEpf);
  doc.line(margin, y, pageWidth - margin, y); // Section Separator

  // 2. Allowance Section
  setFontBold();
  doc.text("*Allowance", col1X, y + 5);
  y += lineSpacing;

  // Items
  const att = parseFloat(employee.attAllowance || 0);
  if (att > 0) drawRow("Attendance", att, false);

  const perf = parseFloat(employee.perfAllowance || 0);
  if (perf > 0) drawRow("Performance", perf, false);

  drawRow("Management Incentive", "");
  drawRow("Fuel Allowance", "");
  drawRow("Travel", "");
  drawRow("Other", "");

  const ot = parseFloat(employee.otAmount || 0);
  if (ot > 0) drawRow("O.T.", ot, false);

  const weekend = parseFloat(employee.weekHolidayPay || 0);
  if (weekend > 0) drawRow("Week Holiday Pay", weekend, false);

  const poya = parseFloat(employee.poyaAmount || 0);
  if (poya > 0) drawRow("Poya Pay", poya, false);

  const merc = parseFloat(employee.mercAmount || 0);
  if (merc > 0) drawRow("Mercantile Pay", merc, false);

  // Calculate Gross Earnings (Sum of everything above)
  const grossEarnings = totalForEpf + att + perf + ot + weekend + poya + merc;

  doc.line(col1X, y, pageWidth - margin, y);
  setFontBold();
  doc.text("Total", col1X, y + 5);
  doc.text(formatCurrency(grossEarnings), rightColX, y + 5, { align: "right" });
  y += lineSpacing;
  doc.line(margin, y, pageWidth - margin, y); // Section separator

  // 3. Deduct Section
  setFontBold();
  doc.text("*Deduct", col1X, y + 5);
  y += lineSpacing;

  // Deduction values aligned to the inner column (left of the vertical divider)
  const innerValueX = valueColStartX - padding;

  const drawInnerRow = (label, value) => {
    setFontNormal();
    doc.text(label, col1X, y + 5);
    if (value > 0) {
      doc.text(formatCurrency(value), innerValueX, y + 5, { align: "right" });
    }
    y += lineSpacing;
  };

  const adv = parseFloat(employee.deductionAdvance || 0);
  if (adv > 0) drawInnerRow("Advance", adv);

  const loan = parseFloat(employee.deductionLoan || 0);
  if (loan > 0) drawInnerRow("Loan", loan);

  const welfare = parseFloat(employee.deductionWelfare || 0);
  if (welfare > 0) drawInnerRow("Welfare", welfare, false);

  drawInnerRow("Late", 0);

  const nopay = parseFloat(employee.noPayAmount || 0);
  if (nopay > 0) drawInnerRow("No Pay", nopay, false);

  const epf8 = parseFloat(employee.epf8 || 0);

  // EPF 8% row
  setFontNormal();
  doc.text("EPF 8%", col1X, y + 5);
  doc.text(formatCurrency(epf8), innerValueX, y + 5, { align: "right" });

  // Underline for EPF 8% value
  doc.line(innerValueX - 25, y + 6, innerValueX, y + 6);
  y += lineSpacing;

  // Total Deductions
  const totalDeductions = adv + loan + welfare + nopay + epf8;

  // Total Label and Value
  setFontNormal();
  doc.text("Total", col1X, y + 5);
  doc.text(formatCurrency(totalDeductions), innerValueX, y + 5, { align: "right" });

  y += lineSpacing;

  doc.line(margin, y, pageWidth - margin, y); // End of main table content

  // 4. Net Salary
  // Boxed row
  setFontBold(12);
  doc.text("*Net Salary", col1X, y + 7);
  // Net Salary = Gross - Total Deductions
  const visualNet = grossEarnings - totalDeductions;

  doc.text(formatCurrency(visualNet), rightColX, y + 7, { align: "right" });
  y += 12; // Taller row
  doc.line(margin, y, pageWidth - margin, y);

  const tableBottom = y; // Mark this for the vertical divider line

  // --- Footer Section ---
  // Separation line before Company Contribution
  doc.line(margin, y, pageWidth - margin, y);

  y += 10;
  setFontBold(10);
  doc.text("*Company's Contribution", col1X, y);
  y += 6;
  setFontNormal();

  const epf12 = parseFloat(employee.epf12 || 0);
  const etf3 = parseFloat(employee.etf3 || 0);

  doc.text("EPF 12%", col1X, y);
  doc.text(formatCurrency(epf12), rightColX, y, { align: "right" });
  y += 6;
  doc.text("ETF 3%", col1X, y);
  doc.text(formatCurrency(etf3), rightColX, y, { align: "right" });

  y += 10;
  // Separator before Received Pay Sheet
  doc.line(margin, y, pageWidth - margin, y);

  // Received Pay Sheet Block
  const sigBoxTop = y;
  const sigBoxHeight = 35;
  const sigBoxBottom = sigBoxTop + sigBoxHeight;

  doc.setFillColor(240, 240, 240);
  doc.rect(margin, sigBoxTop, contentWidth, sigBoxHeight, 'F');

  doc.text("Received Pay Sheet", col1X, sigBoxTop + 5);

  // Lines for signatures
  const lineY = sigBoxTop + 25;

  doc.line(margin + 5, lineY, margin + 70, lineY);
  doc.setFontSize(8);
  doc.text("Prepared by Accountant", margin + 5, lineY + 4);

  doc.line(pageWidth - margin - 70, lineY, pageWidth - margin - 5, lineY);
  doc.text("Employee Signature", pageWidth - margin - 5, lineY + 4, { align: "right" });

  // Update Y to final bottom
  y = sigBoxBottom;

  // --- FINAL BORDERS ---
  // Vertical line for Earnings/Deductions Values (ends at Net Salary)
  doc.line(valueColStartX, tableTop, valueColStartX, tableBottom);

  // Main Left Border (Top to Bottom of Page/Signature)
  doc.line(margin, tableTop, margin, y);

  // Main Right Border (Top to Bottom of Page/Signature)
  doc.line(pageWidth - margin, tableTop, pageWidth - margin, y);

  // Bottom Border
  doc.line(margin, y, pageWidth - margin, y);

  // Save
  doc.save(`${employee.name}_Payslip_${monthYear}.pdf`);
};
