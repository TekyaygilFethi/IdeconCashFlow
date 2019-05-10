using IdeconCashFlow.Business.ExceptionFolder;
using IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder.BasePrimitiveManagerFolder;
using IdeconCashFlow.Business.RepositoryFolder;
using IdeconCashFlow.Data.Business.GenericResponse;
using IdeconCashFlow.Data.POCO;
using System;

namespace IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder
{
    public class BaslikManager:BasePrimitiveManager<Baslik>
    {
        private readonly IRepository<Baslik> baslikRepository;

        public BaslikManager(IRepository<Baslik> repo):base(repo)
        {
            baslikRepository = base.repository;
        }

        


    }
}
