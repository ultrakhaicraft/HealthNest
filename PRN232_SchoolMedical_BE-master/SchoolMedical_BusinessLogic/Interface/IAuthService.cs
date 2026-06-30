using SchoolMedical_DataAccess.DTOModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_BusinessLogic.Interface;

/// <summary>
/// IAuthService interface defines the contract for authentication-related operations.
/// Only Parent and Student can register through normal mean. 
/// School Nurse, Manager and Admin will be created by the Administration CRUD.
/// </summary>
public interface IAuthService
{
	Task<LoginResponse> Login(LoginRequest request);
	Task<string> RegisteAsync(RegisterRequest request, bool IsParent);
	
}
