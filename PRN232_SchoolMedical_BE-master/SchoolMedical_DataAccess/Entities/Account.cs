using System;
using System.Collections.Generic;

namespace HealthNest_DAO.Entities;

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
	public string Status { get; set; } = null!;
	public string Gender { get; set; } = null!; //Male or Female
	public string? AvatarUrl { get; set; } //Image Url (Optional)
	public DateTime DateOfBirth { get; set; }   //Time should be default to 0 o'clock
	public DateTime AccountCreationDateTime { get; set; } //Non-nullable, but when migrations, it might throw an error because previous accounts does not have this data

	//Reverse Navigation, an Account ideally should only have 1 of these 4 based on Role
	public virtual Student? Student { get; set; }
	public virtual Parent? Parent { get; set; }
	public virtual Admin? Admin { get; set; }
	public virtual Nurse? Nurse { get; set; }

	public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();


	

}
