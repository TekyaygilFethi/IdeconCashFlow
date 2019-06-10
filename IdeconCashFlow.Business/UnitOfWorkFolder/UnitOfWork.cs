using System;
using System.Collections.Generic;
using System.Text;
using IdeconCashFlow.Business.ExceptionFolder;
using IdeconCashFlow.Business.RepositoryFolder;
using IdeconCashFlow.Data.Business.GenericResponse;
using Microsoft.EntityFrameworkCore;

namespace IdeconCashFlow.Business.UnitOfWorkFolder
{
    public class UnitOfWork : IUnitOfWork
    {
        public DbContext db;

        public UnitOfWork(DbContext db)
        {
            this.db = db;
        }

        private IRepository<T> GetRepository<T>() where T : class
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

        public void Save()
        {
            try
            {
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void Dispose()
        {
            db.Dispose();
        }
    }
}
