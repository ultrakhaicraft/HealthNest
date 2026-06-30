using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_BusinessLogic.Utility;

public static class ErrorMessage
{

	public static string ConfirmPasswordNotMatch ="Confirm Password not match with Password";
	public static string ValidatePassword ="Password does not meet the requirement:" +
		"-At least 8 characters long" +
		"-At least 1 character (uppercase or lowercase)" +
		"-At least 1 number" +
		"-At least 1 special character";
	public static string EmailExist ="This email has already used";
	public static string EmailNotFound ="Can't found the account with Email";
	public static string PasswordIncorrect ="The password is not correct";

	public static string MedicineNotFound= "The Medicine not found with this ID";
}
