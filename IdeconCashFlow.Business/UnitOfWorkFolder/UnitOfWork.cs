using System;
using System.Collections.Generic;
using System.Text;
using IdeconCashFlow.Business.ExceptionFolder;
using IdeconCashFlow.Business.RepositoryFolder;
using IdeconCashFlow.Data.Business.GenericResponse;
using Microsoft.EntityFrameworkCore;

namespace IdeconCashFlow.Business.UnitOfWorkFolder
{
    public class UnitOfWork : IUnitOfWork,IDisposable
    {
        public DbContext db;

        public UnitOfWork(DbContext db)
        {
            this.db = db;
        }

        public IRepository<T> GetRepository<T>() where T : class
        {
            return new Repository<T>(db);
        }

        public ManagerType GetManager<ManagerType, RepositoryType>() where ManagerType : class where RepositoryType : class
        {
            Type type = typeof(ManagerType);
            try
            {
                return (ManagerType)Activator.CreateInstance(typeof(ManagerType), GetRepository<RepositoryType>());
            }
            catch
            {
                throw new Exception("Error in manager type!!");
            }
        }

        public ResponseObject Save()
        {
            ResponseObject response = new ResponseObject();
            try
            {
                db.SaveChanges();
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Explanation = ExceptionOps.GetExceptionMessage(ex);
            }
            return response;
        }

        public void Dispose()
        {
            db.Dispose();
        }
    }
}
