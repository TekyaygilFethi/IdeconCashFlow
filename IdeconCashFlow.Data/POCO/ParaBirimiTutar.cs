using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IdeconCashFlow.Data.POCO
{
    [Table("ParaBirimiTutarTable")]
    public class ParaBirimiTutar
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity), JsonIgnore]
        public int ID { get; set; }

        [JsonProperty("currency"),ForeignKey("ParaBirimiID")]
        public virtual ParaBirimi ParaBirimi { get; set; }

        public int ParaBirimiID { get; set; }

        [JsonProperty("value")]
        public double Tutar { get; set; }

        [ForeignKey("TekliBaslikID"),JsonIgnore]
        public virtual TekliBaslik TekliBaslik { get; set; }

        [JsonIgnore]
        public string TekliBaslikID { get; set; }
    }
}
