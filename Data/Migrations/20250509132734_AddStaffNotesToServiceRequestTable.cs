using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeOwner.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddStaffNotesToServiceRequestTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[ServiceRequest]') AND name = 'staffNotes') BEGIN ALTER TABLE [ServiceRequest] ADD [staffNotes] nvarchar(max) NOT NULL DEFAULT '' END");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[ServiceRequest]') AND name = 'staffNotes') BEGIN ALTER TABLE [ServiceRequest] DROP COLUMN [staffNotes] END");
        }
    }
}
