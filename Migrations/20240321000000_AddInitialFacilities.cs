using Microsoft.EntityFrameworkCore.Migrations;

namespace HomeOwner.Migrations
{
    public partial class AddInitialFacilities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Facility",
                columns: new[] { "facility_id", "name", "description", "image_path", "overall_rating", "review_count", "cleanliness_rating", "equipment_rating", "staff_rating", "value_rating" },
                values: new object[,]
                {
                    {
                        1,
                        "Function Hall",
                        "A spacious hall perfect for weddings, corporate events, and social gatherings",
                        "/images/function-hall.jpg",
                        4.8m,
                        124,
                        4.6m,
                        4.4m,
                        4.5m,
                        4.3m
                    },
                    {
                        2,
                        "Sports Court",
                        "Multi-purpose sports court for basketball, volleyball, and other sports",
                        "/images/sports-court.jpg",
                        4.6m,
                        87,
                        4.5m,
                        4.3m,
                        4.4m,
                        4.7m
                    },
                    {
                        3,
                        "Swimming Pool",
                        "Olympic-sized swimming pool with lifeguards and proper safety measures",
                        "/images/swimming-pool.jpg",
                        4.9m,
                        156,
                        4.8m,
                        4.7m,
                        4.9m,
                        4.8m
                    },
                    {
                        4,
                        "Gym Facility",
                        "Fully equipped gym with modern equipment and professional trainers",
                        "/images/gym.jpg",
                        4.7m,
                        203,
                        4.6m,
                        4.8m,
                        4.7m,
                        4.5m
                    }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Facility",
                keyColumn: "facility_id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Facility",
                keyColumn: "facility_id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Facility",
                keyColumn: "facility_id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Facility",
                keyColumn: "facility_id",
                keyValue: 4);
        }
    }
} 