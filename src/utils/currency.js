// frontend/src/utils/currency.js

/**
 * Format price in Saudi Riyal (SAR)
 * @param {number|string} price - The price to format
 * @returns {string} Formatted price with SAR symbol
 */
export const formatSAR = (price) => {
  if (price === undefined || price === null) return "0 ﷼";
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return "0 ﷼";
  return `${numPrice.toFixed(2)} ﷼`;
};

/**
 * Format price without decimal places for display
 * @param {number|string} price - The price to format
 * @returns {string} Formatted price with SAR symbol (no decimals)
 */
export const formatSARSimple = (price) => {
  if (price === undefined || price === null) return "0 ﷼";
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return "0 ﷼";
  return `${Math.round(numPrice)} ﷼`;
};

/**
 * Parse SAR string back to number
 * @param {string} sarString - SAR formatted string
 * @returns {number} Numeric value
 */
export const parseSAR = (sarString) => {
  if (!sarString) return 0;
  const match = sarString.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

/**
 * Get SAR symbol for display
 * @returns {string} SAR symbol
 */
export const getSARIcon = () => "﷼";

/**
 * Format number as currency with SAR
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
export const toSAR = (amount) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const CURRENCY = {
  code: "SAR",
  symbol: "﷼",
  name: "Saudi Riyal",
  locale: "ar-SA",
  exchangeRate: 1,
};