using IdeconCashFlow.Data.Business.GenericResponse;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder.BasePrimitiveManagerFolder
{
    public interface IBasePrimitiveManager<T> where T:class
    {
        void Add(T item);
        void Delete(T item);
        //ResponseObject<T> GetByID(object ID,Type IDType);
        List<T> GetAll();
        List<T> GetBy(Expression<Func<T, bool>> predicate);
        T SingleGetBy(Expression<Func<T, bool>> predicate);
    }
}
