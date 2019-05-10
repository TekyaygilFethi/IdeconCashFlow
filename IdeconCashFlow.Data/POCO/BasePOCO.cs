using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace IdeconCashFlow.Data.POCO
{
    public class BasePOCO
    {
        [Column("Düzenleme Tarihi")]
        public DateTime DuzenlemeTarihi { get; set; }

        [Column("Açıklama")]
        public string Aciklama { get; set; }

        [Column("Tanım")]
        public string Tanim { get; set; }

        [Column("Fiyat")]
        public int Fiyat { get; set; }
                
        [Column("Ek Alan 1")]
        public string EkAlan1 { get; set; }

        [Column("Ek Alan 2")]
        public string EkAlan2 { get; set; }

        [Column("Ek Alan 3")]
        public string EkAlan3 { get; set; }

        [Column("Ek Alan 4")]
        public string EkAlan4 { get; set; }

        [Column("Ek Alan 5")]
        public string EkAlan5 { get; set; }

        [ForeignKey("DuzenleyenUserID")]
        public virtual User Duzenleyen { get; set; }

        public int? DuzenleyenUserID { get; set; }

        public bool IsUserCreation { get; set; }
    }
}
