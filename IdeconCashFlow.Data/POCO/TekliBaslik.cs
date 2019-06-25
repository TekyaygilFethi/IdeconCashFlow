using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IdeconCashFlow.Data.POCO
{
    [Table("TekliBaslikTable")]
    public class TekliBaslik
    {
        public TekliBaslik()
        {
            Currencies = new List<ParaBirimiTutar>();
            Kalemler = new List<Kalem>();
        }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [JsonProperty("id")]
        [ForeignKey("AnaBaslik")]
        public string ID { get; set; }

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

        [JsonIgnore]
        public virtual AnaBaslik AnaBaslik { get; set; }
    }
}
