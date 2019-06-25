using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder
{
    public class GetBaslikWithDateChartModel
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("trueValue")]
        public double TrueValue { get; set; }

        [JsonProperty("value")]
        public double Value { get; set; }
    }
}
