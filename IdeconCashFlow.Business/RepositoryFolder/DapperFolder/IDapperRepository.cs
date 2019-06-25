using System;
using System.Collections.Generic;

namespace IdeconCashFlow.Business.RepositoryFolder.DapperFolder
{
    public interface IDapperRepository:IDisposable 
    {
        void Insert<TEntity>(TEntity Entity);
        void Delete<TEntity>(TEntity Entity);
        void Update<TEntity>(TEntity entity);
        IEnumerable<TEntity> Query<TEntity>(string query);
    }
}
