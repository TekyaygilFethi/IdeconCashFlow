using IdeconCashFlow.Data.POCO;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder
{
    public class TekliBaslikTemp
    {
        [JsonProperty("flowDirectionSymbol")]
        public string FlowDirectionSymbol { get; set; }

        [JsonProperty("flowDirectionExplanation")]
        public string FlowDirectionExplanation { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("currencies")]
        public virtual List<ParaBirimiTutar> Currencies { get; set; }

        [JsonIgnore]
        public virtual List<Kalem> Kalemler { get; set; }
    }
}
