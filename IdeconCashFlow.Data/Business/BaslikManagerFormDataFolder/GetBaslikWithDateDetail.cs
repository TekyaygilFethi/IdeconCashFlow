using Newtonsoft.Json;
using System.Collections.Generic;

namespace IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder
{
    public class GetBaslikWithDateDetail
    {
        public GetBaslikWithDateDetail()
        {
            ChartModels = new List<GetBaslikWithDateChartModel>();
            Contents = new List<GetBaslikWithDateContents>();
        }
        public string AnaBaslikID { get; set; }

        public string AnaBaslikTanim { get; set; }

        [JsonProperty("chartModel")]
        public List<GetBaslikWithDateChartModel> ChartModels { get; set; }

        [JsonProperty("Contents")]
        public List<GetBaslikWithDateContents> Contents { get; set; }
    }
}
