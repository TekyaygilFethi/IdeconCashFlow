using IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder.BasePrimitiveManagerFolder;
using IdeconCashFlow.Business.RepositoryFolder;
using IdeconCashFlow.Data.POCO;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder
{
    public class TekliBaslikManager : BasePrimitiveManager<TekliBaslik>
    {
        private readonly IRepository<TekliBaslik> tekliBaslikRepository;

        public TekliBaslikManager(IRepository<TekliBaslik> repo) : base(repo)
        {
            tekliBaslikRepository = base.repository;
        }
        public bool DoesExists(string AnaBaslikID)
        {
            return tekliBaslikRepository.GetBy(w => w.AnaBaslikID== AnaBaslikID) != null;
        }

        public TekliBaslik SingleGetByAnaBaslik(string AnaBaslikID)
        {
            return tekliBaslikRepository.SingleGetBy(w => w.AnaBaslikID == AnaBaslikID);
        }
        
        public List<TekliBaslik> GetAll()
        {
            return GetDbSet().Include(i => i.AnaBaslik).Include(i => i.Kalemler).ToList();
        }

    }
}
