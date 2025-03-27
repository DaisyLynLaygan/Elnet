using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeOwner.Migrations
{
    /// <inheritdoc />
    public partial class ModifyUserModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "firstname",
                table: "User",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "lastname",
                table: "User",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "firstname",
                table: "User");

            migrationBuilder.DropColumn(
                name: "lastname",
                table: "User");
        }
    }
}
