using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolMedical_DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddLinkRequestInDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "studentlinkrequests",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    ParentId = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    StudentId = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    RelationshipNote = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    Status = table.Column<string>(type: "varchar(15)", maxLength: 15, nullable: false),
                    CreatedDateTime = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    ReviewedBy = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    ReviewedDateTime = table.Column<DateTime>(type: "datetime", nullable: true),
                    RejectionReason = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true),
                    PendingPairKey = table.Column<string>(type: "varchar(73)", nullable: true, computedColumnSql: "IF(`Status` = 'Pending', CONCAT(`ParentId`, ':', `StudentId`), NULL)", stored: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.Id);
                    table.ForeignKey(
                        name: "fk_linkrequest_parent",
                        column: x => x.ParentId,
                        principalTable: "parents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_linkrequest_reviewer",
                        column: x => x.ReviewedBy,
                        principalTable: "accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_linkrequest_student",
                        column: x => x.StudentId,
                        principalTable: "students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "idx_linkrequest_parent_created",
                table: "studentlinkrequests",
                columns: new[] { "ParentId", "CreatedDateTime" });

            migrationBuilder.CreateIndex(
                name: "idx_linkrequest_status_created",
                table: "studentlinkrequests",
                columns: new[] { "Status", "CreatedDateTime" });

            migrationBuilder.CreateIndex(
                name: "IX_studentlinkrequests_ReviewedBy",
                table: "studentlinkrequests",
                column: "ReviewedBy");

            migrationBuilder.CreateIndex(
                name: "IX_studentlinkrequests_StudentId",
                table: "studentlinkrequests",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "uq_linkrequest_pending_pair",
                table: "studentlinkrequests",
                column: "PendingPairKey",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "studentlinkrequests");
        }
    }
}
