using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolMedical_DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class EditStudentHealthRecord : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
			migrationBuilder.DropColumn(
		        name: "Hearing",
		        table: "studenthealthrecords");

			migrationBuilder.DropColumn(
				name: "ChronicDiseases",
				table: "studenthealthrecords");

			migrationBuilder.AddColumn<string>(
				name: "Teeth",
				table: "studenthealthrecords",
				type: "text",
				nullable: true);

			migrationBuilder.AddColumn<string>(
				name: "Heart",
				table: "studenthealthrecords",
				type: "text",
				nullable: true);

			migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "studenthealthrecords",
                type: "varchar(15)",
                maxLength: 15,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "varchar(15)",
                oldMaxLength: 15,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BloodPressure",
                table: "studenthealthrecords",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BloodProfile",
                table: "studenthealthrecords",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDateTime",
                table: "studenthealthrecords",
                type: "datetime",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "EarNoseAndMouth",
                table: "studenthealthrecords",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HealthHistory",
                table: "studenthealthrecords",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDateTime",
                table: "studenthealthrecords",
                type: "datetime",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Weight",
                table: "studenthealthrecords",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BloodPressure",
                table: "studenthealthrecords");

            migrationBuilder.DropColumn(
                name: "BloodProfile",
                table: "studenthealthrecords");

            migrationBuilder.DropColumn(
                name: "CreatedDateTime",
                table: "studenthealthrecords");

            migrationBuilder.DropColumn(
                name: "EarNoseAndMouth",
                table: "studenthealthrecords");

            migrationBuilder.DropColumn(
                name: "HealthHistory",
                table: "studenthealthrecords");

            migrationBuilder.DropColumn(
                name: "UpdatedDateTime",
                table: "studenthealthrecords");

            migrationBuilder.DropColumn(
                name: "Weight",
                table: "studenthealthrecords");

            migrationBuilder.RenameColumn(
                name: "Teeth",
                table: "studenthealthrecords",
                newName: "Hearing");

            migrationBuilder.RenameColumn(
                name: "Heart",
                table: "studenthealthrecords",
                newName: "ChronicDiseases");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "studenthealthrecords",
                type: "varchar(15)",
                maxLength: 15,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(15)",
                oldMaxLength: 15);
        }
    }
}
