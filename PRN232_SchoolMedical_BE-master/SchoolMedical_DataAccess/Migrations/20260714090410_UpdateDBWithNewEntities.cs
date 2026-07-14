using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolMedical_DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDBWithNewEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "accounts",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    ParentId = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    FullName = table.Column<string>(type: "varchar(25)", maxLength: 25, nullable: false),
                    Email = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Password = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    PhoneNumber = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    Role = table.Column<string>(type: "varchar(15)", maxLength: 15, nullable: false),
                    Address = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Account_Parent",
                        column: x => x.ParentId,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "healthcheckupevents",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    CreatedBy = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Title = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    ShortDescription = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    Content = table.Column<string>(type: "text", nullable: true),
                    DateOccurred = table.Column<DateTime>(type: "datetime", nullable: false),
                    DateSignupStart = table.Column<DateTime>(type: "datetime", nullable: true),
                    DateSignupEnd = table.Column<DateTime>(type: "datetime", nullable: true),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HealthCheckupEvent_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "incidentrecords",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    StudentId = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    HandleBy = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    IncidentType = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    DateOccurred = table.Column<DateTime>(type: "datetime", nullable: false),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IncidentRecord_HandleBy",
                        column: x => x.HandleBy,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IncidentRecord_Student",
                        column: x => x.StudentId,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "medicalsupplies",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    CreatedBy = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Amount = table.Column<int>(type: "int", nullable: false),
                    IsAvailable = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValueSql: "'1'"),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalSupply_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "medicinerequests",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    RequestBy = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    ForStudent = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    DateSent = table.Column<DateTime>(type: "datetime", nullable: false),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicineRequest_ForStudent",
                        column: x => x.ForStudent,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicineRequest_RequestBy",
                        column: x => x.RequestBy,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "medicines",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    CreatedBy = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Amount = table.Column<int>(type: "int", nullable: false),
                    IsAvailable = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValueSql: "'1'"),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Medicine_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "meeting",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    StudentId = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    HandleBy = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Title = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    Content = table.Column<string>(type: "text", nullable: true),
                    ScheduledDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true),
                    ParentAttended = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Meeting_HandleBy",
                        column: x => x.HandleBy,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Meeting_Student",
                        column: x => x.StudentId,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "studenthealthrecords",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    StudentId = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    CreatedBy = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Height = table.Column<int>(type: "int", nullable: true),
                    Allergies = table.Column<string>(type: "text", nullable: true),
                    ChronicDiseases = table.Column<string>(type: "text", nullable: true),
                    Vision = table.Column<string>(type: "text", nullable: true),
                    Hearing = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentHealthRecord_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_studenthealthrecords_accounts_StudentId",
                        column: x => x.StudentId,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "vaccineevents",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    CreatedBy = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Title = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    ShortDescription = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    Content = table.Column<string>(type: "text", nullable: true),
                    DateOccurred = table.Column<DateTime>(type: "datetime", nullable: false),
                    DateSignupStart = table.Column<DateTime>(type: "datetime", nullable: true),
                    DateSignupEnd = table.Column<DateTime>(type: "datetime", nullable: true),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VaccineEvent_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "healthcheckupevent_student",
                columns: table => new
                {
                    HealthcheckupeventId = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    StudentId = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    SignupDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    ResultSummary = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_healthcheckupevent_student", x => new { x.HealthcheckupeventId, x.StudentId });
                    table.ForeignKey(
                        name: "FK_HealthcheckupeventStudent_Event",
                        column: x => x.HealthcheckupeventId,
                        principalTable: "healthcheckupevents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HealthcheckupeventStudent_Student",
                        column: x => x.StudentId,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "treatmentrecords",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    StudentHealthRecordId = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    RecordDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    Treatment = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TreatmentRecord_StudentHealthRecord",
                        column: x => x.StudentHealthRecordId,
                        principalTable: "studenthealthrecords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "vaccinerecords",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    StudentHealthRecordId = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    RecordDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    Vaccine = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VaccineRecord_StudentHealthRecord",
                        column: x => x.StudentHealthRecordId,
                        principalTable: "studenthealthrecords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "vaccineevent_student",
                columns: table => new
                {
                    VaccineeventId = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    StudentId = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    SignupDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    ResultSummary = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vaccineevent_student", x => new { x.VaccineeventId, x.StudentId });
                    table.ForeignKey(
                        name: "FK_VaccineeventStudent_Event",
                        column: x => x.VaccineeventId,
                        principalTable: "vaccineevents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VaccineeventStudent_Student",
                        column: x => x.StudentId,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "Email",
                table: "accounts",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "FK_Account_Parent",
                table: "accounts",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IDX_Account_Role",
                table: "accounts",
                column: "Role");

            migrationBuilder.CreateIndex(
                name: "IX_healthcheckupevent_student_StudentId",
                table: "healthcheckupevent_student",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IDX_HealthCheckupEvent_CreatedBy",
                table: "healthcheckupevents",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IDX_IncidentRecord_HandleBy",
                table: "incidentrecords",
                column: "HandleBy");

            migrationBuilder.CreateIndex(
                name: "IDX_IncidentRecord_StudentId",
                table: "incidentrecords",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IDX_MedicalSupply_CreatedBy",
                table: "medicalsupplies",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IDX_MedicineRequest_ForStudent",
                table: "medicinerequests",
                column: "ForStudent");

            migrationBuilder.CreateIndex(
                name: "IDX_MedicineRequest_RequestBy",
                table: "medicinerequests",
                column: "RequestBy");

            migrationBuilder.CreateIndex(
                name: "IDX_Medicine_CreatedBy",
                table: "medicines",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IDX_Meeting_HandleBy",
                table: "meeting",
                column: "HandleBy");

            migrationBuilder.CreateIndex(
                name: "IDX_Meeting_StudentId",
                table: "meeting",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IDX_StudentHealthRecord_CreatedBy",
                table: "studenthealthrecords",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IDX_StudentHealthRecord_StudentId",
                table: "studenthealthrecords",
                column: "StudentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IDX_TreatmentRecord_StudentHealthRecordId",
                table: "treatmentrecords",
                column: "StudentHealthRecordId");

            migrationBuilder.CreateIndex(
                name: "IX_vaccineevent_student_StudentId",
                table: "vaccineevent_student",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IDX_VaccineEvent_CreatedBy",
                table: "vaccineevents",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IDX_VaccineRecord_StudentHealthRecordId",
                table: "vaccinerecords",
                column: "StudentHealthRecordId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "healthcheckupevent_student");

            migrationBuilder.DropTable(
                name: "incidentrecords");

            migrationBuilder.DropTable(
                name: "medicalsupplies");

            migrationBuilder.DropTable(
                name: "medicinerequests");

            migrationBuilder.DropTable(
                name: "medicines");

            migrationBuilder.DropTable(
                name: "meeting");

            migrationBuilder.DropTable(
                name: "treatmentrecords");

            migrationBuilder.DropTable(
                name: "vaccineevent_student");

            migrationBuilder.DropTable(
                name: "vaccinerecords");

            migrationBuilder.DropTable(
                name: "healthcheckupevents");

            migrationBuilder.DropTable(
                name: "vaccineevents");

            migrationBuilder.DropTable(
                name: "studenthealthrecords");

            migrationBuilder.DropTable(
                name: "accounts");
        }
    }
}
