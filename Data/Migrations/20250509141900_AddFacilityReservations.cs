using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeOwner.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddFacilityReservations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "notes",
                table: "FacilityReservation");

            migrationBuilder.DropColumn(
                name: "updated_date",
                table: "FacilityReservation");

            migrationBuilder.RenameColumn(
                name: "total_amount",
                table: "FacilityReservation",
                newName: "price");

            migrationBuilder.RenameColumn(
                name: "created_date",
                table: "FacilityReservation",
                newName: "date_created");

            migrationBuilder.AlterColumn<string>(
                name: "staff_notes",
                table: "FacilityReservation",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "price",
                table: "FacilityReservation",
                newName: "total_amount");

            migrationBuilder.RenameColumn(
                name: "date_created",
                table: "FacilityReservation",
                newName: "created_date");

            migrationBuilder.AlterColumn<string>(
                name: "staff_notes",
                table: "FacilityReservation",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "notes",
                table: "FacilityReservation",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_date",
                table: "FacilityReservation",
                type: "datetime2",
                nullable: true);
        }
    }
}
