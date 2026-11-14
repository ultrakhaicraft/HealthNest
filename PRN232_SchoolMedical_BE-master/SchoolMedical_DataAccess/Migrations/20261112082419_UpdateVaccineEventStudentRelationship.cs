using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolMedical_DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateVaccineEventStudentRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "RegisteredByParent",
                table: "vaccineevent_student",
                type: "varchar(50)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext");

            migrationBuilder.AlterColumn<string>(
                name: "CheckedBy",
                table: "vaccineevent_student",
                type: "varchar(50)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_vaccineevent_student_CheckedBy",
                table: "vaccineevent_student",
                column: "CheckedBy");

            migrationBuilder.CreateIndex(
                name: "IX_vaccineevent_student_RegisteredByParent",
                table: "vaccineevent_student",
                column: "RegisteredByParent");

            migrationBuilder.AddForeignKey(
                name: "FK_VaccineeventStudent_Nurse",
                table: "vaccineevent_student",
                column: "CheckedBy",
                principalTable: "nurses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VaccineeventStudent_Parent",
                table: "vaccineevent_student",
                column: "RegisteredByParent",
                principalTable: "parents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VaccineeventStudent_Nurse",
                table: "vaccineevent_student");

            migrationBuilder.DropForeignKey(
                name: "FK_VaccineeventStudent_Parent",
                table: "vaccineevent_student");

            migrationBuilder.DropIndex(
                name: "IX_vaccineevent_student_CheckedBy",
                table: "vaccineevent_student");

            migrationBuilder.DropIndex(
                name: "IX_vaccineevent_student_RegisteredByParent",
                table: "vaccineevent_student");

            migrationBuilder.AlterColumn<string>(
                name: "RegisteredByParent",
                table: "vaccineevent_student",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(50)");

            migrationBuilder.AlterColumn<string>(
                name: "CheckedBy",
                table: "vaccineevent_student",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldNullable: true);
        }
    }
}
