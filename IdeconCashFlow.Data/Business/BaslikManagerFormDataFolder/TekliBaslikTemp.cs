using IdeconCashFlow.Data.POCO;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder
{
    public class TekliBaslikTemp
    {
        public TekliBaslikTemp()
        {
            Currencies = new List<ParaBirimiTutarTemp>();
        }
        [JsonProperty("id")]
        public string ID { get; set; }

        [JsonProperty("flowDirectionSymbol")]
        public string FlowDirectionSymbol { get; set; }

        [JsonProperty("flowDirectionExplanation")]
        public string FlowDirectionExplanation { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("currencies")]
        public virtual List<ParaBirimiTutarTemp> Currencies { get; set; }

        //[JsonIgnore]
        //public virtual List<Kalem> Kalemler { get; set; }
    }
}
