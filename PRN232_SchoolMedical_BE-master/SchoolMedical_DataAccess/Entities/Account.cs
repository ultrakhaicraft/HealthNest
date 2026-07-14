using System;
using System.Collections.Generic;

namespace SchoolMedical_DataAccess.Entities;

public partial class Account
{
	public string Id { get; set; } = null!;
	public string? ParentId { get; set; }
	public string FullName { get; set; } = null!;
	public string Email { get; set; } = null!;
	public string Password { get; set; } = null!;
	public string? PhoneNumber { get; set; }
	public string Role { get; set; } = null!;
	public string? Address { get; set; }
	public string? Status { get; set; }


	public virtual ICollection<Healthcheckupevent> HealthcheckupeventCreatedByNavigations { get; set; } = new List<Healthcheckupevent>();
	public virtual ICollection<HealthcheckupeventStudent> HealthcheckupeventStudents { get; set; } = new List<HealthcheckupeventStudent>(); // was ICollection<Healthcheckupevent>
	public virtual ICollection<Vaccineevent> VaccineeventCreatedByNavigations { get; set; } = new List<Vaccineevent>();
	public virtual ICollection<VaccineeventStudent> VaccineeventStudents { get; set; } = new List<VaccineeventStudent>(); // was ICollection<Vaccineevent>

	public virtual ICollection<Incidentrecord> IncidentrecordHandleByNavigations { get; set; } = new List<Incidentrecord>();
	public virtual ICollection<Incidentrecord> IncidentrecordStudents { get; set; } = new List<Incidentrecord>();
	public virtual ICollection<Account> InverseParent { get; set; } = new List<Account>();
	public virtual Account? Parent { get; set; }
	public virtual ICollection<Medicalsupply> Medicalsupplies { get; set; } = new List<Medicalsupply>();
	public virtual ICollection<Medicine> Medicines { get; set; } = new List<Medicine>();
	public virtual ICollection<Medicinerequest> MedicinerequestForStudentNavigations { get; set; } = new List<Medicinerequest>();
	public virtual ICollection<Medicinerequest> MedicinerequestRequestByNavigations { get; set; } = new List<Medicinerequest>();

	public virtual ICollection<Studenthealthrecord> StudenthealthrecordCreatedByNavigations { get; set; } = new List<Studenthealthrecord>(); // nurse who authored records — stays a collection
	public virtual Studenthealthrecord? StudentHealthRecord { get; set; } // NEW — 1:1, replaces StudenthealthrecordStudents collection

	public virtual ICollection<Meeting> MeetingStudents { get; set; } = new List<Meeting>();
	public virtual ICollection<Meeting> MeetingHandleByNavigations { get; set; } = new List<Meeting>();

}
