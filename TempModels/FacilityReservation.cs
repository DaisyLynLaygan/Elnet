using System;
using System.Collections.Generic;

namespace HomeOwner.TempModels;

public partial class FacilityReservation
{
    public int ReservationId { get; set; }

    public int UserId { get; set; }

    public int FacilityId { get; set; }

    public DateTime ReservationDate { get; set; }

    public string ReservationTime { get; set; } = null!;

    public int DurationHours { get; set; }

    public int GuestCount { get; set; }

    public string Purpose { get; set; } = null!;

    public decimal Price { get; set; }

    public string Status { get; set; } = null!;

    public string PaymentStatus { get; set; } = null!;

    public DateTime DateCreated { get; set; }

    public string? StaffNotes { get; set; }
}
