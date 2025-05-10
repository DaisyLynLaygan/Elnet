using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeOwner.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDocumentModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DocumentFolder",
                columns: table => new
                {
                    folder_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    parent_folder_id = table.Column<int>(type: "int", nullable: true),
                    visibility = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    creation_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    creator_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentFolder", x => x.folder_id);
                    table.ForeignKey(
                        name: "FK_DocumentFolder_DocumentFolder_parent_folder_id",
                        column: x => x.parent_folder_id,
                        principalTable: "DocumentFolder",
                        principalColumn: "folder_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DocumentFolder_User_creator_id",
                        column: x => x.creator_id,
                        principalTable: "User",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Document",
                columns: table => new
                {
                    document_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    file_path = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    file_type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    file_size = table.Column<long>(type: "bigint", nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    visibility = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    allow_download = table.Column<bool>(type: "bit", nullable: false),
                    apply_watermark = table.Column<bool>(type: "bit", nullable: false),
                    upload_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    expiration_date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    folder_id = table.Column<int>(type: "int", nullable: true),
                    uploader_id = table.Column<int>(type: "int", nullable: false),
                    download_count = table.Column<int>(type: "int", nullable: false),
                    view_count = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Document", x => x.document_id);
                    table.ForeignKey(
                        name: "FK_Document_DocumentFolder_folder_id",
                        column: x => x.folder_id,
                        principalTable: "DocumentFolder",
                        principalColumn: "folder_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Document_User_uploader_id",
                        column: x => x.uploader_id,
                        principalTable: "User",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DocumentAccessLog",
                columns: table => new
                {
                    log_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    document_id = table.Column<int>(type: "int", nullable: false),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    access_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    action_type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ip_address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    browser_info = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentAccessLog", x => x.log_id);
                    table.ForeignKey(
                        name: "FK_DocumentAccessLog_Document_document_id",
                        column: x => x.document_id,
                        principalTable: "Document",
                        principalColumn: "document_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DocumentAccessLog_User_user_id",
                        column: x => x.user_id,
                        principalTable: "User",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Document_folder_id",
                table: "Document",
                column: "folder_id");

            migrationBuilder.CreateIndex(
                name: "IX_Document_uploader_id",
                table: "Document",
                column: "uploader_id");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentAccessLog_document_id",
                table: "DocumentAccessLog",
                column: "document_id");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentAccessLog_user_id",
                table: "DocumentAccessLog",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentFolder_creator_id",
                table: "DocumentFolder",
                column: "creator_id");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentFolder_parent_folder_id",
                table: "DocumentFolder",
                column: "parent_folder_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DocumentAccessLog");

            migrationBuilder.DropTable(
                name: "Document");

            migrationBuilder.DropTable(
                name: "DocumentFolder");
        }
    }
}
