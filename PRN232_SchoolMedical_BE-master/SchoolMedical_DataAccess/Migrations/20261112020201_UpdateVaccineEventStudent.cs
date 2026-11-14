using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolMedical_DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateVaccineEventStudent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CheckedBy",
                table: "vaccineevent_student",
                type: "longtext",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "vaccineevent_student",
                type: "longtext",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RegisteredByParent",
                table: "vaccineevent_student",
                type: "longtext",
                nullable: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "vaccineevent_student",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CheckedBy",
                table: "vaccineevent_student");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "vaccineevent_student");

            migrationBuilder.DropColumn(
                name: "RegisteredByParent",
                table: "vaccineevent_student");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "vaccineevent_student");
        }
    }
}
