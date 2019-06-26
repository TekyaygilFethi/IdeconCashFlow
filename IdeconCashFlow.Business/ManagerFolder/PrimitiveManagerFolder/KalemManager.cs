using IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder.BasePrimitiveManagerFolder;
using IdeconCashFlow.Business.RepositoryFolder;
using IdeconCashFlow.Data.POCO;

namespace IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder
{
    public class KalemManager : BasePrimitiveManager<Kalem>
    {
        private readonly IRepository<Kalem> kalemRepository;

        public KalemManager(IRepository<Kalem> repo) : base(repo)
        {
            kalemRepository = base.repository;
        }
    }
}
