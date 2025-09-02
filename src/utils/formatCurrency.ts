export const formatCurrency = (
  amount: number,
  currency: string = "USD"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (number: number, decimals: number = 2): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

export const formatPercentage = (
  value: number,
  decimals: number = 2
): string => {
  return `${value.toFixed(decimals)}%`;
};

export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[^0-9.-]+/g, ""));
};

export const calculateInterest = (
  principal: number,
  rate: number,
  time: number
): number => {
  return (principal * rate * time) / 100;
};

export const calculateMonthlyPayment = (
  principal: number,
  rate: number,
  term: number
): number => {
  const monthlyRate = rate / 100 / 12;
  const numberOfPayments = term;

  if (monthlyRate === 0) return principal / numberOfPayments;

  return (
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
};

export const calculateTotalAmount = (
  principal: number,
  rate: number,
  term: number
): number => {
  const monthlyPayment = calculateMonthlyPayment(principal, rate, term);
  return monthlyPayment * term;
};
