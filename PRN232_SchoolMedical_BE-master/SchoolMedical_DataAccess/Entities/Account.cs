using System;
using System.Collections.Generic;

namespace SchoolMedical_DataAccess.Entities;

// Account is super class for Student, Parent, Nurse  and Admin
public partial class Account
{
	public string Id { get; set; } = null!;
	public string FullName { get; set; } = null!;
	public string Email { get; set; } = null!;
	public string Password { get; set; } = null!;
	public string? PhoneNumber { get; set; } //Optional, especially for Student
	public string Role { get; set; } = null!;
	public string? Address { get; set; }
	public string? Status { get; set; }
	public string Gender { get; set; } = null!; //Male or Female
	public string AvatarUrl { get; set; } = null!; //Image URL
	public string DateOfBirth { get; set; } = null!; //Unsure if need to use DateTime
	public DateTime AccountCreationDateTime { get; set; } //Non-nullable, but when migrations, it might throw an error because previous accounts does not have this data

	//Reverse Navigation, an Account ideally should only have 1 of these 4 based on Role
	public virtual Student? Student { get; set; }
	public virtual Parent? Parent { get; set; }
	public virtual Admin? Admin { get; set; }
	public virtual Nurse? Nurse { get; set; }




	//public virtual ICollection<Healthcheckupevent> HealthcheckupeventCreatedByNavigations { get; set; } = new List<Healthcheckupevent>(); //Admin class since they create the event
	//public virtual ICollection<HealthcheckupeventStudent> HealthcheckupeventStudents { get; set; } = new List<HealthcheckupeventStudent>();  //Most likely related to Student
	//public virtual ICollection<Vaccineevent> VaccineeventCreatedByNavigations { get; set; } = new List<Vaccineevent>(); //Admin class
	//public virtual ICollection<VaccineeventStudent> VaccineeventStudents { get; set; } = new List<VaccineeventStudent>(); //Most likely related to Student

	//public virtual ICollection<Incidentrecord> IncidentrecordHandleByNavigations { get; set; } = new List<Incidentrecord>(); //Nurse class
	//public virtual ICollection<Incidentrecord> IncidentrecordStudents { get; set; } = new List<Incidentrecord>(); //Most likely related to Student
	// public virtual ICollection<Account> InverseParent { get; set; } = new List<Account>();
	// public virtual Account? Parent { get; set; } Only Student class make use of Parent data
	// public virtual ICollection<Medicalsupply> Medicalsupplies { get; set; } = new List<Medicalsupply>(); Only for Nurse class
	// public virtual ICollection<Medicine> Medicines { get; set; } = new List<Medicine>(); Only for Nurse class
	//public virtual ICollection<Medicinerequest> MedicinerequestForStudentNavigations { get; set; } = new List<Medicinerequest>(); //Student class
	//public virtual ICollection<Medicinerequest> MedicinerequestRequestByNavigations { get; set; } = new List<Medicinerequest>(); //Parent class

	//public virtual ICollection<Studenthealthrecord> StudenthealthrecordCreatedByNavigations { get; set; } = new List<Studenthealthrecord>(); // Nurse who authored records — stays a collection
	//public virtual Studenthealthrecord? StudentHealthRecord { get; set; } // Attach to Student Class

	//public virtual ICollection<Meeting> MeetingStudents { get; set; } = new List<Meeting>(); //Unsure
	//public virtual ICollection<Meeting> MeetingHandleByNavigations { get; set; } = new List<Meeting>(); //Unsure

}
