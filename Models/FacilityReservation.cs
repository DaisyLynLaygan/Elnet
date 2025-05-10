using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HomeOwner.Models
{
    public class FacilityReservation
    {
        [Key]
        public int reservation_id { get; set; }
        
        [Required]
        public int user_id { get; set; }
        
        [Required]
        public int facility_id { get; set; }
        
        [Required]
        public DateTime reservation_date { get; set; }
        
        [Required]
        public string reservation_time { get; set; }
        
        [Required]
        public int duration_hours { get; set; }
        
        [Required]
        public int guest_count { get; set; }
        
        [Required]
        public string purpose { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal price { get; set; }
        
        [Required]
        public string status { get; set; } // Pending, Approved, Rejected, Cancelled, Completed
        
        [Required]
        public string payment_status { get; set; } // Unpaid, Paid
        
        public string? staff_notes { get; set; }
        
        public DateTime date_created { get; set; }
        
        // Navigation properties
        [ForeignKey("user_id")]
        public virtual User User { get; set; }
        
        [ForeignKey("facility_id")]
        public virtual Facility Facility { get; set; }
    }
} 