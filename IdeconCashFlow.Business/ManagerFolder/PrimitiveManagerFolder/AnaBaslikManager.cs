using IdeconCashFlow.Business.RepositoryFolder;
using IdeconCashFlow.Data.POCO;

namespace IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder
{
    public class AnaBaslikManager : BasePrimitiveManagerFolder.BasePrimitiveManager<AnaBaslik>
    {
        private readonly IRepository<AnaBaslik> anaBaslikRepository;

        public AnaBaslikManager(IRepository<AnaBaslik> repo) : base(repo)
        {
            anaBaslikRepository = repo;
        }

        public AnaBaslik SingleGetBy(string ID)
        {
            return anaBaslikRepository.SingleGetBy(w => w.ID == ID);
        }

        public bool DoesExists(string ID)
        {
            return anaBaslikRepository.GetBy(w => w.ID == ID) != null;
        }

        public AnaBaslik GetByID(string ID)
        {
            return anaBaslikRepository.SingleGetBy(w => w.ID == ID);
        }


    }
}
