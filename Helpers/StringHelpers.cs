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
    }
}