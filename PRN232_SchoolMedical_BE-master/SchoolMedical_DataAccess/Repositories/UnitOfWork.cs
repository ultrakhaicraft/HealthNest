
using SchoolMedical_DataAccess.Entities;
using SchoolMedical_DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.Repositories;


public class UnitOfWork : IUnitOfWork
{
	private bool disposed = false;
	private readonly SchoolhealthdbContext _dbContext;
	public UnitOfWork(SchoolhealthdbContext dbContext)
	{
		_dbContext = dbContext;
	}

	public IGenericRepository<T> GetRepository<T>() where T : class
	{
		return new GenericRepository<T>(_dbContext);
	}
	public async Task SaveAsync()
	{
		await _dbContext.SaveChangesAsync();
	}
	public void Save()
	{
		_dbContext.SaveChanges();
	}
	protected virtual void Dispose(bool disposing)
	{
		if (!disposed)
		{
			if (disposing)
			{
				_dbContext.Dispose();
			}
		}
		disposed = true;
	}
	public void Dispose()
	{
		Dispose(true);
		GC.SuppressFinalize(this);
	}
	public void BeginTransaction()
	{
		_dbContext.Database.BeginTransaction();
	}
	public async Task BeginTransactionAsync()
	{
		await _dbContext.Database.BeginTransactionAsync();
	}

	public void CommitTransaction()
	{
		_dbContext.Database.CommitTransaction();
	}
	public async Task CommitTransactionAsync()
	{
		await _dbContext.Database.CommitTransactionAsync();
	}

	public void RollBack()
	{
		_dbContext.Database.RollbackTransaction();
	}
	public async Task RollBackAsync()
	{
		await _dbContext.Database.RollbackTransactionAsync();
	}
}


