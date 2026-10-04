using HealthNest_DAO.DTOModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_BusinessLogic.Interface;

/// <summary>
/// IAuthService interface defines the contract for authentication-related operations.
/// Only Parent and Student can register through normal mean. 
/// School Nurse, Manager and Admin will be created by the Administration CRUD.
/// </summary>
public interface IAuthService
{
	Task<(LoginResponse, TokensDTO)> Login(LoginRequest request);
	Task<string> RegisterAsync(RegisterRequest request, bool IsParent);
	Task<TokensDTO> RefreshToken(TokensDTO tokens);

}
