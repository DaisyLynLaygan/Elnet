using System.ComponentModel.DataAnnotations;

namespace HomeOwner.Models
{

    //Ana daisy wala ni labot HAHAH
    public class Register
    {
        [Key]
        public int user_id { get; set; }
        [Required]
        public string? username { get; set; }
        public string? user_password { get; set; }
        [EmailAddress]
        public string? email { get; set; }
        public string? address { get; set; }
        public string? contact_no { get; set; }

    }
}
