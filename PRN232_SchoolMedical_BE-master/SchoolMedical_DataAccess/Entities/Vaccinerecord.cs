using System;
using System.Collections.Generic;

namespace SchoolMedical_DataAccess.Entities;

public partial class Vaccinerecord
{
    public string Id { get; set; } = null!;

    public string StudentId { get; set; } = null!;

    public string StudentHealthRecordId { get; set; } = null!;

    public DateTime RecordDate { get; set; }

    public string? Vaccine { get; set; }

    public string? Description { get; set; }

    public string? Status { get; set; }

    public virtual Account Student { get; set; } = null!;

    public virtual Studenthealthrecord StudentHealthRecord { get; set; } = null!;
}
