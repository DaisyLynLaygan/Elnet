using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeOwner.Migrations
{
    /// <inheritdoc />
    public partial class UpdateReportSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Report_User_author_id",
                table: "Report");

            migrationBuilder.AddForeignKey(
                name: "FK_Report_User_author_id",
                table: "Report",
                column: "author_id",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Report_User_author_id",
                table: "Report");

            migrationBuilder.AddForeignKey(
                name: "FK_Report_User_author_id",
                table: "Report",
                column: "author_id",
                principalTable: "User",
                principalColumn: "user_id");
        }
    }
}
