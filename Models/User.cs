using System.ComponentModel.DataAnnotations;

namespace HomeOwner.Models
{
    public class User
    {
        [Key]
        public int user_id { get; set; }
        [Required]
        public string? username { get; set; }
        public string? firstname { get; set; }
        public string? lastname{ get; set; }

        public string? user_password { get; set; }
        [EmailAddress]
        public string? email { get; set; }
        public string? address { get; set; }
        public string? contact_no { get; set; }

        public DateOnly? date_created { get; set; }

    }
}
