using System;
using System.Collections.Generic;
using HomeOwner.TempModels;
using Microsoft.EntityFrameworkCore;

namespace HomeOwner.TempContext;

public partial class HomeOwnerContext62e5969a7f62421f8ff54fad4059ba16Context : DbContext
{
    public HomeOwnerContext62e5969a7f62421f8ff54fad4059ba16Context()
    {
    }

    public HomeOwnerContext62e5969a7f62421f8ff54fad4059ba16Context(DbContextOptions<HomeOwnerContext62e5969a7f62421f8ff54fad4059ba16Context> options)
        : base(options)
    {
    }

    public virtual DbSet<FacilityReservation> FacilityReservations { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=(localdb)\\mssqllocaldb;Initial Catalog=HomeOwnerContext-62e5969a-7f62-421f-8ff5-4fad4059ba16");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FacilityReservation>(entity =>
        {
            entity.HasKey(e => e.ReservationId);

            entity.ToTable("FacilityReservation");

            entity.Property(e => e.ReservationId).HasColumnName("reservation_id");
            entity.Property(e => e.DateCreated).HasColumnName("date_created");
            entity.Property(e => e.DurationHours).HasColumnName("duration_hours");
            entity.Property(e => e.FacilityId).HasColumnName("facility_id");
            entity.Property(e => e.GuestCount).HasColumnName("guest_count");
            entity.Property(e => e.PaymentStatus).HasColumnName("payment_status");
            entity.Property(e => e.Price)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("price");
            entity.Property(e => e.Purpose).HasColumnName("purpose");
            entity.Property(e => e.ReservationDate).HasColumnName("reservation_date");
            entity.Property(e => e.ReservationTime).HasColumnName("reservation_time");
            entity.Property(e => e.StaffNotes).HasColumnName("staff_notes");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.UserId).HasColumnName("user_id");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
