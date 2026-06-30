using System;
using System.Collections.Generic;

namespace SchoolMedical_DataAccess.Entities;

public partial class StudentHealthcheckup
{
    public string Id { get; set; } = null!;

    public string? EventId { get; set; }

    public string? StudentId { get; set; }

    public string? ResultSummary { get; set; }

    public string? Status { get; set; }

    public virtual Healthcheckupevent? Event { get; set; }

    public virtual Account? Student { get; set; }
}
