using HealthNest_BusinessLogic.Interface;
using HealthNest_BusinessLogic.Utility;
using HealthNest_DAO.DTOModels;
using HealthNest_DAO.Entities;
using HealthNest_DAO.Enums;
using HealthNest_DAO.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace HealthNest_BusinessLogic.Core;


public class AuthService : IAuthService
{
	private readonly IUnitOfWork _unitOfWork;
	private readonly ITokenUtils _tokenUtils;
	public AuthService(IUnitOfWork unitOfWork, ITokenUtils jwtUtils)
	{
		_unitOfWork = unitOfWork;
		_tokenUtils = jwtUtils;
	}
	public async Task<(LoginResponse, TokensDTO)> Login(LoginRequest request)
	{
		
			var account = await _unitOfWork.GetRepository<Account>().FindAsync(user => user.Email == request.Email);
			if (account == null)
			{
				throw new UnauthorizedException(ErrorMessage.EmailNotFound);
			}
			if (!BCrypt.Net.BCrypt.Verify(request.Password, account.Password))
			{
				throw new UnauthorizedException(ErrorMessage.PasswordIncorrect);
			}

		
			var tokens = await _tokenUtils.GenerateTokens(account);

			var tokenDto = new TokensDTO
			{
				AccessTokenString = tokens.accessToken,
				RefreshTokenString = tokens.refreshToken,
			};

			var responseModel = new LoginResponse
			{

				FullName = account.FullName,
				Email = account.Email,
				Id = account.Id.ToString(),
				Role = account.Role
			};
			return (responseModel, tokenDto);
		
	}
	public async Task<string> RegisterParentAsync(ParentRegisterRequest request)
	{
		var account = await CreateAccountAsync(request, AccountRole.Parent, AccountStatus.Active);

		await _unitOfWork.GetRepository<Parent>().InsertAsync(new Parent
		{
			Id = account.Id,
			IncomeLevel = request.IncomeLevel,
			RelationshipStatus = request.RelationshipStatus,
		});

		await _unitOfWork.SaveAsync();   
		return account.Id;
	}

	public async Task<string> RegisterStudentAsync(StudentRegisterRequest request)
	{
		var account = await CreateAccountAsync(request, AccountRole.Student, AccountStatus.NotLinked);

		await _unitOfWork.GetRepository<Student>().InsertAsync(new Student
		{
			Id = account.Id,
			Class = request.Class,
			CurrentHealthStatus = StudentHealthStatus.Healthy.ToString()
		});

		await _unitOfWork.SaveAsync();
		return account.Id;
	}

	public Task<TokensDTO> RefreshToken(TokensDTO tokens)
	{
		var newTokenDtos = _tokenUtils.RefreshToken(tokens);

		return newTokenDtos;
	}


	// Shared core: validates and inserts the Account, but does NOT save.
	private async Task<Account> CreateAccountAsync(RegisterRequest request, AccountRole role, AccountStatus status)
	{
		var existingAccount = _unitOfWork.GetRepository<Account>()
			.Find(user => user.Email == request.Email);
		if (existingAccount != null)
			throw new BadRequestException(ErrorMessage.EmailExist);

		if (!IsValid(request.Password ?? string.Empty))
			throw new BadRequestException(ErrorMessage.ValidatePassword);

		if (request.Password != request.ConfirmPassword)
			throw new BadRequestException(ErrorMessage.ConfirmPasswordNotMatch);

		var account = new Account
		{
			Id = Guid.NewGuid().ToString(),
			FullName = request.FullName ?? "N/A",
			Email = request.Email ?? "N/A",
			PhoneNumber = request.PhoneNumber,
			Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
			Role = role.ToString(),
			Address = request.Address,
			Gender = request.Gender,
			DateOfBirth = request.DateOfBirth,
			Status = status.ToString(),
		};

		await _unitOfWork.GetRepository<Account>().InsertAsync(account);
		return account;
	}

	//private methods
	private bool IsValid(string password)
	{
		if(string.IsNullOrEmpty(password)) return false;

		if (password.Length < 8) return false;

		if (!Regex.IsMatch(password, @"[a-zA-Z]")) return false;

		if (!Regex.IsMatch(password, @"[0-9]")) return false;

		if (!Regex.IsMatch(password, @"[@#$%^&*!_]")) return false;

		return true;
	}

	
}

