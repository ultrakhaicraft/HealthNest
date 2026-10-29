using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_DAO.DTOModels;

public class StudentLinkRequestDetailModel
{
	public string Id { get; set; } = null!;
	public string ParentId { get; set; } = null!;
	public string StudentId { get; set; } = null!;
	public string StudentName { get; set; } = null!;
	public string ParentName { get; set; } = null!;
	public string reviewedByName { get; set; } = null!;
	public string RelationshipNote { get; set; } = null!;
	public string Status { get; set; } = null!;
	public DateTime CreatedDateTime { get; set; }
	public string? ReviewedBy { get; set; }
	public DateTime? ReviewedDateTime { get; set; }
	public string? RejectionReason { get; set; }
}

public class LinkRequestCreateModel
{
	[Required, MinLength(1)]
	public List<string> StudentIds { get; set; } = new();

	[Required,MaxLength(500)]
	public string? RelationshipNote { get; set; }         // "Mother", "Father", "Guardian", Extra info

}

public class LinkRequestCancelRequest
{
	[Required]
	public string RejectionReason { get; set; } = null!;

}

public class StudentLinkRequestViewModel
{
	public string Id { get; set; } = null!;
	public string ParentId { get; set; } = null!;
	public string StudentId { get; set; } = null!;
	public string StudentName { get; set; } = null!;
	public string Status { get; set; } = null!;
	public DateTime CreatedDateTime { get; set; }
	public string? ReviewedBy { get; set; }
	public DateTime? ReviewedDateTime { get; set; }
	public string? RejectionReason { get; set; }

}

public class StudentLinkRequestQuery
{
	public string? StudentName { get; set; }
	public string? ParentName { get; set; }                 // used by the nurse queue only
	public string? Status { get; set; }
	public int PageIndex { get; set; } = 1;
	public int PageSize { get; set; } = 10;
}
