using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolMedical_DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class RefactorBoolInMedicineAndMedicalSupply : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "medicines",
                type: "tinyint(1)",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "tinyint(1)",
                oldDefaultValueSql: "'0'");

            migrationBuilder.AlterColumn<bool>(
                name: "IsAvailable",
                table: "medicines",
                type: "tinyint(1)",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "tinyint(1)",
                oldDefaultValueSql: "'1'");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "medicalsupplies",
                type: "tinyint(1)",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "tinyint(1)",
                oldDefaultValueSql: "'0'");

            migrationBuilder.AlterColumn<bool>(
                name: "IsAvailable",
                table: "medicalsupplies",
                type: "tinyint(1)",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "tinyint(1)",
                oldDefaultValueSql: "'1'");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "accounts",
                type: "varchar(15)",
                maxLength: 15,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "varchar(15)",
                oldMaxLength: 15,
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "medicines",
                type: "tinyint(1)",
                nullable: false,
                defaultValueSql: "'0'",
                oldClrType: typeof(bool),
                oldType: "tinyint(1)");

            migrationBuilder.AlterColumn<bool>(
                name: "IsAvailable",
                table: "medicines",
                type: "tinyint(1)",
                nullable: false,
                defaultValueSql: "'1'",
                oldClrType: typeof(bool),
                oldType: "tinyint(1)");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "medicalsupplies",
                type: "tinyint(1)",
                nullable: false,
                defaultValueSql: "'0'",
                oldClrType: typeof(bool),
                oldType: "tinyint(1)");

            migrationBuilder.AlterColumn<bool>(
                name: "IsAvailable",
                table: "medicalsupplies",
                type: "tinyint(1)",
                nullable: false,
                defaultValueSql: "'1'",
                oldClrType: typeof(bool),
                oldType: "tinyint(1)");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "accounts",
                type: "varchar(15)",
                maxLength: 15,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(15)",
                oldMaxLength: 15);
        }
    }
}
