using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization; 

namespace HomeOwner.Models
{
  public abstract class ServiceRequest
{
    [Key]
    public int request_id { get; set; }
    
    // Common properties
    public string? status { get; set; }
    public DateTime? created_date { get; set; } = DateTime.Now;
    
    [ForeignKey("user_id")]
    public int? user_id { get; set; }
    public User? Author { get; set; }
    
    public StaffBooking? StaffBooking { get; set; }
}

    public class MaintenanceRequest : ServiceRequest
    {
        public string? service_name { get; set; }
        public string? service_date { get; set; }
        public string? service_time { get; set; }
        public string? frequency { get; set; }
        public string? notes { get; set; }
        public double? price { get; set; }
    [NotMapped]
   public string priceString 
{
    get => price.HasValue ? price.Value.ToString("C") : "0.00";
    set => price = double.TryParse(value?.Replace("$", "").Replace(",", ""), 
                  NumberStyles.Any, 
                  CultureInfo.InvariantCulture, 
                  out var p) ? p : 0;
}
}

    public class FacilityRequest : ServiceRequest
    {
        public string? facility_name { get; set; }
        public string? facility_date { get; set; }
        public string? facility_time { get; set; }
        public string? duration { get; set; }
        public int? guest_number { get; set; }
        public string? purpose { get; set; }
        public double? price { get; set; }
    [NotMapped]
     public string priceString 
{
    get => price.HasValue ? price.Value.ToString("C") : "0.00";
    set => price = double.TryParse(value?.Replace("$", "").Replace(",", ""), 
                  NumberStyles.Any, 
                  CultureInfo.InvariantCulture, 
                  out var p) ? p : 0;
}
}

public class StaffBooking
{
    [Key]
    public int booking_id { get; set; }
    
    // Foreign key to ServiceRequest
    [ForeignKey("ServiceRequest")]
    public int? request_id { get; set; }
    
    // Navigation property
    public ServiceRequest? ServiceRequest { get; set; }
    
    // Other properties...
    public string? staff_name { get; set; }
    public string? status { get; set; }
    public DateTime? assigned_date { get; set; } = DateTime.Now;
    
    [ForeignKey("user_id")]
    public int? user_id { get; set; }
    public User? Author { get; set; }
}
}