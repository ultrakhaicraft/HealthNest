using System;
using System.Collections.Generic;

namespace SchoolMedical_DataAccess.Entities;

public partial class Incidentrecord
{
    public string Id { get; set; } = null!;

    public string StudentId { get; set; } = null!;

    public string HandleBy { get; set; } = null!;

    public string? IncidentType { get; set; }

    public string? Description { get; set; }

    public DateTime DateOccurred { get; set; }

    public string? Status { get; set; }

    public virtual Account HandleByNavigation { get; set; } = null!;

    public virtual Account Student { get; set; } = null!;
}
