using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.Entities;

public partial class Admin
{
	public string Id { get; set; } = null!;
	public string Description { get; set; } = null!;
	public virtual Account Account { get; set; } = null!;

	public virtual ICollection<Healthcheckupevent> HealthcheckupeventCreatedByNavigations { get; set; } = new List<Healthcheckupevent>(); //Admin class since they create the event
	public virtual ICollection<Vaccineevent> VaccineeventCreatedByNavigations { get; set; } = new List<Vaccineevent>(); //Admin class

}
