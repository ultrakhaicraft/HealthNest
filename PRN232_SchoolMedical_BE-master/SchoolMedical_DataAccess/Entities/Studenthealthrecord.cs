using System;
using System.Collections.Generic;

namespace SchoolMedical_DataAccess.Entities;

public partial class Studenthealthrecord
{
	public string Id { get; set; } = null!;
	public string StudentId { get; set; } = null!;
	public string CreatedBy { get; set; } = null!;
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


	public virtual Nurse CreatedByNavigation { get; set; } = null!; //Nurse handle the creation
	public virtual Student Student { get; set; } = null!; //Student associate with it
	public virtual ICollection<Treatmentrecord> Treatmentrecords { get; set; } = new List<Treatmentrecord>();
	public virtual ICollection<Vaccinerecord> Vaccinerecords { get; set; } = new List<Vaccinerecord>();
}
