using System;
using System.Collections.Generic;

namespace SchoolMedical_DataAccess.Entities;

public partial class Medicinerequest
{
    public string Id { get; set; } = null!;

    public string RequestBy { get; set; } = null!;

    public string ForStudent { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime DateSent { get; set; }

    public string? Status { get; set; }

    public virtual Account ForStudentNavigation { get; set; } = null!;

    public virtual Account RequestByNavigation { get; set; } = null!;
}
