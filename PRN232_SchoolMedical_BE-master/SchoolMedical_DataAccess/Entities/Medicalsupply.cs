using System;
using System.Collections.Generic;

namespace SchoolMedical_DataAccess.Entities;

public partial class Medicalsupply
{
    public string Id { get; set; } = null!;

    public string CreatedBy { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public int Amount { get; set; }

    public bool? IsAvailable { get; set; } = true;

	public bool IsDeleted { get; set; } = false;

	public virtual Account CreatedByNavigation { get; set; } = null!;
}
