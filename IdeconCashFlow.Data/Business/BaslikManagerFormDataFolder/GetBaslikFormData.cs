using IdeconCashFlow.Data.POCO;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder
{
    public class GetBaslikFormData
    {
        public GetBaslikFormData()
        {
            Basliklar = new List<TekliBaslikTemp>();
        }

        [JsonProperty("totalPageCount")]
        public int SayfaSayisi { get; set; }

        [JsonProperty("pageCount")]
        public int BaslikSayisi { get; set; }

        [JsonProperty("headers")]
        public virtual List<TekliBaslikTemp> Basliklar { get; set; }

        [JsonProperty("totals")]
        public virtual List<ParaBirimiTutar> TotalParaBirimiTutar { get; set; }
    }
}
