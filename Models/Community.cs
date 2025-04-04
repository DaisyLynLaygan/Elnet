
using System.ComponentModel.DataAnnotations;

namespace HomeOwner.Models
{
    public class Post
    {
        [Key]
        public int post_id { get; set; }

        [Required]


        public string? content { get; set; }
        public DateTime? created_date { get; set; }
        public DateTime? updated_date { get; set; }
        public int? user_id { get; set; }
        public User? user { get; set; }
    }
    public class Comment
    {
        [Key]
        public int comment_id { get; set; }

        [Required]
        public string? content { get; set; }
        public DateTime? created_date { get; set; }
        public DateTime? updated_date { get; set; }

        public int? user_id { get; set; }
        public User? user { get; set; }

        public int? post_id { get; set; }
        public Post? post { get; set; }
    }
}