using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HomeOwner.Models
{
    public class Event
    {
        [Key]
        public int event_id { get; set; }

        [Required]
        public string title { get; set; }

        [Required]
        public DateTime event_date { get; set; }

        [Required]
        public string start_time { get; set; }

        [Required]
        public string end_time { get; set; }

        [Required]
        public string location { get; set; }

        public string description { get; set; }

        public string organizer { get; set; }

        public string contact_email { get; set; }

        [Required]
        public int capacity { get; set; }

        public int rsvp_count { get; set; }

        public string image_url { get; set; }

        public bool is_featured { get; set; }

        public string tags { get; set; }

        public DateTime created_at { get; set; }

        public DateTime? updated_at { get; set; }
        
        // Many-to-many relationship with User through EventParticipant
        public ICollection<EventParticipant> Participants { get; set; }
    }

    public class EventParticipant
    {
        [Key]
        public int participant_id { get; set; }

        [Required]
        public int event_id { get; set; }

        [Required]
        public int user_id { get; set; }

        [Required]
        public string participant_type { get; set; } // homeowner, staff, admin

        public DateTime registered_at { get; set; }

        // Navigation properties
        [ForeignKey("event_id")]
        public Event Event { get; set; }

        [ForeignKey("user_id")]
        public User User { get; set; }
    }
} 