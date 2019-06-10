using IdeconCashFlow.Business.RepositoryFolder;
using IdeconCashFlow.Data.POCO;
using System;

namespace IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder
{
    public class AnaBaslikManager : BasePrimitiveManagerFolder.BasePrimitiveManager<AnaBaslik>
    {
        //private readonly IRepository<AnaBaslik> anaBaslikRepository;

        public AnaBaslikManager(IRepository<AnaBaslik> repo) : base(repo) { }

        public AnaBaslik SingleGetBy(string ID)
        {
            try
            {
                return repository.SingleGetBy(w => w.ID == ID);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public AnaBaslik GetByID(string ID)
        {
            try
            {
                return repository.SingleGetBy(w => w.ID == ID);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


    }
}
