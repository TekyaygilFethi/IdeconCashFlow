using IdeconCashFlow.Data.Business.GenericResponse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace IdeconCashFlow.Business.RepositoryFolder
{
    public interface IRepository<T> where T:class
    {
        ResponseObject Add(T item);
        ResponseObject Delete(T item);
        T GetByID(int ID);
        List<T> GetAll();
        List<T> GetBy(Expression<Func<T, bool>> predicate);
        T SingleGetBy(Expression<Func<T, bool>> predicate);
    }
}
