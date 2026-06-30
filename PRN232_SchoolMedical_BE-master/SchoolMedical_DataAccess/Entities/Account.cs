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

    public virtual ICollection<Healthcheckupevent> HealthcheckupeventStudents { get; set; } = new List<Healthcheckupevent>();

    public virtual ICollection<Incidentrecord> IncidentrecordHandleByNavigations { get; set; } = new List<Incidentrecord>();

    public virtual ICollection<Incidentrecord> IncidentrecordStudents { get; set; } = new List<Incidentrecord>();

    public virtual ICollection<Account> InverseParent { get; set; } = new List<Account>();

    public virtual ICollection<Medicalsupply> Medicalsupplies { get; set; } = new List<Medicalsupply>();

    public virtual ICollection<Medicinerequest> MedicinerequestForStudentNavigations { get; set; } = new List<Medicinerequest>();

    public virtual ICollection<Medicinerequest> MedicinerequestRequestByNavigations { get; set; } = new List<Medicinerequest>();

    public virtual ICollection<Medicine> Medicines { get; set; } = new List<Medicine>();

    public virtual Account? Parent { get; set; }

    public virtual ICollection<StudentHealthcheckup> StudentHealthcheckups { get; set; } = new List<StudentHealthcheckup>();

    public virtual ICollection<StudentVaccinecheckup> StudentVaccinecheckups { get; set; } = new List<StudentVaccinecheckup>();

    public virtual ICollection<Studenthealthrecord> StudenthealthrecordCreatedByNavigations { get; set; } = new List<Studenthealthrecord>();

    public virtual ICollection<Studenthealthrecord> StudenthealthrecordStudents { get; set; } = new List<Studenthealthrecord>();

    public virtual ICollection<Treatmentrecord> Treatmentrecords { get; set; } = new List<Treatmentrecord>();

    public virtual ICollection<Vaccineevent> VaccineeventCreatedByNavigations { get; set; } = new List<Vaccineevent>();

    public virtual ICollection<Vaccineevent> VaccineeventStudents { get; set; } = new List<Vaccineevent>();

    public virtual ICollection<Vaccinerecord> Vaccinerecords { get; set; } = new List<Vaccinerecord>();
}
