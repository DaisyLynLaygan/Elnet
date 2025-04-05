using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace HomeOwner.Models
{
   public class Post
{
    [Key]
    public int post_id { get; set; }

    public string? content { get; set; }
    public DateTime? created_date { get; set; }
    public DateTime? updated_date { get; set; }
     public string? ImagePath { get; set; } 
      [NotMapped] // Exclude from database
        public IFormFile? ImageFile { get; set; }
    // Foreign key
        public int? user_id { get; set; }
    
    // Navigation property
    [ForeignKey("user_id")]
    public User? Author { get; set; }  
    
    public ICollection<Comment>? Comments { get; set; }
}

public class Comment
{
    [Key]
    public int comment_id { get; set; }

    public string? content { get; set; }
    public DateTime? created_date { get; set; }
    public DateTime? updated_date { get; set; }

    // Foreign key to User
    public int? author_id { get; set; }  // Changed from user_id to author_id
    
    // Navigation property
    [ForeignKey("author_id")]
    public User? Author { get; set; }  // Renamed from 'user' to 'Author'

    // Foreign key to Post
    public int? post_id { get; set; }
    
    // Navigation property
    [ForeignKey("post_id")]
    public Post? Post { get; set; }
}


    
}