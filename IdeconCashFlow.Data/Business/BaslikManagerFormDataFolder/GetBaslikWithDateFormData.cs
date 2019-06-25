using System;
using System.Collections.Generic;
using System.Text;

namespace IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder
{
    public class GetBaslikWithDateFormData
    {
        public DateTime BaslangicTarihi { get; set; }

        public string AnaBaslikID { get; set; } = "all";

        public string FilterType { get; set; }
    }
}
