using IdeconCashFlow.Business.RepositoryFolder;
using IdeconCashFlow.Data.POCO;
using System;
using System.Collections.Generic;
using System.Text;

namespace IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder
{
    class ParaBirimiManager : BasePrimitiveManagerFolder.BasePrimitiveManager<ParaBirimi>
    {
        private readonly IRepository<ParaBirimi> paraBirimiRepository;

        public ParaBirimiManager(IRepository<ParaBirimi> repo) : base(repo)
        {
            paraBirimiRepository = base.repository;
        }
    }
}
