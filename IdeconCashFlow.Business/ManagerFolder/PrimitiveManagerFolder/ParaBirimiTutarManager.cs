using IdeconCashFlow.Business.RepositoryFolder;
using IdeconCashFlow.Data.POCO;

namespace IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder
{
    public class ParaBirimiTutarManager : BasePrimitiveManagerFolder.BasePrimitiveManager<ParaBirimiTutar>
    {
        public ParaBirimiTutarManager(IRepository<ParaBirimiTutar> repo) : base(repo) { }
    }
}
