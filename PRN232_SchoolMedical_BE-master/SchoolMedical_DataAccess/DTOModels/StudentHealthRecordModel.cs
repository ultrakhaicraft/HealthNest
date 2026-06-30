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

	public int? Height { get; set; }

	public string? Allergies { get; set; }

	public string? ChronicDiseases { get; set; }

	public string? Vision { get; set; }

	public string? Hearing { get; set; }

	public string? Status { get; set; }

	public List<VaccineRecordViewModel> vaccineRecordViewModels { get; set; } = new List<VaccineRecordViewModel>();
	public List<TreatmentRecordViewModel> treatmentRecordViewModels { get; set; } = new List<TreatmentRecordViewModel>();

}

public class StudentHealthRecordViewModel
{
	public string Id { get; set; } = null!;

	public string StudentId { get; set; } = null!;

	public string StudentName { get; set; } = null!;

	public string CreatedBy { get; set; } = null!;
	public string? Status { get; set; }
}

public class StudentHealthRecordCreateModel
{
	[Required(ErrorMessage ="Student Id is required")]
	public string StudentId { get; set; } = null!;

	[Required(ErrorMessage = "Student Name is required")]
	public string StudentName { get; set; } = null!;

	[Required(ErrorMessage = "Created By is required")]
	public string CreatedBy { get; set; } = null!;

	[Required(ErrorMessage = "Height is required")]
	public int? Height { get; set; }

	[Required(ErrorMessage = "Allergies is required")]
	public string? Allergies { get; set; }

	[Required(ErrorMessage = "Chronic Diseases is required")]
	public string? ChronicDiseases { get; set; }

	[Required(ErrorMessage = "Vision is required")]
	public string? Vision { get; set; }

	[Required(ErrorMessage = "Hearing is required")]
	public string? Hearing { get; set; }

}

public class StudentHealthRecordUpdateModel
{

	public string StudentId { get; set; } = null!;

	public string StudentName { get; set; } = null!;

	public string CreatedBy { get; set; } = null!; // Parent ID

	public int? Height { get; set; }

	public string? Allergies { get; set; }

	public string? ChronicDiseases { get; set; }

	public string? Vision { get; set; }

	public string? Hearing { get; set; }

	public string? Status { get; set; }
}


public class StudentHealthRecordQuery
{
	public string? StudentName { get; set; }
	public RecordStatus? Status { get; set; }
	public int PageNumber { get; set; } = 1;
	public int PageSize { get; set; } = 10;
}
