﻿using IdeconCashFlow.Business.ExceptionFolder;
using IdeconCashFlow.Data.Business.GenericResponse;
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

        public ResponseObject Add(T item)
        {
            ResponseObject response = new ResponseObject();
            try
            {
                db.Set<T>().Add(item);
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Explanation = ExceptionOps.GetExceptionMessage(ex);
            }
            return response;
        }

        public ResponseObject Delete(T item)
        {
            ResponseObject response = new ResponseObject();
            try
            {
                db.Set<T>().Remove(item);
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Explanation = ExceptionOps.GetExceptionMessage(ex);
            }
            return response;            
        }

        public List<T> GetAll()
        {
            return db.Set<T>().ToList();
        }

        public List<T> GetBy(Expression<Func<T, bool>> predicate)
        {
            return db.Set<T>().Where(predicate).ToList();
        }

        public T GetByID(int ID)
        {
            return db.Set<T>().Find(ID);
        }

        public T SingleGetBy(Expression<Func<T, bool>> predicate)
        {
            return db.Set<T>().SingleOrDefault(predicate);
        }
    }
}
