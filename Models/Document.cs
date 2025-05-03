using System;
using System.ComponentModel.DataAnnotations;

namespace HomeOwner.Models
{
    public class Document
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "File Name")]
        public string FileName { get; set; }

        [Required]
        [Display(Name = "File Type")]
        public string FileType { get; set; }

        [Required]
        [Display(Name = "File Size (bytes)")]
        public long FileSize { get; set; }

        [Required]
        [Display(Name = "File URL/Path")]
        public string FileUrl { get; set; } // e.g., "/uploads/documents/myfile.pdf"

        [Required]
        [Display(Name = "Default Visibility")]
        public VisibilityLevel Visibility { get; set; }

        [Display(Name = "Apply watermark with user info to PDFs")]
        public bool ApplyWatermark { get; set; }

        [Display(Name = "Disable downloading (view only)")]
        public bool DisableDownload { get; set; }

        public DateTime UploadDate { get; set; } = DateTime.UtcNow;

        [Display(Name = "Uploaded By")]
        public string UploadedBy { get; set; } // could link to user ID or name
    }

    public enum VisibilityLevel
    {
        Admin,
        Public,
        Private,
        Group
    }
}
