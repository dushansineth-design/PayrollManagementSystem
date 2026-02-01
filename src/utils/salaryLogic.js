
export const calculateSalary = (emp) => {
    const basicSalary = parseFloat(emp.basicSalary) || 0;
    const workingDays = parseFloat(emp.workingDays) || 0;
    const noPayDays = parseFloat(emp.noPayDays) || 0;
    const workedWeekendDays = parseFloat(emp.workedWeekendDays) || 0;
    const workedPoyaDays = parseFloat(emp.workedPoyaDays) || 0;
    const workedMercDays = parseFloat(emp.workedMercDays) || 0;
    const otHours = parseFloat(emp.otHours) || 0;
    const perfScore = parseFloat(emp.perfScore) || 0;
    const deductionAdvance = parseFloat(emp.deductionAdvance) || 0;
    const deductionLoan = parseFloat(emp.deductionLoan) || 0;
    const deductionWelfare = parseFloat(emp.deductionWelfare) || 0;

    // --- Allowances ---

    // Att Allowances
    // if working days = 30, Att Allowances = 10000
    // if 25=< working days <30 , Att Allowances = 5000
    // if working days < 25, Att Allowances = 0
    let attAllowance = 0;
    if (workingDays >= 30) {
        attAllowance = 10000;
    } else if (workingDays >= 25) {
        attAllowance = 5000;
    } else {
        attAllowance = 0;
    }

    // Perf Allowances
    // < 60% : No allowance
    // 60–69% : 5% of BASIC SALARY
    // 70–79% : 10% of BASIC SALARY
    // 80–89% : 15% of BASIC SALARY
    // ≥ 90% : 20% of BASIC SALARY
    let perfAllowance = 0;
    if (perfScore >= 90) {
        perfAllowance = basicSalary * 0.20;
    } else if (perfScore >= 80) {
        perfAllowance = basicSalary * 0.15;
    } else if (perfScore >= 70) {
        perfAllowance = basicSalary * 0.10;
    } else if (perfScore >= 60) {
        perfAllowance = basicSalary * 0.05;
    } else {
        perfAllowance = 0;
    }

    // --- Deductions ---
    const totalDeduction = deductionAdvance + deductionLoan + deductionWelfare;

    // --- Standard Calcs ---
    // Formula: NoPay = (Basic Salary/30) x Nopay amount Day
    const noPayAmount = (basicSalary / 30) * noPayDays;

    // Adjusted Basic
    const adjustedBasic = basicSalary - noPayAmount;

    // week Holiday pay = (Basic Salary/30) x 1.5 x weekday & work
    const weekHolidayPay = (basicSalary / 30) * 1.5 * workedWeekendDays;

    // Poya Amount = (Basic Salary/30) x 1.5 x Merc holiday
    const poyaAmount = (basicSalary / 30) * 1.5 * workedPoyaDays;

    // Merc holi Amount = (Basic Salary/30) x Merc holiday
    const mercAmount = (basicSalary / 30) * workedMercDays;

    // OT Amount = (Basic salary/240) x 1.5   * OT Hours
    const otAmount = (basicSalary / 240) * 1.5 * otHours;

    // Total Earnings
    // defined as: adjustedBasic + weekHolidayPay + poyaAmount + mercAmount + Att Allowances + Perf Allowances - Total Deduction
    const totalEarnings = adjustedBasic + weekHolidayPay + poyaAmount + mercAmount + attAllowance + perfAllowance - totalDeduction;

    // EPF = (Total/100) x 8
    const epf8 = (totalEarnings / 100) * 8;
    const epf12 = (totalEarnings / 100) * 12;
    const etf3 = (totalEarnings / 100) * 3;

    // Net Salary
    // Net Salary = Total Earnings (which already has deduction subtracted) + OT - EPF.
    const netSalary = totalEarnings + otAmount - epf8;

    return {
        originalBasic: basicSalary.toFixed(2),
        workingDays: workingDays,
        attAllowance: attAllowance.toFixed(2),
        perfScore: perfScore,
        perfAllowance: perfAllowance.toFixed(2),
        instance: emp.instance || 0,

        noPayAmount: noPayAmount.toFixed(2),
        adjustedBasic: adjustedBasic.toFixed(2),
        weekHolidayPay: weekHolidayPay.toFixed(2),
        poyaAmount: poyaAmount.toFixed(2),
        mercAmount: mercAmount.toFixed(2),
        otAmount: otAmount.toFixed(2),

        totalDeduction: totalDeduction.toFixed(2),

        totalEarnings: totalEarnings.toFixed(2),
        epf8: epf8.toFixed(2),
        epf12: epf12.toFixed(2),
        etf3: etf3.toFixed(2),
        netSalary: netSalary.toFixed(2)
    };
};
