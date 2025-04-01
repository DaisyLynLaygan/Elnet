namespace HomeOwner.Models
{
    public class ViewModel
    {
        public List<User>? Users { get; set; }
        public User newUser { get; set; }
        public string? ErrorMessage { get; set; }


        public List<Announcement>? Announcements { get; set; }
        public Announcement newAnnouncement { get; set; }
    }
}
