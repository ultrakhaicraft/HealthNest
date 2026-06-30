using System;
using System.Collections.Generic;

namespace SchoolMedical_DataAccess.Entities;

public partial class Healthcheckupevent
{
    public string Id { get; set; } = null!;

    public string? StudentId { get; set; }

    public string CreatedBy { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string? ShortDescription { get; set; }

    public string? Content { get; set; }

    public DateTime DateOccurred { get; set; }

    public DateTime? DateSignupStart { get; set; }

    public DateTime? DateSignupEnd { get; set; }

    public string? Status { get; set; }

    public virtual Account CreatedByNavigation { get; set; } = null!;

    public virtual Account? Student { get; set; }

    public virtual ICollection<StudentHealthcheckup> StudentHealthcheckups { get; set; } = new List<StudentHealthcheckup>();
}
