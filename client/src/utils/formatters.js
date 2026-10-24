/**
 * MentorConnect AI — Shared Presentation Formatters
 */

/**
 * Format currency amounts nicely (e.g., $49 or Free)
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === 0 || amount === '0') return 'Free';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${amount}`;
  }
};

/**
 * Format date consistently across platform
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  try {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    };
    return new Date(dateString).toLocaleDateString('en-US', defaultOptions);
  } catch {
    return String(dateString);
  }
};

/**
 * Truncate long strings with ellipses
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};

/**
 * Get color tokens for AMIE match scores
 */
export const getMatchScoreColor = (score) => {
  if (score >= 90) return '#057642'; // Emerald green
  if (score >= 75) return '#0a66c2'; // Primary blue
  if (score >= 60) return '#b24020'; // Warm amber/orange
  return '#666666';
};
