using IdeconCashFlow.Data.POCO;
using System;
using System.Collections.Generic;
using System.Text;

namespace IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder
{
    public class KalemlerGroupByDateResponse
    {
        public KalemlerGroupByDateResponse()
        {
            Kalemler = new List<Kalem>();
        }

        public DateTime BaslangicTarihi { get; set; }

        public DateTime BitisTarihi { get; set; }

        public List<Kalem> Kalemler { get; set; }
    }
}
