using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IdeconCashFlow.Data.POCO
{
    [Table("AnaBaslikTable")]
    public class AnaBaslik
    {
        public AnaBaslik()
        {
            Kalemler = new List<Kalem>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [ForeignKey("TekliBaslik")]
        public string ID { get; set; }

        [MaxLength(10000)]
        public string BaslikTanimi { get; set; }

        public bool IsVadeIliskili { get; set; }
        
        public string SirketKodu { get; set; }

        public virtual List<Kalem> Kalemler { get; set; }
                
        public virtual TekliBaslik TekliBaslik { get; set; }
        
    }
}
