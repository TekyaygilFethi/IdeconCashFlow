using Newtonsoft.Json;
using System.Collections.Generic;

namespace IdeconCashFlow.Data.Business.CurrencyExchangeFormDataFolder
{
    public class CurrencyExchangeFormData
    {

        [JsonProperty("base")]
        public string Base { get; set; }

        [JsonProperty("date")]
        public string Date { get; set; }

        [JsonProperty("rates")]
        public List<Rate> Rates { get; set; }

    }


    public class Rate
    {
        public string Currency { get; set; }

        public int Value { get; set; }
    }
}
