using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeOwner.Migrations
{
    /// <inheritdoc />
    public partial class fix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comment_User_user_id",
                table: "Comment");

            migrationBuilder.DropForeignKey(
                name: "FK_Comment_User_user_id1",
                table: "Comment");

            migrationBuilder.DropIndex(
                name: "IX_Comment_user_id",
                table: "Comment");

            migrationBuilder.DropColumn(
                name: "user_id",
                table: "Comment");

            migrationBuilder.RenameColumn(
                name: "user_id1",
                table: "Comment",
                newName: "author_id");

            migrationBuilder.RenameIndex(
                name: "IX_Comment_user_id1",
                table: "Comment",
                newName: "IX_Comment_author_id");

            migrationBuilder.AlterColumn<string>(
                name: "content",
                table: "Post",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "content",
                table: "Comment",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddForeignKey(
                name: "FK_Comment_User_author_id",
                table: "Comment",
                column: "author_id",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comment_User_author_id",
                table: "Comment");

            migrationBuilder.RenameColumn(
                name: "author_id",
                table: "Comment",
                newName: "user_id1");

            migrationBuilder.RenameIndex(
                name: "IX_Comment_author_id",
                table: "Comment",
                newName: "IX_Comment_user_id1");

            migrationBuilder.AlterColumn<string>(
                name: "content",
                table: "Post",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "content",
                table: "Comment",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "user_id",
                table: "Comment",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Comment_user_id",
                table: "Comment",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Comment_User_user_id",
                table: "Comment",
                column: "user_id",
                principalTable: "User",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Comment_User_user_id1",
                table: "Comment",
                column: "user_id1",
                principalTable: "User",
                principalColumn: "user_id");
        }
    }
}
