using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IdeconCashFlow.Data.POCO
{
    public class ParaBirimiKalem
    {
        [Key,ForeignKey("Kalem"),JsonIgnore]
        public string ID { get; set; }

        [JsonIgnore]
        public virtual Kalem Kalem { get; set; }

        [ForeignKey("ParaBirimiID"),JsonProperty("currency")]
        public virtual ParaBirimi ParaBirimi { get; set; }

        [JsonIgnore]
        public int ParaBirimiID { get; set; }

        [JsonProperty("value")]
        public double Tutar { get; set; }
    }
}
