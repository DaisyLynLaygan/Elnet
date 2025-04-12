using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeOwner.Migrations
{
    /// <inheritdoc />
    public partial class UpdateReportSchemaIdentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Report_User_author_id",
                table: "Report");

            migrationBuilder.DropIndex(
                name: "IX_Report_author_id",
                table: "Report");

            migrationBuilder.DropColumn(
                name: "author_id",
                table: "Report");

            migrationBuilder.CreateIndex(
                name: "IX_Report_user_id",
                table: "Report",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Report_User_user_id",
                table: "Report",
                column: "user_id",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Report_User_user_id",
                table: "Report");

            migrationBuilder.DropIndex(
                name: "IX_Report_user_id",
                table: "Report");

            migrationBuilder.AddColumn<int>(
                name: "author_id",
                table: "Report",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Report_author_id",
                table: "Report",
                column: "author_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Report_User_author_id",
                table: "Report",
                column: "author_id",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
