using IdeconCashFlow.Business.RepositoryFolder;
using IdeconCashFlow.Data.POCO;

namespace IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder
{
    public class ParaBirimiTutarManager : BasePrimitiveManagerFolder.BasePrimitiveManager<ParaBirimiTutar>
    {
        private readonly IRepository<ParaBirimiTutar> paraBirimiTutarRepository;

        public ParaBirimiTutarManager(IRepository<ParaBirimiTutar> repo) : base(repo)
        {
            paraBirimiTutarRepository = repo;
        }
    }
}
