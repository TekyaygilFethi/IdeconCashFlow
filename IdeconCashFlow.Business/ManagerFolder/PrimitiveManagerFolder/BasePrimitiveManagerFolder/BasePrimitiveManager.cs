using IdeconCashFlow.Business.ExceptionFolder;
using IdeconCashFlow.Business.RepositoryFolder;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder.BasePrimitiveManagerFolder
{
    public class BasePrimitiveManager<T> : IBasePrimitiveManager<T> where T : class
    {
        protected readonly IRepository<T> repository;

        protected BasePrimitiveManager(IRepository<T> repo)
        {
            repository = repo;
        }

        //public string GetExceptionMessage(Exception ex)
        //{
        //    return ExceptionOps.GetExceptionMessage(ex);
        //}

        public void Add(T item)
        {
            try
            {
                repository.Add(item);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void Delete(T item)
        {
            try
            {
                repository.Delete(item);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public List<T> GetAll()
        {
            try
            {
                return repository.GetAll();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public List<T> GetBy(Expression<Func<T, bool>> predicate)
        {
            try
            {
                return repository.GetBy(predicate);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public T SingleGetBy(Expression<Func<T, bool>> predicate)
        {
            try
            {
                return repository.SingleGetBy(predicate);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        //public ResponseObject<T> Add(T item)
        //{
        //    ResponseObject<T> response = new ResponseObject<T>();
        //    try
        //    {
        //        repository.Add(item);
        //        response.IsSuccess = true;
        //        response.StatusCode = "200";
        //        response.Object = item;
        //        response.Explanation = "Success";
        //    }catch(Exception ex)
        //    {
        //        response.IsSuccess = false;
        //        response.StatusCode = "400";
        //        response.Explanation = ExceptionOps.GetExceptionMessage(ex);
        //    }
        //    return response;
        //}

        //public ResponseObject<T> GetByID(int ID)
        //{
        //    ResponseObject<T> response = new ResponseObject<T>();
        //    try
        //    {
        //        var item=repository.GetByID(ID);
        //        response.IsSuccess = true;
        //        response.StatusCode = "200";
        //        response.Object = item;
        //        response.Explanation = "Success";
        //    }
        //    catch (Exception ex)
        //    {
        //        response.IsSuccess = false;
        //        response.StatusCode = "400";
        //        response.Explanation = ExceptionOps.GetExceptionMessage(ex);
        //    }
        //    return response;
        //}

        //public ResponseObject<List<T>> GetAll()
        //{
        //    ResponseObject<List<T>> response = new ResponseObject<List<T>>();
        //    try
        //    {
        //        var list = repository.GetAll();
        //        response.IsSuccess = true;
        //        response.StatusCode = "200";
        //        response.Object = list;
        //        response.Explanation = "Success";
        //    }
        //    catch (Exception ex)
        //    {
        //        response.IsSuccess = false;
        //        response.StatusCode = "400";
        //        response.Explanation = ExceptionOps.GetExceptionMessage(ex);
        //    }
        //    return response;
        //}

        //public ResponseObject<List<T>> GetBy(Expression<Func<T, bool>> predicate)
        //{
        //    ResponseObject<List<T>> response = new ResponseObject<List<T>>();
        //    try
        //    {
        //        var list = repository.GetBy(predicate);
        //        response.IsSuccess = true;
        //        response.StatusCode = "200";
        //        response.Object = list;
        //        response.Explanation = "Success";
        //    }
        //    catch (Exception ex)
        //    {
        //        response.IsSuccess = false;
        //        response.StatusCode = "400";
        //        response.Explanation = ExceptionOps.GetExceptionMessage(ex);
        //    }
        //    return response;
        //}

        //public ResponseObject<T> SingleGetBy(Expression<Func<T, bool>> predicate)
        //{
        //    ResponseObject<T> response = new ResponseObject<T>();
        //    try
        //    {
        //        var item = repository.SingleGetBy(predicate);
        //        response.IsSuccess = true;
        //        response.StatusCode = "200";
        //        response.Object = item;
        //        response.Explanation = "Success";
        //    }
        //    catch (Exception ex)
        //    {
        //        response.IsSuccess = false;
        //        response.StatusCode = "400";
        //        response.Explanation = ExceptionOps.GetExceptionMessage(ex);
        //    }
        //    return response;
        //}

        //public ResponseObject<string> Delete(T item)
        //{
        //    ResponseObject<string> response = new ResponseObject<string>();
        //    try
        //    {
        //        repository.Delete(item);
        //        response.IsSuccess = true;
        //        response.StatusCode = "200";
        //        response.Object = "Silindi!";
        //        response.Explanation = "Success";
        //    }
        //    catch (Exception ex)
        //    {
        //        response.IsSuccess = false;
        //        response.StatusCode = "400";
        //        response.Explanation = ExceptionOps.GetExceptionMessage(ex);
        //    }
        //    return response;
        //}
    }
}
