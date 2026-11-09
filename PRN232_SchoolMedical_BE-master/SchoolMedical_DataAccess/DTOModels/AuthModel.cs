using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_DAO.DTOModels;

public class LoginRequest
{
	[Required]
	public string? Email { get; set; }
	[Required]
	public string? Password { get; set; }
}

public class LoginResponse
{	public string? FullName { get; set; }
	public string? Email { get; set; }
	public string? Role { get; set; }
	public string? Id { get; set; }

}

	public class RegisterRequest
{
	[Required]
	public required string FullName { get; set; }
	[Required]
	public required string Email { get; set; }
	[Required]
	public required string Password { get; set; }
	[Required]
	public required string ConfirmPassword { get; set; }
	[Required]
	public required string PhoneNumber { get; set; } 
	[Required]
	public required string Address { get; set; }
	[Required]
	public required string Gender { get; set; }  //Male or Female
	[Required]
	public DateTime DateOfBirth { get; set; }   //Time should be default to 0 o'clock

}


