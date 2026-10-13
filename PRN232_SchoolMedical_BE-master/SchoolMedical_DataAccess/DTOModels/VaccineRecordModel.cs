using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_DAO.DTOModels;


//Also used for view detail
public class VaccineRecordViewModel
{
	public string Id { get; set; } = null!;
	public string StudentId { get; set; } = null!;
	public string StudentName { get; set; } = null!;
	public string StudentHealthRecordId { get; set; } = null!;
	public DateTime RecordDate { get; set; }
	public string? VaccineTitle { get; set; }
	public string? Description { get; set; }
	public string? Status { get; set; }
}

public class VaccineRecordCreateModel
{
	public string StudentId { get; set; } = null!;
	public string StudentHealthRecordId { get; set; } = null!;
	public string? VaccineTitle { get; set; }
	public string? Description { get; set; }
}

public class VaccineRecordUpdateModel
{
	public string StudentId { get; set; } = null!;
	public string? VaccineTitle { get; set; }
	public string? Description { get; set; }
	public string? Status { get; set; }
}
