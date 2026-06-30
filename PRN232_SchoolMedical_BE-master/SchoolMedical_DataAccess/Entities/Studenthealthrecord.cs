using System;
using System.Collections.Generic;

namespace SchoolMedical_DataAccess.Entities;

public partial class Studenthealthrecord
{
    public string Id { get; set; } = null!;

    public string StudentId { get; set; } = null!;

    public string CreatedBy { get; set; } = null!;

    public int? Height { get; set; }

    public string? Allergies { get; set; }

    public string? ChronicDiseases { get; set; }

    public string? Vision { get; set; }

    public string? Hearing { get; set; }

    public string? Status { get; set; }

    public virtual Account CreatedByNavigation { get; set; } = null!;

    public virtual Account Student { get; set; } = null!;

    public virtual ICollection<Treatmentrecord> Treatmentrecords { get; set; } = new List<Treatmentrecord>();

    public virtual ICollection<Vaccinerecord> Vaccinerecords { get; set; } = new List<Vaccinerecord>();
}
