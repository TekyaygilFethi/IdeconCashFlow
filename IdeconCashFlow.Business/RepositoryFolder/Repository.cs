using IdeconCashFlow.Business.ExceptionFolder;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace IdeconCashFlow.Business.RepositoryFolder
{
    public class Repository<T> : IRepository<T> where T : class
    {
        public DbContext db;

        public Repository(DbContext db)
        {
            this.db = db;
        }

        private static string GetExceptionMessage(Exception ex)
        {
            return ExceptionOps.GetExceptionMessage(ex);
        }

        public void Add(T item)
        {
            try
            {
                db.Set<T>().Add(item);
            }
            catch (Exception ex)
            {
                throw new Exception(GetExceptionMessage(ex));
            }
        }

        public void Delete(T item)
        {
            try
            {
                db.Set<T>().Remove(item);
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
                return db.Set<T>().ToList();
            }
            catch (Exception ex)
            {
                throw new Exception(GetExceptionMessage(ex));
            }
        }

        public List<T> GetBy(Expression<Func<T, bool>> predicate)
        {
            try
            {
                return db.Set<T>().Where(predicate).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception(GetExceptionMessage(ex));
            }
        }

        public T GetByID(int ID)
        {
            try
            {
                return db.Set<T>().Find(ID);
            }
            catch (Exception ex)
            {
                throw new Exception(GetExceptionMessage(ex));
            }            
        }

        public T SingleGetBy(Expression<Func<T, bool>> predicate)
        {
            try
            {
                return db.Set<T>().SingleOrDefault(predicate);
            }
            catch (Exception ex)
            {
                throw new Exception(GetExceptionMessage(ex));
            }
            
        }

        public bool Any(Func<T, bool> predicate)
        {
            try
            {
                return db.Set<T>().Any(predicate);
            }
            catch (Exception ex)
            {
                throw new Exception(GetExceptionMessage(ex));
            }
        }

        public DbSet<T> GetDbSet()
        {
            try
            {
                return db.Set<T>();
            }
            catch (Exception ex)
            {
                throw new Exception(GetExceptionMessage(ex));
            }
        }
    }
}
