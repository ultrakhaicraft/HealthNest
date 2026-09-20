using SchoolMedical_DataAccess.Entities;
using SchoolMedical_DataAccess.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.DTOModels;

public class StudentHealthRecordDetailModel
{
	public string Id { get; set; } = null!;
	public string StudentId { get; set; } = null!;
	public string StudentName { get; set; } = null!;
	public string CreatedBy { get; set; } = null!;
	public string CreatedByName { get; set; } = null!;
	public int? Height { get; set; }
	public int? Weight { get; set; }
	public string? Allergies { get; set; }
	public string? HealthHistory { get; set; }
	public string? Vision { get; set; }
	public string? EarNoseAndMouth { get; set; }
	public string? Teeth { get; set; }
	public string? BloodProfile { get; set; }
	public string? BloodPressure { get; set; }
	public string? Heart { get; set; }
	public string Status { get; set; } = null!;
	public DateTime CreatedDateTime { get; set; }
	public DateTime UpdatedDateTime { get; set; }
	public List<VaccineRecordViewModel> VaccineRecordViewModels { get; set; } = new List<VaccineRecordViewModel>();
	public List<TreatmentRecordViewModel> TreatmentRecordViewModels { get; set; } = new List<TreatmentRecordViewModel>();

}

public class StudentHealthRecordViewModel
{
	public string Id { get; set; } = null!;
	public string StudentId { get; set; } = null!;
	public string StudentName { get; set; } = null!;
	public string CreatedBy { get; set; } = null!;
	public DateTime CreatedDateTime { get; set; }
	public DateTime UpdatedDateTime { get; set; }
	public string? Status { get; set; }
}

public class StudentHealthRecordCreateModel
{
	[Required(ErrorMessage ="Student Id is required")]
	public string StudentId { get; set; } = null!;
	
	[Required(ErrorMessage = "Created By is required")]
	public string CreatedBy { get; set; } = null!;
	[Required(ErrorMessage = "Height is required")]
	public int? Height { get; set; }
	[Required(ErrorMessage = "Weight is required")]
	public int? Weight { get; set; }
	[Required(ErrorMessage = "Allergies is required")]
	public string? Allergies { get; set; }
	[Required(ErrorMessage = "Health History is required")]
	public string? HealthHistory { get; set; }
	[Required(ErrorMessage = "Vision is required")]
	public string? Vision { get; set; }
	[Required(ErrorMessage = "Ear, Nose, And Mouth information is required")]
	public string? EarNoseAndMouth { get; set; }
	[Required(ErrorMessage = "Teeth Health information is required")]
	public string? Teeth { get; set; }
	[Required(ErrorMessage = "Blood profile is required")]
	public string? BloodProfile { get; set; }
	[Required(ErrorMessage = "Blood pressure result is required")]
	public string? BloodPressure { get; set; }
	[Required(ErrorMessage = "Hearth Health info is required")]
	public string? Heart { get; set; }
	

}

public class StudentHealthRecordUpdateModel
{

	[Required(ErrorMessage = "Height is required")]
	public int? Height { get; set; }
	[Required(ErrorMessage = "Weight is required")]
	public int? Weight { get; set; }
	[Required(ErrorMessage = "Allergies is required")]
	public string? Allergies { get; set; }
	[Required(ErrorMessage = "Health History is required")]
	public string? HealthHistory { get; set; }
	[Required(ErrorMessage = "Vision is required")]
	public string? Vision { get; set; }
	[Required(ErrorMessage = "Ear, Nose, And Mouth information is required")]
	public string? EarNoseAndMouth { get; set; }
	[Required(ErrorMessage = "Teeth Health information is required")]
	public string? Teeth { get; set; }
	[Required(ErrorMessage = "Blood profile is required")]
	public string? BloodProfile { get; set; }
	[Required(ErrorMessage = "Blood pressure result is required")]
	public string? BloodPressure { get; set; }
	[Required(ErrorMessage = "Hearth Health info is required")]
	public string? Heart { get; set; }
}


public class StudentHealthRecordQuery
{
	public string? StudentName { get; set; }
	public RecordStatus? Status { get; set; }
	public int PageNumber { get; set; } = 1;
	public int PageSize { get; set; } = 10;
}
