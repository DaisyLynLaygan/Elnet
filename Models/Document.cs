using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HomeOwner.Models
{
    public class Document
    {
        [Key]
        public int document_id { get; set; }
        
        [Required]
        public string name { get; set; } = string.Empty;
        
        [Required]
        public string file_path { get; set; } = string.Empty;
        
        public string? file_type { get; set; }
        
        public long file_size { get; set; }
        
        public string? description { get; set; }
        
        [Required]
        public string visibility { get; set; } = "admin"; // "admin", "staff", "homeowner"
        
        public bool allow_download { get; set; } = true;
        
        public bool apply_watermark { get; set; } = false;
        
        [Required]
        public DateTime upload_date { get; set; }
        
        public DateTime? expiration_date { get; set; }
        
        // Optional category for organizing documents
        public string? category { get; set; }
        
        // User who uploaded the document
        [Required]
        public int uploader_id { get; set; }
        
        [ForeignKey("uploader_id")]
        public User? Uploader { get; set; }
        
        // Tracking downloads and views
        public int download_count { get; set; } = 0;
        public int view_count { get; set; } = 0;
    }
} 