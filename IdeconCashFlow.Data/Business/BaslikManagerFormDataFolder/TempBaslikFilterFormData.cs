using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder
{
    public class TempBaslikFilterFormData
    {
        public TempBaslikFilterFormData()
        {
            GelirBasliklar = new List<TekliBaslikTemp>();
            GiderBasliklar = new List<TekliBaslikTemp>();
        }


        [JsonProperty("income")]
        public virtual List<TekliBaslikTemp> GelirBasliklar { get; set; }

        [JsonProperty("outcome")]
        public virtual List<TekliBaslikTemp> GiderBasliklar { get; set; }
    }
}
