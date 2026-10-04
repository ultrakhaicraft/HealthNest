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
	public async Task<string> RegisterAsync(RegisterRequest request, bool IsParent)
	{
		
			var existingAccount = _unitOfWork.GetRepository<Account>().Find(user => user.Email == request.Email);
			if (existingAccount != null)
				throw new BadRequestException(ErrorMessage.EmailExist);

			if (!IsValid(request.Password ?? string.Empty))
				throw new BadRequestException(ErrorMessage.ValidatePassword);

			if(request.Password!= request.ConfirmPassword)
				throw new BadRequestException(ErrorMessage.ConfirmPasswordNotMatch);

			var account = new Account
			{
				Id = Guid.NewGuid().ToString(),
				FullName = request.FullName ?? "N/A",
				Email = request.Email ?? "N/A",
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

	//private methods
	public bool IsValid(string password)
	{
		if(string.IsNullOrEmpty(password)) return false;

		if (password.Length < 8) return false;

		if (!Regex.IsMatch(password, @"[a-zA-Z]")) return false;

		if (!Regex.IsMatch(password, @"[0-9]")) return false;

		if (!Regex.IsMatch(password, @"[@#$%^&*!_]")) return false;

		return true;
	}

	public Task<TokensDTO> RefreshToken(TokensDTO tokens)
	{
		var newTokenDtos = _tokenUtils.RefreshToken(tokens);

		return newTokenDtos;
	}
}

