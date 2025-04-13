using System.Globalization;

namespace HomeOwner.Helpers
{
    public static class StringHelpers
    {
        public static string FirstLetterToUpper(string str)
        {
            if (string.IsNullOrEmpty(str))
                return str;


            return string.IsNullOrWhiteSpace(str)
                ? str
                : char.ToUpper(str[0]) + str.Substring(1).ToLower();
        }
        public static string ToHumanReadable(this string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return input;


            var withSpaces = input.Replace('_', ' ');


            var textInfo = CultureInfo.CurrentCulture.TextInfo;
            return textInfo.ToTitleCase(withSpaces.ToLower());
        }

        public static string FormatDate(DateTime? date)
        {
            if (date == null)
                return "Not specified";

            return date.Value.ToString("MMM dd, yyyy HH:mm");
        }
        public static string FormatDateString(string dateString)
        {
            if (string.IsNullOrEmpty(dateString))
                return "Not specified";

            if (DateTime.TryParse(dateString, out DateTime date))
            {
                return date.ToString("MMM dd, yyyy");
            }

            return dateString; // Return original if parsing fails
        }

        public static string FormatTimeString(string timeString)
        {
            if (string.IsNullOrEmpty(timeString))
                return "Not specified";

            if (DateTime.TryParse(timeString, out DateTime time))
                return time.ToString("hh:mm tt");

            return timeString; // Fallback to original if parsing fails
        }

        // Combined date+time formatter
        public static string FormatDateTimeString(string dateTimeString)
        {
            if (string.IsNullOrEmpty(dateTimeString))
                return "Not specified";

            if (DateTime.TryParse(dateTimeString, out DateTime dateTime))
                return dateTime.ToString("MMM dd, yyyy hh:mm tt");

            return dateTimeString;
        }
    


    }
}