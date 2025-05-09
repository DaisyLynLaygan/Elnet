using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeOwner.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddStaffNotesToServiceRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "staffNotes",
                table: "ServiceRequest",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "staffNotes",
                table: "ServiceRequest");
        }
    }
}
