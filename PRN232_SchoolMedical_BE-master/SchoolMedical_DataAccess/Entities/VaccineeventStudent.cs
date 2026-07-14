using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.Entities
{
	public partial class VaccineeventStudent
	{
		public string VaccineeventId { get; set; } = null!;
		public string StudentId { get; set; } = null!;
		public DateTime SignupDate { get; set; }
		public string? ResultSummary { get; set; }
		public string? Status { get; set; } // e.g. "SignedUp", "Attended", "NoShow", "Completed"

		public virtual Vaccineevent Vaccineevent { get; set; } = null!;
		public virtual Account Student { get; set; } = null!;
	}
}
