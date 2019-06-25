using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder
{
    public class ParaBirimiTutarTemp
    {
        [JsonProperty("key")]
        public string ParaBirimi { get; set; }

        [JsonProperty("value")]
        public double Tutar { get; set; }
    }
}
