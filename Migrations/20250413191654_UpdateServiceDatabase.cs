using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeOwner.Migrations
{
    /// <inheritdoc />
    public partial class UpdateServiceDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ServiceRequest",
                columns: table => new
                {
                    request_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    created_date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    user_id = table.Column<int>(type: "int", nullable: true),
                    Authoruser_id = table.Column<int>(type: "int", nullable: true),
                    RequestType = table.Column<string>(type: "nvarchar(21)", maxLength: 21, nullable: false),
                    facility_name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    facility_date = table.Column<DateOnly>(type: "date", nullable: true),
                    facility_time = table.Column<DateTime>(type: "datetime2", nullable: true),
                    duration = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    guest_number = table.Column<int>(type: "int", nullable: true),
                    purpose = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FacilityRequest_price = table.Column<double>(type: "float", nullable: true),
                    service_name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    service_date = table.Column<DateOnly>(type: "date", nullable: true),
                    service_time = table.Column<DateTime>(type: "datetime2", nullable: true),
                    frequency = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    price = table.Column<double>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceRequest", x => x.request_id);
                    table.ForeignKey(
                        name: "FK_ServiceRequest_User_Authoruser_id",
                        column: x => x.Authoruser_id,
                        principalTable: "User",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateTable(
                name: "StaffBooking",
                columns: table => new
                {
                    booking_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    request_id = table.Column<int>(type: "int", nullable: true),
                    staff_name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    assigned_date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    user_id = table.Column<int>(type: "int", nullable: true),
                    Authoruser_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StaffBooking", x => x.booking_id);
                    table.ForeignKey(
                        name: "FK_StaffBooking_ServiceRequest_request_id",
                        column: x => x.request_id,
                        principalTable: "ServiceRequest",
                        principalColumn: "request_id");
                    table.ForeignKey(
                        name: "FK_StaffBooking_User_Authoruser_id",
                        column: x => x.Authoruser_id,
                        principalTable: "User",
                        principalColumn: "user_id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRequest_Authoruser_id",
                table: "ServiceRequest",
                column: "Authoruser_id");

            migrationBuilder.CreateIndex(
                name: "IX_StaffBooking_Authoruser_id",
                table: "StaffBooking",
                column: "Authoruser_id");

            migrationBuilder.CreateIndex(
                name: "IX_StaffBooking_request_id",
                table: "StaffBooking",
                column: "request_id",
                unique: true,
                filter: "[request_id] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StaffBooking");

            migrationBuilder.DropTable(
                name: "ServiceRequest");
        }
    }
}
