using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder
{
    public class GetAnaBaslikFormData
    {
        [JsonProperty("value")]
        public string ID { get; set; }

        [JsonProperty("label")]
        public string Title { get; set; }
    }
}
