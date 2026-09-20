using SchoolMedical_DataAccess.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.DTOModels.Accounts;

//Account section, Base class for Student, Parent, Nurse and Admin
public class AccountDetailModel
{
	public string Id { get; set; } = null!;
	public string? FullName { get; set; }  
	public string? Email { get; set; }
	public string? PhoneNumber { get; set; }
	public string? Role { get; set; }
	public string? Address { get; set; }
	public string? Status { get; set; }
	public string? Gender { get; set; }
	public string? AvatarUrl { get; set; }
	public DateTime DateOfBirth { get; set; }   
	public DateTime AccountCreationDateTime { get; set; } 
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
	public string PhoneNumber { get; set; } = null!;
	[Required]
	public string Role { get; set; } = null!;
	[Required]
	public string Address { get; set; } = null!;
	[Required]
	public string Gender { get; set; } = null!;
	[Required]
	public DateTime DateOfBirth { get; set; }
}

public class AccountUpdateRequest
{
	[Required]
	public string FullName { get; set; } = null!;
	[Required]
	public string Email { get; set; } = null!;
	[Required]
	public string Password { get; set; } = null!;
	[Required]
	public string PhoneNumber { get; set; } = null!;
	[Required]
	public string Role { get; set; } = null!;
	[Required]
	public string Address { get; set; } = null!;
	[Required]
	public string Gender { get; set; } = null!;
	[Required]
	public DateTime DateOfBirth { get; set; }
}

public class AccountViewModel
{
	public string Id { get; set; } = null!;
	public string FullName { get; set; } = null!;
	public string Email { get; set; } = null!;
	public string Gender { get; set; } = null!;
	public string Role { get; set; } = null!;
	public string Status { get; set; } = null!;
}

public class AccountQuery
{
	public string? Email { get; set; } 
	public string? FullName { get; set; }
	public AccountRole? Role { get; set; }
	public AccountStatus? Status { get; set; } 
	public int PageNumber { get; set; } = 1; // Default to first page
	public int PageSize { get; set; } = 5; // Default page size
}

