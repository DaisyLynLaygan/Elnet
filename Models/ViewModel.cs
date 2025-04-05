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




    }
}
