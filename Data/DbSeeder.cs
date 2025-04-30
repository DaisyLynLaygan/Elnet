using System;
using System.Linq;
using System.Threading.Tasks;
using HomeOwner.Models;
using Microsoft.EntityFrameworkCore;

namespace HomeOwner.Data
{
    public static class DbSeeder
    {
        public static async Task SeedFacilities(HomeOwnerContext context)
        {
            try
            {
                // Check if we need to seed facilities
                if (!context.Facility.Any())
                {
                    Console.WriteLine("Seeding facilities into the database...");
                    
                    // Create facilities with the SQL Server identity insert ON
                    // This approach bypasses the EF Core identity issue
                    
                    await context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT [Facility] ON");
                    
                    await context.Database.ExecuteSqlRawAsync(@"
                        INSERT INTO [Facility] ([facility_id], [name], [description], [image_path], [overall_rating], [review_count], [cleanliness_rating], [equipment_rating], [staff_rating], [value_rating])
                        VALUES 
                        (1, 'Function Hall', 'A spacious hall perfect for events and gatherings', '/images/function-hall.jpg', 4.8, 124, 4.6, 4.4, 4.5, 4.3),
                        (2, 'Sports Court', 'Multi-purpose sports court for basketball and other activities', '/images/sports-court.jpg', 4.6, 87, 4.5, 4.3, 4.4, 4.7),
                        (3, 'Swimming Pool', 'Olympic-sized swimming pool with lifeguards', '/images/swimming-pool.jpg', 4.9, 156, 4.8, 4.7, 4.9, 4.8),
                        (4, 'Gym Facility', 'Fully equipped gym with modern exercise equipment', '/images/gym.jpg', 4.7, 203, 4.6, 4.8, 4.7, 4.5)
                    ");
                    
                    await context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT [Facility] OFF");
                    
                    Console.WriteLine("Facilities seeded successfully");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error seeding facilities: {ex.Message}");
                // If there's an issue with the DB, we'll handle display in the controller
            }
        }
    }
} 