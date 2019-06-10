using IdeconCashFlow.Business.RepositoryFolder;
using IdeconCashFlow.Data.POCO;

namespace IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder
{
    class ParaBirimiManager : BasePrimitiveManagerFolder.BasePrimitiveManager<ParaBirimi>
    {
        public ParaBirimiManager(IRepository<ParaBirimi> repo) : base(repo) { }
    }
}
