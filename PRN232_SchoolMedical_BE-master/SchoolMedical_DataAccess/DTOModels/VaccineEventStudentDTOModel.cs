using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_DAO.DTOModels;

public class ViewVaccineEventStudentModel
{
	public string VaccineeventId { get; set; } = null!;
	public string StudentId { get; set; } = null!;
	public DateTime SignupDate { get; set; } // Can also acted as CreatedBy
	public string? Status { get; set; } // e.g. "SignedUp", "Attended", "NoShow", "Completed"

}

public class ViewVaccineEventStudentDetailModel : ViewVaccineEventStudentModel
{
	public string? StudentName { get; set; }
	public string? ResultSummary { get; set; }
	public string RegisteredByParent { get; set; } = null!;
	public string? CheckedBy { get; set; }
	public string? CheckedByName { get; set; }
	public string? Note { get; set; }                   // e.g. "Paper consent form received"
	public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// Sign up request
/// </summary>
public class CreateVaccineEventStudentModel
{
	[Required]
	public string StudentId { get; set; } = null!;
	[Required]
	public string VaccineEventId { get; set; } = null!;
	[MaxLength(500)]
	public string? Note { get; set; }                   // e.g. "Paper consent form received"
}



public class CompleteVaccinationRequest
{
	[Required, MaxLength(1000)] public string ResultSummary { get; set; } = null!;
}

public class UpdateNoteRequest
{
	[MaxLength(500)] public string Note { get; set; } = string.Empty;
}


public class VaccineEventStudentQuery
{
	public int PageIndex { get; set; } = 1; // Default to first page
	public int PageSize { get; set; } = 10; // Default to 10 items per page
	public bool SortByDateSignUp { get; set; } = true; // Default to sort by latest date occurred
	public string? ParticipantStatus { get; set; } // Optional filter by status
	public string? Class {  get; set; }
}
