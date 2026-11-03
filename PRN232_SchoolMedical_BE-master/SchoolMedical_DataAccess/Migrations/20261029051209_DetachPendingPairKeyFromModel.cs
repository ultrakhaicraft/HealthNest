using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolMedical_DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class DetachPendingPairKeyFromModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
			// Intentionally empty. PendingPairKey and its unique index stay in the database;
			// this migration only updates the model snapshot.
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder)
        {
           
        }
    }
}
