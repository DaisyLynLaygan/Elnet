using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeOwner.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUserTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Announcement",
                columns: table => new
                {
                    announcement_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    start_date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    end_date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    priority = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    author = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Announcement", x => x.announcement_id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Announcement");
        }
    }
}
