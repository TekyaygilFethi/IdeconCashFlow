using IdeconCashFlow.Data.POCO;
using System;
using System.Collections.Generic;
using System.Text;

namespace IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder
{
    public class GetBaslikWithDateResponse
    {
        public DateTime VadeTarihi { get; set; }
        
        public List<ParaBirimiTutar> ParaBirimiTutarlar { get; set; }

        public string AnaBaslikID { get; set; }

        public string AnaBaslikAciklama { get; set; }
    }
}
