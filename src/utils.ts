/**
 * Utility functions for the Trade Tracker application
 */

/**
 * Get current date string in EST timezone formatted as MM.DD.YYYY
 */
export const getESTDateString = (): string => {
  const now = new Date();
  const estDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const month = String(estDate.getMonth() + 1).padStart(2, '0');
  const day = String(estDate.getDate()).padStart(2, '0');
  const year = estDate.getFullYear();
  return `${month}.${day}.${year}`;
};
