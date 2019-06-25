using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IdeconCashFlow.Data.POCO
{
    [Table("KalemTable")]
    public class Kalem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string ID { get; set; }

        #region Tarihler
        public DateTime FaturaTarihi { get; set; }

        public DateTime VadeTarihi { get; set; }

        public DateTime? DuzenlemeTarihi { get; set; }

        public DateTime EklemeTarihi { get; set; }
        #endregion

        #region Ekleyen-Duzenleyen
        [ForeignKey("DuzenleyenUserID")]
        public virtual User Duzenleyen { get; set; }

        public int? DuzenleyenUserID { get; set; }

        [ForeignKey("EkleyenUserID"),JsonIgnore]
        public virtual User Ekleyen { get; set; }

        public int? EkleyenUserID { get; set; }
        #endregion

        public bool IsTahmin { get; set; }

        public string Aciklama { get; set; }

        #region Basliklar
        [ForeignKey("TekliBaslikID")]
        public virtual TekliBaslik TekliBaslik { get; set; }

        public string TekliBaslikID { get; set; }

        [ForeignKey("AnaBaslikID")]
        public virtual AnaBaslik AnaBaslik { get; set; }

        public string AnaBaslikID { get; set; }
        #endregion

        [ForeignKey("ParaBirimiKalemID")]
        public virtual ParaBirimiKalem ParaBirimiKalem { get; set; }

        public string ParaBirimiKalemID { get; set; }

        public bool IsUserCreation { get; set; }

        #region Kalem Tipi İndikatörler
        public string KalemTipiAciklama { get; set; }

        public string KalemTipiSymbol { get; set; }
        #endregion

        public double Tutar { get; set; }

        #region Ek Alanlar
        public string EkAlan1 { get; set; }

        public string EkAlan2 { get; set; }

        public string EkAlan3 { get; set; }

        public string EkAlan4 { get; set; }

        public string EkAlan5 { get; set; }
        #endregion
    }
}
