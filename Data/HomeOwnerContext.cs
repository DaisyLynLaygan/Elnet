using System;
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
        }

        public DbSet<HomeOwner.Models.User> User { get; set; } = default!;
        public DbSet<HomeOwner.Models.Announcement> Announcement { get; set; } = default!;
        public DbSet<HomeOwner.Models.Post> Post { get; set; } = default!;
        public DbSet<HomeOwner.Models.Comment> Comment { get; set; } = default!;
          public DbSet<HomeOwner.Models.Report> Report { get; set; } = default!;
    }
}
