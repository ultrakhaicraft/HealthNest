using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_DAO.DTOModels;


//Also used for view detail
public class TreatmentRecordViewModel
{
	public string Id { get; set; } = null!;
	public string StudentId { get; set; } = null!;
	public string StudentName { get; set; } = null!;
	public string StudentHealthRecordId { get; set; } = null!;
	public DateTime RecordDate { get; set; }
	public string? TreatmentTitle { get; set; }
	public string? Description { get; set; }
	public string? Status { get; set; }

}
public class TreatmentRecordCreateModel
{
	public string StudentId { get; set; } = null!;
	public string StudentHealthRecordId { get; set; } = null!;
	public string? TreatmentTitle { get; set; }
	public string? Description { get; set; }
}

public class TreatmentRecordUpdateModel
{
	public string StudentId { get; set; } = null!;
	public string? Description { get; set; }
	public string? TreatmentTitle { get; set; }
	public string? Status { get; set; }
}

public class TreatmentRecordQuery
{
	public string? TreatmentTitle { get; set; } = string.Empty;
	public string? Status { get; set; } = string.Empty;
	public int PageIndex { get; set; } = 1; // Default to first page
	public int PageSize { get; set; } = 10; // Default to 10 items per page
}