using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeOwner.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRentPaymentsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "staff_id",
                table: "ServiceRequest");

            migrationBuilder.DropColumn(
                name: "created_date",
                table: "FacilityReservation");

            migrationBuilder.DropColumn(
                name: "notes",
                table: "FacilityReservation");

            migrationBuilder.DropColumn(
                name: "staff_id",
                table: "FacilityReservation");

            migrationBuilder.DropColumn(
                name: "total_amount",
                table: "FacilityReservation");

            migrationBuilder.DropColumn(
                name: "updated_date",
                table: "FacilityReservation");

            migrationBuilder.CreateTable(
                name: "RentPayment",
                columns: table => new
                {
                    payment_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    amount = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    due_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    payment_date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    payment_method = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    transaction_id = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    date_created = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RentPayment", x => x.payment_id);
                    table.ForeignKey(
                        name: "FK_RentPayment_User_user_id",
                        column: x => x.user_id,
                        principalTable: "User",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RentPayment_user_id",
                table: "RentPayment",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RentPayment");

            migrationBuilder.AddColumn<int>(
                name: "staff_id",
                table: "ServiceRequest",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_date",
                table: "FacilityReservation",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "notes",
                table: "FacilityReservation",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "staff_id",
                table: "FacilityReservation",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "total_amount",
                table: "FacilityReservation",
                type: "decimal(10,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_date",
                table: "FacilityReservation",
                type: "datetime2",
                nullable: true);
        }
    }
}
