using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.Entities;

//Very rely on Account Class, since it hold important detail like FullName, Password, Email
public partial class Student
{
	public string Id { get; set; } = null!; // same value as the owning Account.Id
	public string? ParentId { get; set; } // Point to Parent.Id
	public string Class { get; set; } = null!; //Include Grade and Class Number
	public string CurrentHealthStatus { get; set; } = null!; //Use Enum CurrentHealthStatus for health monitoring


	public virtual Account Account { get; set; } = null!;
	public virtual Parent? Parent { get; set; } //Parent of this child (student)
	public virtual ICollection<HealthcheckupeventStudent> HealthcheckupeventStudents { get; set; } = new List<HealthcheckupeventStudent>();  //Most likely related to Student
	public virtual ICollection<VaccineeventStudent> VaccineeventStudents { get; set; } = new List<VaccineeventStudent>(); //Most likely related to Student
	public virtual ICollection<Incidentrecord> IncidentrecordStudents { get; set; } = new List<Incidentrecord>(); //Most likely related to Student
	public virtual ICollection<Medicinerequest> MedicinerequestForStudentNavigations { get; set; } = new List<Medicinerequest>(); //Student class
	public virtual Studenthealthrecord? StudentHealthRecord { get; set; } // Attach to Student Class
	public virtual ICollection<Meeting> MeetingStudents { get; set; } = new List<Meeting>(); //What kind of meeting does this Student Have

}
