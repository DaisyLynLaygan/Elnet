/**
 * String helper utility functions
 */

/**
 * Formats a date to a readable string
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

/**
 * Formats a price to a currency string
 * @param {number|string} price - Price to format
 * @returns {string} - Formatted price string
 */
function formatPrice(price) {
    try {
        const numPrice = parseFloat(price);
        return `$${numPrice.toFixed(2)}`;
    } catch (error) {
        console.error('Error formatting price:', error);
        return price;
    }
}

/**
 * Truncates a string to a specified length and adds ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated text with ellipsis if needed
 */
function truncateText(text, maxLength = 100) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Capitalizes the first letter of each word in a string
 * @param {string} text - Text to capitalize
 * @returns {string} - Text with capitalized words
 */
function capitalizeWords(text) {
    if (!text) return '';
    return text.replace(/\w\S*/g, (word) => {
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
}

/**
 * Sanitizes text to prevent XSS attacks
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
function sanitizeText(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
} 