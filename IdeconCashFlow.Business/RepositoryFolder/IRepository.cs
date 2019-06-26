using IdeconCashFlow.Data.Business.GenericResponse;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace IdeconCashFlow.Business.RepositoryFolder
{
    public interface IRepository<T> where T : class
    {
        ResponseObject<T> Add(T item);
        ResponseObject<string> Delete(T item);
        T GetByID(int ID);
        List<T> GetAll();
        List<T> GetBy(Expression<Func<T, bool>> predicate);
        T SingleGetBy(Expression<Func<T, bool>> predicate);
        DbSet<T> GetDbSet();
    }
}
