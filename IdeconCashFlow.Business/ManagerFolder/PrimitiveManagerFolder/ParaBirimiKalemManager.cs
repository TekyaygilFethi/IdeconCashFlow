using IdeconCashFlow.Business.RepositoryFolder;
using IdeconCashFlow.Data.POCO;

namespace IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder
{
    class ParaBirimiKalemManager : BasePrimitiveManagerFolder.BasePrimitiveManager<ParaBirimiKalem>
    {
        private readonly IRepository<ParaBirimiKalem> paraBirimiKalemRepository;

        public ParaBirimiKalemManager(IRepository<ParaBirimiKalem> repo) : base(repo)
        {
            paraBirimiKalemRepository = repo;
        }
    }
}
