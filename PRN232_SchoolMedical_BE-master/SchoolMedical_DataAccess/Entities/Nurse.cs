using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.Entities;

public partial class Nurse
{
	public string Id { get; set; } = null!; // same value as the owning Account.Id
	public string Description { get; set; } = null!; //Detail their education, specialization in a form of description
	public virtual Account Account { get; set; } = null!;

	public virtual ICollection<Incidentrecord> IncidentrecordHandleByNavigations { get; set; } = new List<Incidentrecord>(); //Nurse class
	public virtual ICollection<Studenthealthrecord> StudenthealthrecordCreatedByNavigations { get; set; } = new List<Studenthealthrecord>(); // Nurse who authored records — stays a collection
	public virtual ICollection<Meeting> MeetingHandleByNavigations { get; set; } = new List<Meeting>(); //Nurse create and handle the meeting

}
