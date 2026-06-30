using Microsoft.EntityFrameworkCore;
using SchoolMedical_DataAccess.Entities;
using SchoolMedical_DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.Repositories;


public class GenericRepository <T> : IGenericRepository<T> where T : class
{
	protected readonly SchoolhealthdbContext _context;
	protected readonly DbSet<T> _dbSet;

	public GenericRepository(SchoolhealthdbContext dbContext)
	{
		_context = dbContext;
		_dbSet = _context.Set<T>();
	}

	public IQueryable<T> Entities => _context.Set<T>();
	public IQueryable<T> GetAll()
	{
		return _dbSet.AsQueryable();
	}
	public async Task<IQueryable<T>> GetAllAsync()
	{
		return  _dbSet.AsQueryable();
	}

	public async Task<T?> GetByIdAsync(object id)
	{
		return await _dbSet.FindAsync(id);
	}

	public T? GetById(object id)
	{

		return _dbSet.Find(id);
	}

	public T? Find(Expression<Func<T, bool>> predicate)
	{
		return _dbSet.FirstOrDefault(predicate);
	}

	public async Task<T?> FindAsync(Expression<Func<T, bool>> predicate)
	{
		return await _dbSet.FirstOrDefaultAsync(predicate);
	}

	public void Insert(T obj)
	{
		_dbSet.Add(obj);
	}

	public async Task InsertAsync(T obj)
	{
		await _dbSet.AddAsync(obj);
	}
	public void InsertRange(List<T> obj)
	{
		_dbSet.AddRange(obj);
	}
	public async Task InsertRangeAsync(List<T> obj)
	{
		await _dbSet.AddRangeAsync(obj);
	}

	public void Update(T obj)
	{
		_context.Entry(obj).State = EntityState.Modified;
	}
	public Task UpdateAsync(T obj)
	{
		return Task.FromResult(_dbSet.Update(obj));
	}
	public void Delete(object entity)
	{
		_dbSet.Remove((T)entity);
	}

	public async Task DeleteAsync(object entity)
	{
		_dbSet.Remove((T)entity);
		await Task.CompletedTask;
	}


	public void Save()
	{
		_context.SaveChanges();
	}

	public async Task SaveAsync()
	{
		await _context.SaveChangesAsync();
	}


	public IQueryable<T> Include(params Expression<Func<T, object>>[] includeProperties)
	{
		IQueryable<T> query = _dbSet;
		foreach (var includeProperty in includeProperties)
		{
			query = query.Include(includeProperty);
		}
		return query;
	}

	
}

