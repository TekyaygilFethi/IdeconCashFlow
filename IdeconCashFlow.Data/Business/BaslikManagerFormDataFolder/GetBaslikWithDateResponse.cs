using Newtonsoft.Json;
using System.Collections.Generic;

namespace IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder
{
    public class GetBaslikWithDateResponse
    {
        public GetBaslikWithDateResponse()
        {
            Details = new List<GetBaslikWithDateDetail>();
            Totals = new List<GetBaslikWithDateTotals>();
            //Contents = new List<GetBaslikWithDateContents>();
        }

        [JsonProperty("Totals")]
        public List<GetBaslikWithDateTotals> Totals { get; set; }

        [JsonProperty("getDetail")]
        public List<GetBaslikWithDateDetail> Details { get; set; }

        //[JsonProperty("Contents")]
        //public List<GetBaslikWithDateContents> Contents { get; set; }
    }
}
