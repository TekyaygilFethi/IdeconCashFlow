using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder
{
    public class GetBaslikWithDateContents
    {
        public GetBaslikWithDateContents()
        {
            CurrencyDates = new List<GetBaslikWithDateCurrencyDate>();
        }

        [JsonProperty("ParaBirimi")]
        public string ParaBirimi { get; set; }

        [JsonProperty("CurrencyDates")]
        public List<GetBaslikWithDateCurrencyDate> CurrencyDates { get; set; }

    }
}
