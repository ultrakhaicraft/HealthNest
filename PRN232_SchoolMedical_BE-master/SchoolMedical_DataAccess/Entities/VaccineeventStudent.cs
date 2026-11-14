using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_DAO.Entities;

public partial class VaccineeventStudent
{
	public string VaccineeventId { get; set; } = null!;
	public string StudentId { get; set; } = null!;
	public string RegisteredByParent { get; set; } = null!;   //ParentId
	public string? CheckedBy { get; set; }  //NurseId


	public string? ResultSummary { get; set; } //Only happenes upon completions
	public string? Status { get; set; } // e.g. "SignedUp", "Attended", "NoShow", "Completed"
	public string? Note { get; set; }                   // e.g. "Paper consent form received"

	public DateTime SignupDate { get; set; } // Can also acted as CreatedBy
	public DateTime UpdatedAt { get; set; }

	public virtual Vaccineevent Vaccineevent { get; set; } = null!;
	public virtual Student Student { get; set; } = null!;
	public virtual Parent Parent { get; set; } = null!;
	public virtual Nurse Nurse { get; set; } = null!;

}
