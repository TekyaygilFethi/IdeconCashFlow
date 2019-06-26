using System;

namespace IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder
{
    public class GetParaBirimiParaBirimiKalemQueryResponse
    {
        public int DateIndicator { get; set; }

        public double Total { get; set; }

        public string Code { get; set; }

        public int ParaBirimiID { get; set; }

        public string AnaBaslikID { get; set; }

        public DateTime VadeTarihi { get; set; }
    }
}
