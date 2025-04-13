// wwwroot/js/stringHelpers.js
class StringHelpers {
  static firstLetterToUpper(str) {
    if (!str || typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  static toHumanReadable(str) {
    if (!str || typeof str !== "string") return str;
    return str
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camelCase
      .split(" ") // Split into words
      .map((word) => this.firstLetterToUpper(word)) // Capitalize each
      .join(" "); // Rejoin with spaces
  }

  static formatPrice(price) {
    if (isNaN(price)) return "$0.00";
    return "$" + parseFloat(price).toFixed(2);
  }
  static formatDate(date, options = {}) {
    if (!date) return "Not specified";

    // Handle both string and Date objects
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "Invalid date";

    const defaultOptions = {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return parsedDate.toLocaleString("en-US", {
      ...defaultOptions,
      ...options,
    });
  }

  static formatDateOnly(date) {
    return this.formatDate(date, { hour: undefined, minute: undefined });
  }
}

// Make it available globally
window.StringHelpers = StringHelpers; // wwwroot/js/stringHelpers.js
