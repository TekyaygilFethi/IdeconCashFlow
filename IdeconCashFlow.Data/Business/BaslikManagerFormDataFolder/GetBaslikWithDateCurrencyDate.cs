using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder
{
    public class GetBaslikWithDateCurrencyDate
    {
        [JsonProperty("vadeTarihi")]
        public DateTime VadeTarihi { get; set; }

        [JsonProperty("Tutar")]
        public double Tutar { get; set; }
    }
}
