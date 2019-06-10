using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace IdeconCashFlow.Data.POCO
{
    public class BaslikBasePOCO
    {
        public BaslikBasePOCO()
        {
            Kalemler = new List<Kalem>();
        }

        [MaxLength(100000)]
        public string BaslikTanimi { get; set; }

        public bool IsVadeIliskili { get; set; }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string BaslikID { get; set; }
        
        public string SirketKodu { get; set; }

        public virtual List<Kalem> Kalemler { get; set; }
    }
}
