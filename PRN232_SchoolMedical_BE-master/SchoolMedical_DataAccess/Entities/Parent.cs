using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.Entities;

public partial class Parent
{
	public string Id { get; set; } = null!; // same value as the owning Account.Id
	public string RelationshipStatus { get; set; } = null!;
	public string IncomeLevel { get; set; } = null!;
	public virtual Account Account { get; set; } = null!;
	public virtual ICollection<Student> Children { get; set; } = new List<Student>(); //List of children from this Parent
	public virtual ICollection<Medicinerequest> MedicinerequestRequestByNavigations { get; set; } = new List<Medicinerequest>(); //Parent class


}
