using IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder.BasePrimitiveManagerFolder;
using IdeconCashFlow.Business.RepositoryFolder;
using IdeconCashFlow.Data.POCO;
using System;
using System.Collections.Generic;

namespace IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder
{
    public class TekliBaslikManager : BasePrimitiveManager<TekliBaslik>
    {
        public TekliBaslikManager(IRepository<TekliBaslik> repo) : base(repo) { }

        public bool DoesExists(string AnaBaslikID)
        {
            return base.repository.Any(w => w.AnaBaslikID == AnaBaslikID);
        }

        public TekliBaslik SingleGetByAnaBaslik(string AnaBaslikID)
        {
            return base.repository.SingleGetBy(w => w.AnaBaslikID == AnaBaslikID);
        }

        //public new List<TekliBaslik> GetAll()
        //{
        //    try
        //    {
        //        return base.repository.GetAll();
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception(ex.Message);
        //    }
        //    //return GetDbSet().Include(i => i.AnaBaslik).Include(i => i.Kalemler).ToList();
        //}

    }
}
