using IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder;
using IdeconCashFlow.Data.POCO;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace IdeconCashFlow.Business.DummyFolder
{
    public class DummyData
    {
        public static List<AnaBaslik> anaBasliklar = new List<AnaBaslik>();
        public static List<User> users = new List<User>();
        public static List<Kalem> kalemler = new List<Kalem>();
        public static List<ParaBirimi> paraBirimleri = new List<ParaBirimi>();
        public static List<TekliBaslik> tekliBasliklar = new List<TekliBaslik>();


        public void CreateData()
        {
            anaBasliklar.Clear();
            users.Clear();
            kalemler.Clear();
            paraBirimleri.Clear();
            tekliBasliklar.Clear();
            try
            {
                paraBirimleri = GetParaBirimleri();
            }
            catch (Exception ex)
            {

            }
            //    paraBirimleri.AddRange(new List<ParaBirimi>() {
            //        new ParaBirimi(){ID=1,Kur="EUR" },
            //        new ParaBirimi(){ID=2,Kur="TRY" },
            //        new ParaBirimi(){ID=3,Kur="USD" },
            //        new ParaBirimi(){ID=4,Kur="CAD" },
            //        new ParaBirimi(){ID=5,Kur="JPY" }
            //});
            #region Ana Baslik DUMMY CREATE
            AnaBaslik ab1 = new AnaBaslik();
            ab1.ID = FakeData.TextData.GetAlphabetical(10);
            ab1.BaslikTanimi = "Banka Bakiyeleri";
            ab1.IsVadeIliskili = false;
            ab1.SirketKodu = "2000";


            AnaBaslik ab2 = new AnaBaslik();
            ab2.ID = FakeData.TextData.GetAlphabetical(10);
            ab2.BaslikTanimi = "Çek Ödemeleri";
            ab2.IsVadeIliskili = false;
            ab2.SirketKodu = "2000";

            AnaBaslik ab3 = new AnaBaslik();
            ab3.ID = FakeData.TextData.GetAlphabetical(10);
            ab3.BaslikTanimi = "Havale Ödemeleri";
            ab3.IsVadeIliskili = false;
            ab3.SirketKodu = "2000";

            AnaBaslik ab4 = new AnaBaslik();
            ab4.ID = FakeData.TextData.GetAlphabetical(10);
            ab4.BaslikTanimi = "Komisyon Faizleri";
            ab4.IsVadeIliskili = false;
            ab4.SirketKodu = "1000";

            AnaBaslik ab5 = new AnaBaslik();
            ab5.ID = FakeData.TextData.GetAlphabetical(10); ;
            ab5.BaslikTanimi = "Müşteri Tahsilatı";
            ab5.IsVadeIliskili = false;
            ab5.SirketKodu = "3000";

            AnaBaslik ab6 = new AnaBaslik();
            ab6.ID = FakeData.TextData.GetAlphabetical(10);
            ab6.BaslikTanimi = "Masraf Tahsilatı";
            ab6.IsVadeIliskili = false;
            ab6.SirketKodu = "3000";


            List<AnaBaslik> anaBaslikList = new List<AnaBaslik>();
            for (int i = 0; i < 180; i++)
            {
                AnaBaslik ab7 = new AnaBaslik();
                ab7.ID = FakeData.TextData.GetAlphabetical(10);
                ab7.BaslikTanimi = FakeData.NameData.GetCompanyName();
                ab7.IsVadeIliskili = false;
                ab7.SirketKodu = "3000";

                anaBaslikList.Add(ab7);
            }

            anaBaslikList.Add(ab1);
            anaBaslikList.Add(ab2);
            anaBaslikList.Add(ab3);
            anaBaslikList.Add(ab4);
            anaBaslikList.Add(ab4);
            anaBaslikList.Add(ab5);
            anaBaslikList.Add(ab6);

            #endregion

            #region User DUMMY
            User user = new User();
            user.ID = 1;
            user.Name = "Fethi";
            user.Surname = "Tekyaygil";
            user.Username = "FethiTekyaygil";
            user.Yetki = "Admin";

            User user2 = new User();
            user2.ID = 2;
            user2.Name = "Emre";
            user2.Surname = "Simsek";
            user2.Username = "EmreSimsek";
            user2.Yetki = "Admin";

            #endregion

            #region Kalem
            List<string> altBasliklar = new List<string>() { "Ziraat Bankası", "Akbank", "Halk Bankası", "KuveytTürk", "İş Bankası", "Garanti", "QNB Finansbank" };
            List<string> tipSymbol = new List<string>() { "+", "-" };
            List<string> tipAciklama = new List<string>() { "Gelir", "Gider" };


            for (int i = 0; i < 100; i++)
            {
                AnaBaslik anaBaslik = anaBaslikList[FakeData.NumberData.GetNumber(anaBaslikList.Count - 1)];
                Kalem k1 = new Kalem();
                //k1.KalemID = i + 1;
                k1.Aciklama = altBasliklar[FakeData.NumberData.GetNumber(altBasliklar.Count - 1)];
                k1.AnaBaslik = anaBaslik;
                k1.AnaBaslikID = anaBaslik.ID;
                anaBaslik.Kalemler.Add(k1);
                k1.Ekleyen = user;
                k1.EkleyenUserID = user.ID;
                user.EklenenKalemler.Add(k1);
                k1.DuzenlemeTarihi = DateTime.Now;
                k1.Tutar = FakeData.NumberData.GetNumber(1000);
                k1.VadeTarihi = DateTime.Now;
                k1.IsTahmin = false;
                k1.KalemTipiAciklama = tipAciklama[FakeData.NumberData.GetNumber(0, 2)];
                k1.KalemTipiSymbol = tipSymbol[tipAciklama.IndexOf(k1.KalemTipiAciklama)];
                k1.IsUserCreation = true;
                k1.EkAlan1 = FakeData.TextData.GetSentences(FakeData.NumberData.GetNumber(10));

                ParaBirimi pb = paraBirimleri.ToList()[FakeData.NumberData.GetNumber(paraBirimleri.Count)];
                ParaBirimiKalem pbk = new ParaBirimiKalem()
                {
                    Kalem = k1,
                    ParaBirimi = pb,
                    //Tutar= 
            };
                pb.ParaBirimiKalemler.Add(pbk);
                k1.ParaBirimiKalem = pbk;

                kalemler.Add(k1);
            }

            #endregion

            #region Başlık
            //for (int i = 0; i < kalemler.Count; i++)
            //{
            //    TekliBaslik tekliBaslik = new TekliBaslik();

            //    tekliBaslik = tekliBasliklar.SingleOrDefault(s => s.ID == kalemler[i].TekliBaslikID);
            //    if (tekliBaslik == null)
            //    {
            //        tekliBaslik = new TekliBaslik();
            //        tekliBaslik.FlowDirectionExplanation = kalemler[i].KalemTipiAciklama;
            //        tekliBaslik.FlowDirectionSymbol = kalemler[i].KalemTipiAciklama == "Gelir" ? "+" : "-";

            //        tekliBaslik.Title = kalemler[i].Aciklama;
            //        tekliBaslik.ID = FakeData.TextData.GetAlphabetical(15);


            //        tekliBaslik.AnaBaslik = kalemler[i].AnaBaslik;
            //        tekliBaslik.AnaBaslikID = kalemler[i].AnaBaslikID;


            //        kalemler[i].AnaBaslik.TekliBaslik = tekliBaslik;
            //        kalemler[i].AnaBaslik.TekliBaslikID = tekliBaslik.ID;
            //    }

            //    tekliBaslik.Kalemler.Add(kalemler[i]);
            //    kalemler[i].TekliBaslik = tekliBaslik;


            #region Para Birimi Tutar Ops

            //ParaBirimiTutar pbt = tekliBaslik.Currencies.SingleOrDefault(w => w.ParaBirimi == kalemFormData.ParaBirimi);
            //if (pbt == null)
            //{
            //    pbt = new ParaBirimiTutar();

            //    pbt.Baslik = tekliBaslik;
            //    tekliBaslik.Currencies.Add(pbt);

            //    pbt.ParaBirimi = kalemFormData.ParaBirimi;
            //    pbt.Tutar = kalemFormData.Tutar;

            //    paraBirimiTutarManager.Add(pbt);

            //}
            //else
            //    pbt.Tutar += kalemFormData.Tutar;


            #endregion
            #endregion
        }
        
        public List<Kalem> GetKalems()
        {
            return kalemler;
        }

        public List<string> GetParaBirimiKurlari()
        {
            return paraBirimleri.Select(S => S.Kur).ToList();
        }

        public List<ParaBirimi> GetParaBirimleri()
        {
            paraBirimleri.Clear();
            using (StreamReader r = new StreamReader(@"..\IdeconCashFlow.Data\Dummy\currencyJSON.json"))
            {
                string json = r.ReadToEnd();
                List<ParaBirimi> pbListe = JsonConvert.DeserializeObject<List<ParaBirimi>>(json);
                for (int i = 0; i < pbListe.Count; i++)
                {
                    pbListe[i].ID = i + 1;
                }

                return pbListe;
            }
        }
    }
}
