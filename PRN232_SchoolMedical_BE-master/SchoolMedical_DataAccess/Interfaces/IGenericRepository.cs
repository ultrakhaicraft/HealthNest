using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.Interfaces;

public interface IGenericRepository<T> where T : class
{
	IQueryable<T> GetAll();
	Task<IQueryable<T>> GetAllAsync();
	T? GetById(object id);
	Task<T?> GetByIdAsync(object id);
	void Insert(T obj);
	Task InsertAsync(T obj);
	void InsertRange(List<T> obj);
	Task InsertRangeAsync(List<T> obj);
	void Update(T obj);
	Task UpdateAsync(T obj);
	void Delete(object entity);
	Task DeleteAsync(object entity);
	void Save();
	Task SaveAsync();
	T? Find(Expression<Func<T, bool>> predicate);
	Task<T?> FindAsync(Expression<Func<T, bool>> predicate);
	IQueryable<T> Include(params Expression<Func<T, object>>[] includeProperties);
	IQueryable<T> Entities { get; }
}
