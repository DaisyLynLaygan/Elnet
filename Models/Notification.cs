using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HomeOwner.Models
{
    public class Notification
    {
        [Key]
        public int notification_id { get; set; }

        [ForeignKey("User")]
        public int user_id { get; set; }

        [Required]
        public string title { get; set; }

        [Required]
        public string message { get; set; }

        [Required]
        public DateTime created_date { get; set; } = DateTime.Now;

        public bool is_read { get; set; } = false;

        // Notification types: service_request, payment, announcement, etc.
        [Required]
        public string type { get; set; }

        // Reference to the related entity (e.g., service_request_id)
        public string reference_id { get; set; }

        // Associated user (notification recipient)
        public virtual User User { get; set; }
    }
} 