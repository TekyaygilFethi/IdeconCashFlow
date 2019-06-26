using Newtonsoft.Json;
using System.Collections.Generic;

namespace IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder
{
    public class GetBaslikFormData
    {
        [JsonProperty("totalPageCount")]
        public int SayfaSayisi { get; set; }

        [JsonProperty("pageCount")]
        public int BaslikSayisi { get; set; }

        [JsonProperty("headers")]
        public virtual TempBaslikFilterFormData Basliklar { get; set; }

        [JsonProperty("totals")]
        public virtual List<ParaBirimiTutarTemp> TotalParaBirimiTutar { get; set; }
    }
}
