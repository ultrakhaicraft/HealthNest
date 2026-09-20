using SchoolMedical_DataAccess.DTOModels.Accounts;
using SchoolMedical_DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_BusinessLogic.Utility;

public abstract class AccountModelFactory
{
	public abstract AccountDetailModel CreateDetailModel(Account account);
}

public class StudentModelFactory : AccountModelFactory
{
	public override AccountDetailModel CreateDetailModel(Account account)
	{
		throw new NotImplementedException();
	}
}
