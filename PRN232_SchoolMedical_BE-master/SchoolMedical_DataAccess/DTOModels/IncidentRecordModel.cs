using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.DTOModels;


public class IncidentRecordDetailModel
{
	public string Id { get; set; } = null!;

	public string StudentId { get; set; } = null!;
	public string StudentName { get; set; } = null!;

	public string HandleBy { get; set; } = null!;

	public string HandleByName { get; set; } = null!; //Search HandleBy bang cach lay object Account trong IncidentRecord

	public string? IncidentType { get; set; }

	public string? Description { get; set; }

	public DateTime DateOccurred { get; set; }

	public string? Status { get; set; }
}

public class IncidentRecordCreateRequest
{
	public string StudentId { get; set; } = null!;

	public string? IncidentType { get; set; }

	public string? Description { get; set; }

	public DateTime DateOccurred { get; set; }
}

public class IncidentRecordUpdateRequest
{
	public string StudentId { get; set; } = null!;

	public string HandleBy { get; set; } = null!;


	public string? IncidentType { get; set; }

	public string? Description { get; set; }

	public DateTime DateOccurred { get; set; }

	public string? Status { get; set; }
}

public class IncidentRecordViewModel
{
	public string Id { get; set; } = null!;

	public string StudentId { get; set; } = null!;
	public string StudentName { get; set; } = null!; //Search StudentName bang cach lay object Student trong IncidentRecord
	public string? IncidentType { get; set; } //Search Incident Type
	public DateTime DateOccurred { get; set; } //Sort theo ascending date
	public string? Status { get; set; }
}
public class IncidentRecordQuery
{
	public string? StudentId { get; set; }
	public string? Status { get; set; } 
	public bool SortByLatest { get; set; } 
	public DateTime? DateFrom { get; set; }
	public DateTime? DateTo { get; set; }
	public int PageIndex { get; set; } = 1; // Default to first page
	public int PageSize { get; set; } = 10; // Default to 10 items per page
}


public record IncidentRecordCountPerYear
{
	public int Year {  get; set; }
	public int January { get; set; }
	public int February { get; set; }
	public int March { get; set; }
	public int April { get; set; }
	public int May { get; set; }
	public int June { get; set; }
	public int July { get; set; }
	public int August { get; set; }
	public int September { get; set; }
	public int October { get; set; }
	public int November { get; set; }
	public int December	{ get; set; }

}




