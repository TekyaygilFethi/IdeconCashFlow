using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IdeconCashFlow.Data.POCO
{
    public class ParaBirimi
    {
        public ParaBirimi()
        {
            ParaBirimiKalemler = new List<ParaBirimiKalem>();
            ParaBirimiTutarlar = new List<ParaBirimiTutar>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonIgnore]
        public int ID { get; set; }

        
        [JsonProperty("name")]
        public string Kur { get; set; }

        [JsonProperty("symbol")]
        public string Symbol { get; set; }
        
        [JsonProperty("symbol_native")]
        public string SymbolNative { get; set; }

        [JsonProperty("decimal_digits")]
        public int DecimalDigits { get; set; }

        [JsonProperty("rounding")]
        public double Rounding { get; set; }

        [JsonProperty("code")]

        public string Code { get; set; }

        [JsonProperty("name_plural")]
        public string NamePlural { get; set; }

        [JsonIgnore]
        public virtual List<ParaBirimiKalem> ParaBirimiKalemler { get; set; }  
        
        [JsonIgnore]
        public virtual List<ParaBirimiTutar> ParaBirimiTutarlar { get; set; }
    }
}
