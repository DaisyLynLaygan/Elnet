using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace HomeOwner.Models
{
    public class Report
    {
        [Key]
        public int report_id { get; set; }

        public string? report_type { get; set; }
        public string? report_facility { get; set; }
        public string? report_severity { get; set; }
        public string? report_description { get; set; }
        public DateTime? created_date { get; set; }
        public DateTime? updated_date { get; set; }

        // Foreign key to User
        public int? user_id { get; set; }  // Changed from user_id to author_id
        
        // Navigation property
        [ForeignKey("user_id")]
        public User? Author { get; set; }  // Renamed from 'user' to 'Author'

        
    }
}
