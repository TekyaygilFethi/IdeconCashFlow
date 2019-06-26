using Newtonsoft.Json;
using System;

namespace IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder
{
    public class GetBaslikWithDateCurrencyDate
    {
        [JsonIgnore]
        public string ParaBirimi { get; set; }

        [JsonIgnore]
        public string AnaBaslikID { get; set; }

        [JsonProperty("vadeTarihi")]
        public DateTime VadeTarihi { get; set; }

        [JsonProperty("Tutar")]
        public double Tutar { get; set; }

        [JsonIgnore]
        public DateTime DateIndicator { get; set; }
    }
}
