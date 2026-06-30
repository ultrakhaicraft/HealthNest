using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.DTOModels;

public class LoginRequest
{
	[Required]
	public string? Email { get; set; }
	[Required]
	public string? Password { get; set; }
}

public class LoginResponse
{
	public JWTToken? Token { get; set; }
	public string? FullName { get; set; }
	public string? Email { get; set; }
	public string? Role { get; set; }
	public string? Id { get; set; }

}

	public class RegisterRequest
{
	[Required]
	public string? FullName { get; set; }
	[Required]
	public string? Email { get; set; }
	[Required]
	public string? Password { get; set; }
	[Required]
	public string? ConfirmPassword { get; set; }
	[Required]
	public string? PhoneNumber { get; set; } 
	[Required]
	public string? Address { get; set; }

}


