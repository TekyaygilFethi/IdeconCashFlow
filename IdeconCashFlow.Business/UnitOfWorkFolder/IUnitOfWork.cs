using IdeconCashFlow.Business.RepositoryFolder;
using System;
using IdeconCashFlow.Data.Business.GenericResponse;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdeconCashFlow.Business.UnitOfWorkFolder
{
    public interface IUnitOfWork
    {
        ManagerType GetManager<ManagerType, RepositoryType>() where ManagerType : class where RepositoryType : class;
        ResponseObject Save();
        IRepository<T> GetRepository<T>() where T : class;
    }
}
