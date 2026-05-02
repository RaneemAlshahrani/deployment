// frontend/src/utils/currency.js

/**
 * Format price in Saudi Riyal (SAR)
 * @param {number} price - The price to format
 * @returns {string} Formatted price with SAR symbol
 */
export const formatSAR = (price) => {
  if (price === undefined || price === null) return "0 SAR";
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return "0 SAR";
  return `${numPrice.toFixed(2)} SAR`;
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

// Global constant for SAR
export const CURRENCY = {
  code: "SAR",
  symbol: "﷼",
  name: "Saudi Riyal",
  locale: "ar-SA",
};