// String helper functions
function truncateString(str, maxLength) {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function sanitizeInput(input) {
    return input.replace(/[<>]/g, '');
}

// Export functions for use in other files
window.stringHelpers = {
    truncateString,
    formatDate,
    sanitizeInput
}; 