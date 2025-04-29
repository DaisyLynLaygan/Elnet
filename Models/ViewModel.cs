using System.ComponentModel.DataAnnotations;

namespace HomeOwner.Models
{
    public class ViewModel
    {
        //Properties for User and Announcement
        public List<User>? Users { get; set; }
        public User newUser { get; set; }
        public string? ErrorMessage { get; set; }


        public List<Announcement>? Announcements { get; set; }
        public Announcement newAnnouncement { get; set; }


        //Properties for Post and Comment
        public List<Post>? Posts { get; set; }
        public Post newPost { get; set; }
        public string? PostErrorMessage { get; set; }
        public List<Comment>? Comments { get; set; }
        public Comment newComment { get; set; }


        public class ServiceRequestViewModel
        {
            [Required]
            public string ServiceType { get; set; } = string.Empty;

            [Required]
            public string ServiceIcon { get; set; } = string.Empty;

            [Required]
            public decimal Price { get; set; }

            [Required]
            public string Frequency { get; set; } = string.Empty;

            [Required]
            public DateTime ScheduledDate { get; set; }

            [Required]
            public string ScheduledTime { get; set; } = string.Empty;

            [Required]
            public string Notes { get; set; } = string.Empty;
        }
    }
}
