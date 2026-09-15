using System;
using System.Collections.Generic;

namespace SchoolMedical_DataAccess.Entities;

public partial class Incidentrecord
{
    public string Id { get; set; } = null!;

    public string StudentId { get; set; } = null!;

    public string HandleBy { get; set; } = null!; //Nurse Id

    public string? IncidentType { get; set; }

    public string? Description { get; set; }

    public DateTime DateOccurred { get; set; }

    public string? Status { get; set; }

    public virtual Nurse HandleByNavigation { get; set; } = null!;  //Nurse create and handle the incident

    public virtual Student Student { get; set; } = null!; //Student who associate with the record
}
