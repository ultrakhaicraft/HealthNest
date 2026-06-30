using SchoolMedical_DataAccess.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.DTOModels;

public class AccountDetailModel
{
	//This account Id regardless of role
	public string Id { get; set; } = null!;
	public string? StudentId { get; set; } //If this account is Parent and has Student, this info will appear and goes here
	public string? StudentName { get; set; } //Same as above
	public string? ParentId { get; set; } //If this account is Student and has Parent, this info will appear and goes here
	public string? ParentName { get; set; } //Same as above
	public string FullName { get; set; } = null!; //Regardless of role, this is the name of that account
	public string Email { get; set; } = null!;
	public string? PhoneNumber { get; set; }
	public string Role { get; set; } = null!;
	public string? Address { get; set; }
	public string? Status { get; set; }
}


public class AccountViewModel
{
	public string Id { get; set; } = null!;	
	public string FullName { get; set; } = null!;
	public string Email { get; set; } = null!;
	public string Role { get; set; } = null!;
	public string? Status { get; set; }
}

public class AccountCreateRequest
{
	[Required]
	public string FullName { get; set; } = null!;
	[Required]
	public string Email { get; set; } = null!;
	[Required]
	public string Password { get; set; } = null!;
	[Required]
	public string? PhoneNumber { get; set; } = null!;
	[Required]
	public string Role { get; set; } = null!;
	[Required]
	public string? Address { get; set; } = null!;

	public string? ParentId { get; set; }
}

public class AccountUpdateRequest
{
	[Required]
	public string FullName { get; set; } = null!;
	[Required]
	public string Email { get; set; } = null!;
	
	public string? Password { get; set; } = null!;
	[Required]
	public string? PhoneNumber { get; set; } = null!;
	[Required]
	public string Role { get; set; } = null!;
	[Required]
	public string? Address { get; set; } = null!;

	public string? ParentId { get; set; }
}

public class AccountQuery
{
	public string? Email { get; set; } = null!;
	public string? FullName { get; set; }
	public AccountRole? Role { get; set; }
	public AccountStatus? Status { get; set; } 
	public int PageNumber { get; set; } = 1; // Default to first page
	public int PageSize { get; set; } = 5; // Default page size
}

