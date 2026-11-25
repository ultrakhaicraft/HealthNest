using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolMedical_DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class ReplaceSignUpPrimaryKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
			// 1. New column: nullable for now, so existing rows aren't forced to share a default
			migrationBuilder.AddColumn<string>(
				name: "SignUpId", table: "vaccineevent_student",
				type: "varchar(50)", maxLength: 50, nullable: true);

			// 2. Backfill a unique id for every existing row
			migrationBuilder.Sql("UPDATE vaccineevent_student SET SignUpId = UUID() WHERE SignUpId IS NULL;");

			// 3. Create the unique index BEFORE dropping the PK (see note below)
			migrationBuilder.CreateIndex(
				name: "UX_VaccineeventStudent_Event_Student", table: "vaccineevent_student",
				columns: new[] { "VaccineeventId", "StudentId" }, unique: true);

			// 4. Swap the primary key
			migrationBuilder.DropPrimaryKey(name: "PRIMARY", table: "vaccineevent_student");

			migrationBuilder.AlterColumn<string>(
				name: "SignUpId", table: "vaccineevent_student",
				type: "varchar(50)", maxLength: 50, nullable: false,
				oldClrType: typeof(string), oldType: "varchar(50)", oldNullable: true);

			migrationBuilder.AddPrimaryKey(name: "PRIMARY", table: "vaccineevent_student", column: "SignUpId");

			// 5. Fix the delete behavior (the live table has CASCADE on both)
			migrationBuilder.DropForeignKey(name: "FK_VaccineeventStudent_Nurse", table: "vaccineevent_student");
			migrationBuilder.DropForeignKey(name: "FK_VaccineeventStudent_Parent", table: "vaccineevent_student");

			migrationBuilder.AddForeignKey(
				name: "FK_VaccineeventStudent_Nurse", table: "vaccineevent_student",
				column: "CheckedBy", principalTable: "nurses", principalColumn: "Id",
				onDelete: ReferentialAction.SetNull);          // CheckedBy is nullable: keep the record, clear the nurse

			migrationBuilder.AddForeignKey(
				name: "FK_VaccineeventStudent_Parent", table: "vaccineevent_student",
				column: "RegisteredByParent", principalTable: "parents", principalColumn: "Id",
				onDelete: ReferentialAction.Restrict);         // column is NOT NULL: block deleting a parent who has sign-ups
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

            migrationBuilder.DropPrimaryKey(
                name: "PRIMARY",
                table: "vaccineevent_student");

            migrationBuilder.DropIndex(
                name: "UX_VaccineeventStudent_Event_Student",
                table: "vaccineevent_student");

            migrationBuilder.DropColumn(
                name: "SignUpId",
                table: "vaccineevent_student");

            migrationBuilder.AddPrimaryKey(
                name: "PK_vaccineevent_student",
                table: "vaccineevent_student",
                columns: new[] { "VaccineeventId", "StudentId" });

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
    }
}
