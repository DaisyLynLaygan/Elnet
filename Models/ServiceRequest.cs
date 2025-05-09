using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HomeOwner.Models
{
    public class ServiceRequest
    {
        [Key]
        public int request_id { get; set; }

        [ForeignKey("User")]
        public int user_id { get; set; }

        [Required]
        public string service_type { get; set; } = string.Empty;

        [Required]
        public string service_icon { get; set; } = string.Empty;

        [Column(TypeName = "decimal(10,2)")]
        public decimal price { get; set; }

        [Required]
        public string frequency { get; set; } = string.Empty;

        public DateTime scheduled_date { get; set; }

        [Required]
        public string scheduled_time { get; set; } = string.Empty;

        [Required]
        public string status { get; set; } = "Pending Approval";

        [Required]
        public string payment_status { get; set; } = "Unpaid";

        [Required]
        public string notes { get; set; } = string.Empty;
        
        public string staffNotes { get; set; } = string.Empty;

        public DateTime date_created { get; set; } = DateTime.Now;

        public virtual User User { get; set; } = null!;
    }
} 