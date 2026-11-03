using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_DAO.Entities;

public class StudentLinkRequest
{
	public string Id { get; set; } = null!;
	public string ParentId { get; set; } = null!;
	public string StudentId { get; set; } = null!;
	public string RelationshipNote { get; set; } = null!;
	public string Status { get; set; } = null!;
	public DateTime CreatedDateTime { get; set; }
	public string? ReviewedBy { get; set; }
	public DateTime? ReviewedDateTime { get; set; }
	public string? RejectionReason { get; set; }
	public virtual Parent Parent { get; set; } = null!;
	public virtual Student Student { get; set; } = null!;
	public virtual Account? ReviewedByNavigation { get; set; } //Review By Nurse
}
