using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HomeOwner.Models
{
    public class Feedback
    {
        [Key]
        public int feedback_id { get; set; }

        [Required]
        public int facility_id { get; set; }

        [Required]
        public int user_id { get; set; }

        [Required]
        [Column(TypeName = "decimal(3,1)")]
        public decimal overall_rating { get; set; }

        [Required]
        [Column(TypeName = "decimal(3,1)")]
        public decimal cleanliness_rating { get; set; }

        [Required]
        [Column(TypeName = "decimal(3,1)")]
        public decimal equipment_rating { get; set; }

        [Required]
        [Column(TypeName = "decimal(3,1)")]
        public decimal staff_rating { get; set; }

        [Required]
        [Column(TypeName = "decimal(3,1)")]
        public decimal value_rating { get; set; }

        [Required]
        [StringLength(200)]
        public string title { get; set; }

        [Required]
        public string comment { get; set; }

        public string photos { get; set; } // Store as JSON string of photo paths

        public DateTime created_date { get; set; }

        public DateTime? updated_date { get; set; }

        [ForeignKey("user_id")]
        public User User { get; set; }
    }

    public class Facility
    {
        [Key]
        public int facility_id { get; set; }

        [Required]
        [StringLength(100)]
        public string name { get; set; }

        public string description { get; set; }

        public string image_path { get; set; }

        [Column(TypeName = "decimal(3,1)")]
        public decimal overall_rating { get; set; }

        public int review_count { get; set; }

        [Column(TypeName = "decimal(3,1)")]
        public decimal cleanliness_rating { get; set; }

        [Column(TypeName = "decimal(3,1)")]
        public decimal equipment_rating { get; set; }

        [Column(TypeName = "decimal(3,1)")]
        public decimal staff_rating { get; set; }

        [Column(TypeName = "decimal(3,1)")]
        public decimal value_rating { get; set; }
    }
} 