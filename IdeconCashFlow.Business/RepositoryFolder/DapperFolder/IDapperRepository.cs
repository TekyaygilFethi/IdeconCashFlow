using System;
using System.Collections.Generic;

namespace IdeconCashFlow.Business.RepositoryFolder.DapperFolder
{
    public interface IDapperRepository:IDisposable 
    {
        IEnumerable<TEntity> Query<TEntity>(string query);
        int Execute(string query);
    }
}
