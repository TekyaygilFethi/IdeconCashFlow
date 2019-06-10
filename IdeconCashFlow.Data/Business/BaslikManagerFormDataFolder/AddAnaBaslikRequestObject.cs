using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder
{
    public class AddAnaBaslikRequestObject
    {
        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("isVadeIliskili")]
        public bool IsVadeIliskili { get; set; }
    }
}
