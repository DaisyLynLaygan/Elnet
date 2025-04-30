using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeOwner.Migrations
{
    /// <inheritdoc />
    public partial class AddFeedbackAndFacilityModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "value_rating",
                table: "Feedback",
                type: "decimal(3,1)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "staff_rating",
                table: "Feedback",
                type: "decimal(3,1)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "overall_rating",
                table: "Feedback",
                type: "decimal(3,1)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "equipment_rating",
                table: "Feedback",
                type: "decimal(3,1)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "cleanliness_rating",
                table: "Feedback",
                type: "decimal(3,1)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "value_rating",
                table: "Facility",
                type: "decimal(3,1)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "staff_rating",
                table: "Facility",
                type: "decimal(3,1)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "overall_rating",
                table: "Facility",
                type: "decimal(3,1)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "equipment_rating",
                table: "Facility",
                type: "decimal(3,1)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "cleanliness_rating",
                table: "Facility",
                type: "decimal(3,1)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "value_rating",
                table: "Feedback",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(3,1)");

            migrationBuilder.AlterColumn<decimal>(
                name: "staff_rating",
                table: "Feedback",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(3,1)");

            migrationBuilder.AlterColumn<decimal>(
                name: "overall_rating",
                table: "Feedback",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(3,1)");

            migrationBuilder.AlterColumn<decimal>(
                name: "equipment_rating",
                table: "Feedback",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(3,1)");

            migrationBuilder.AlterColumn<decimal>(
                name: "cleanliness_rating",
                table: "Feedback",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(3,1)");

            migrationBuilder.AlterColumn<decimal>(
                name: "value_rating",
                table: "Facility",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(3,1)");

            migrationBuilder.AlterColumn<decimal>(
                name: "staff_rating",
                table: "Facility",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(3,1)");

            migrationBuilder.AlterColumn<decimal>(
                name: "overall_rating",
                table: "Facility",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(3,1)");

            migrationBuilder.AlterColumn<decimal>(
                name: "equipment_rating",
                table: "Facility",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(3,1)");

            migrationBuilder.AlterColumn<decimal>(
                name: "cleanliness_rating",
                table: "Facility",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(3,1)");
        }
    }
}
