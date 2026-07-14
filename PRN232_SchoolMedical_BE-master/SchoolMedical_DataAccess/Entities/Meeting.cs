using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.Entities
{
	public partial class Meeting
	{
		public string Id { get; set; } = null!;
		public string StudentId { get; set; } = null!;
		public string HandleBy { get; set; } = null!; // nurse/staff who conducted the meeting
		public string? Title { get; set; }
		public string? Content { get; set; }
		public DateTime ScheduledDate { get; set; }
		public string? Status { get; set; } // e.g. "Scheduled", "Completed", "Cancelled"
		public bool ParentAttended { get; set; } = false; // NEW — did the parent actually join

		public virtual Account Student { get; set; } = null!;
		public virtual Account HandleByNavigation { get; set; } = null!;
	}
}
