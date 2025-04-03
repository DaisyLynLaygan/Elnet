using System.ComponentModel.DataAnnotations;

namespace HomeOwner.Models
{
    public class Announcement
    {
        [Key]
        public int announcement_id { get; set; }
        
        [Required]
        public string? title { get; set; }
        
        public string? content { get; set; }
        public DateTime? start_date { get; set; }
        public DateTime? end_date { get; set; }
        public string? priority { get; set; }
        public string? status { get; set; }
        public string? author { get; set; }
    }
}