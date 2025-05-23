﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HomeOwner.Models;

namespace HomeOwner.Data
{
    public class HomeOwnerContext : DbContext
    {
        public HomeOwnerContext(DbContextOptions<HomeOwnerContext> options)
            : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Post-User relationship
            modelBuilder.Entity<Post>()
                .HasOne(p => p.Author)
                .WithMany(u => u.Posts)
                .HasForeignKey(p => p.user_id)
                .OnDelete(DeleteBehavior.Restrict);

            // Comment-User relationship
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Author)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.author_id)
                .OnDelete(DeleteBehavior.Restrict);

            // Comment-Post relationship
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.post_id)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Report>()
                .HasOne(r => r.Author)
                .WithMany(u => u.Reports)
                .HasForeignKey(r => r.user_id)
                .OnDelete(DeleteBehavior.Restrict);

            // ServiceRequest-User relationship
            modelBuilder.Entity<ServiceRequest>()
                .HasOne(s => s.User)
                .WithMany(u => u.ServiceRequests)
                .HasForeignKey(s => s.user_id)
                .OnDelete(DeleteBehavior.Restrict);

            // Notification-User relationship
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.user_id)
                .OnDelete(DeleteBehavior.Cascade);

            // FacilityReservation-User relationship
            modelBuilder.Entity<FacilityReservation>()
                .HasOne(f => f.User)
                .WithMany()
                .HasForeignKey(f => f.user_id)
                .OnDelete(DeleteBehavior.Restrict);

            // FacilityReservation-Facility relationship
            modelBuilder.Entity<FacilityReservation>()
                .HasOne(f => f.Facility)
                .WithMany()
                .HasForeignKey(f => f.facility_id)
                .OnDelete(DeleteBehavior.Restrict);

            // RentPayment-User relationship
            modelBuilder.Entity<RentPayment>()
                .HasOne(r => r.HomeOwner)
                .WithMany(u => u.RentPayments)
                .HasForeignKey(r => r.user_id)
                .OnDelete(DeleteBehavior.Restrict);

            // Document-User relationship
            modelBuilder.Entity<Document>()
                .HasOne(d => d.Uploader)
                .WithMany()
                .HasForeignKey(d => d.uploader_id)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure decimal precision for price
            modelBuilder.Entity<ServiceRequest>()
                .Property(s => s.price)
                .HasColumnType("decimal(10,2)");

            // Configure decimal precision for FacilityReservation price
            modelBuilder.Entity<FacilityReservation>()
                .Property(f => f.price)
                .HasColumnType("decimal(10,2)");
                
            // Configure decimal precision for RentPayment amount
            modelBuilder.Entity<RentPayment>()
                .Property(r => r.amount)
                .HasColumnType("decimal(10,2)");
        }

        public DbSet<HomeOwner.Models.User> User { get; set; } = default!;
        public DbSet<HomeOwner.Models.Announcement> Announcement { get; set; } = default!;
        public DbSet<HomeOwner.Models.Post> Post { get; set; } = default!;
        public DbSet<HomeOwner.Models.Comment> Comment { get; set; } = default!;
        public DbSet<HomeOwner.Models.Report> Report { get; set; } = default!;
        public DbSet<ServiceRequest> ServiceRequest { get; set; }
        public DbSet<Feedback> Feedback { get; set; }
        public DbSet<Facility> Facility { get; set; }
        public DbSet<Notification> Notification { get; set; }
        public DbSet<FacilityReservation> FacilityReservation { get; set; }
        public DbSet<RentPayment> RentPayment { get; set; }
        public DbSet<Document> Document { get; set; }
    }
}
