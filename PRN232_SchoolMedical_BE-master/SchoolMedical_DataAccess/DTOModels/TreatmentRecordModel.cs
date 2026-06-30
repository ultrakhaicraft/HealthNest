using SchoolMedical_DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.DTOModels;

public class TreatmentRecordViewModel
{
	public string Id { get; set; } = null!;
	public string StudentId { get; set; } = null!;
	public string StudentName { get; set; } = null!;
	public DateTime RecordDate { get; set; }
	public string? Treatment { get; set; }
	public string? Status { get; set; }

}

public class  TreatmentRecordDetailModel
{
	public string Id { get; set; } = null!;

	public string StudentId { get; set; } = null!;
	public string StudentName { get; set; } = null!;
	public string StudentHealthRecordId { get; set; } = null!;

	public DateTime RecordDate { get; set; }

	public string? Treatment { get; set; }

	public string? Description { get; set; }

	public string? Status { get; set; }

	
}
