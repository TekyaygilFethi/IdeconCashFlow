using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IdeconCashFlow.Data.POCO
{
    public class AnaBaslik
    {
        public AnaBaslik()
        {
            Kalemler = new List<Kalem>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string ID { get; set; }

        [MaxLength(100000)]
        public string BaslikTanimi { get; set; }

        public bool IsVadeIliskili { get; set; }
        
        public string SirketKodu { get; set; }

        public virtual List<Kalem> Kalemler { get; set; }

        [ForeignKey("TekliBaslikID")]
        public virtual TekliBaslik TekliBaslik { get; set; }

        public string TekliBaslikID { get; set; }
    }
}
