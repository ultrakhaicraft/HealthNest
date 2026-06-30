using Microsoft.Extensions.Configuration;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_BusinessLogic.Utility;
using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.Entities;
using SchoolMedical_DataAccess.Enums;
using SchoolMedical_DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SchoolMedical_BusinessLogic.Core;


public class AuthService : IAuthService
{
	private readonly IUnitOfWork _unitOfWork;
	private readonly IJwtUtils _jwtUtils;
	private readonly IConfiguration _configuration;
	public AuthService(IUnitOfWork unitOfWork, IJwtUtils jwtUtils, IConfiguration configuration)
	{
		_unitOfWork = unitOfWork;
		_jwtUtils = jwtUtils;
		_configuration = configuration;
	}
	public async Task<LoginResponse> Login(LoginRequest request)
	{
		try
		{
			var account = _unitOfWork.GetRepository<Account>().Find(user => user.Email == request.Email);
			if (account == null)
			{
				throw new AppException(ErrorMessage.EmailNotFound);
			}
			if (!BCrypt.Net.BCrypt.Verify(request.Password, account.Password))
			{
				throw new AppException(ErrorMessage.PasswordIncorrect);
			}

			var authClaims = new List<Claim>
		{
			new Claim("id", account.Id),
			new Claim(ClaimTypes.Name, account.FullName?? "N/A"),
			new Claim(ClaimTypes.Email, account.Email ?? "N/A"),
			new Claim(ClaimTypes.Role, account.Role ?? "N/A"),
			new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
		};

			var token = _jwtUtils.GenerateToken(authClaims, _configuration.GetSection("JwtSettings").Get<JwtModel>(), account);


			return new LoginResponse
			{
				Token = token,
				FullName = account.FullName,
				Email = account.Email,
				Id = account.Id.ToString(),
				Role = account.Role
			};
		}
		catch (Exception e)
		{

			Console.WriteLine(e.Message);
			return null;
		}
	}
	public async Task<string> RegisteAsync(RegisterRequest request, bool IsParent)
	{
		try
		{
			var existingAccount = _unitOfWork.GetRepository<Account>().Find(user => user.Email == request.Email);
			if (existingAccount != null)
				throw new AppException(ErrorMessage.EmailExist);

			if (!IsValid(request.Password))
				throw new AppException(ErrorMessage.ValidatePassword);

			if(request.Password!= request.ConfirmPassword)
				throw new AppException(ErrorMessage.ConfirmPasswordNotMatch);


			var account = new Account
			{
				Id = Guid.NewGuid().ToString(),
				FullName = request.FullName,
				Email = request.Email,
				PhoneNumber = request.PhoneNumber,
				Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
				Role = IsParent ? AccountRole.Parent.ToString() : AccountRole.Student.ToString(),
				Address = request.Address,
				Status = IsParent ? AccountStatus.Active.ToString() : AccountStatus.NotLinked.ToString(),
			};
			
			await _unitOfWork.GetRepository<Account>().InsertAsync(account);
			await _unitOfWork.SaveAsync();



			return account.Id;
		}
		catch (Exception e)
		{
			Console.WriteLine(e);
			return null;
		}
	}

	//private methods
	public bool IsValid(string password)
	{
		if (password.Length < 8) return false;

		if (!Regex.IsMatch(password, @"[a-zA-Z]")) return false;

		if (!Regex.IsMatch(password, @"[0-9]")) return false;

		if (!Regex.IsMatch(password, @"[@#$%^&*!_]")) return false;

		return true;
	}
}

