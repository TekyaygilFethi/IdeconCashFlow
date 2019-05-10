using IdeconCashFlow.Business.RepositoryFolder;
using IdeconCashFlow.Data.Business.GenericResponse;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder.BasePrimitiveManagerFolder
{
    public class BasePrimitiveManager<T> :IRepository<T> where T:class
    {
        protected readonly IRepository<T> repository;

        protected BasePrimitiveManager(IRepository<T> repo)
        {
            repository = repo;
        }

        public ResponseObject Add(T item)
        {
            return repository.Add(item);
        }

        public ResponseObject Delete(T item)
        {
            return repository.Delete(item);
        }

        public T GetByID(int ID)
        {
            return repository.GetByID(ID);
        }

        public List<T> GetAll()
        {
            return repository.GetAll();
        }

        public List<T> GetBy(Expression<Func<T, bool>> predicate)
        {
            return repository.GetBy(predicate);
        }

        public T SingleGetBy(Expression<Func<T, bool>> predicate)
        {
            return repository.SingleGetBy(predicate);
        }
        
    }
}
