using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IdeconCashFlow.Data.POCO
{
    [Table("ParaBirimiKalemTable")]
    public class ParaBirimiKalem
    {
        [Key,JsonIgnore,DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string ID { get; set; }

        [JsonIgnore, ForeignKey("KalemID")]
        public virtual Kalem Kalem { get; set; }
        
        public string KalemID { get; set; }

        [ForeignKey("ParaBirimiID"),JsonProperty("currency")]
        public virtual ParaBirimi ParaBirimi { get; set; }

        [JsonIgnore]
        public int ParaBirimiID { get; set; }

        [JsonProperty("value")]
        public double Tutar { get; set; }
    }
}
