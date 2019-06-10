using IdeconCashFlow.Data.Business.GenericResponse;
using System;

namespace IdeconCashFlow.Business.UnitOfWorkFolder
{
    public interface IUnitOfWork:IDisposable
    {
        ManagerType GetManager<ManagerType, RepositoryType>() where ManagerType : class where RepositoryType : class;
        void Save();
    }
}
