using System;

namespace IdeconCashFlow.Data.Business.KalemManagerFormDataFolder
{
    public class AddKalemFormData
    {
        public DateTime FaturaTarihi { get; set; }

        public DateTime VadeTarihi { get; set; }

        public bool IsTahmin { get; set; }

        public int EkleyenUserID { get; set; }

        public string AnaBaslikID { get; set; }

        public string Aciklama { get; set; }

        public string ParaBirimi { get; set; }

        public double Tutar { get; set; }

        public string KalemTipiAciklama { get; set; }

        public string BaslikTanimi { get; set; }

        public bool IsVadeIliskili { get; set; }

        //public string BaslikID { get; set; }

        public string SirketKodu { get; set; }

        #region Ek Alanlar
        public string EkAlan1 { get; set; }

        public string EkAlan2 { get; set; }

        public string EkAlan3 { get; set; }

        public string EkAlan4 { get; set; }

        public string EkAlan5 { get; set; }

        #endregion
    }
}
