using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HomeOwner.Models
{
    public class RentPayment
    {
        [Key]
        public int payment_id { get; set; }
        
        [Required]
        public int user_id { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal amount { get; set; }
        
        [Required]
        public DateTime due_date { get; set; }
        
        [Required]
        public string status { get; set; } // "Paid", "Unpaid", "Overdue"
        
        public DateTime? payment_date { get; set; }
        
        public string? payment_method { get; set; }
        
        public string? transaction_id { get; set; }
        
        public DateTime date_created { get; set; }
        
        // Navigation property
        [ForeignKey("user_id")]
        public virtual User HomeOwner { get; set; }
    }
} 