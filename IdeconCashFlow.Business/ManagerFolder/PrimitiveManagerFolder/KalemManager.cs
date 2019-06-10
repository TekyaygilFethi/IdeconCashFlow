using IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder.BasePrimitiveManagerFolder;
using IdeconCashFlow.Business.RepositoryFolder;
using IdeconCashFlow.Data.POCO;

namespace IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder
{
    public class KalemManager : BasePrimitiveManager<Kalem>
    {
        public KalemManager(IRepository<Kalem> repo) : base(repo) { }
    }
}
