using IdeconCashFlow.Data.POCO;
using IdeconCashFlow.Helper.Cryptography;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace IdeconCashFlow.DummyInsert
{
    class Program
    {
        public static List<AnaBaslik> anaBasliklar = new List<AnaBaslik>();
        public static List<User> users = new List<User>();
        public static List<Kalem> kalemler = new List<Kalem>();
        public static List<ParaBirimi> paraBirimleri = new List<ParaBirimi>();
        public static List<TekliBaslik> tekliBasliklar = new List<TekliBaslik>();

        static void Main(string[] args)
        {
            CreateParaBirimleri();
            CreateData();
            //GetData();
            Console.WriteLine("Done...");
            Console.ReadLine();
        }

        static void CreateDummy()
        {
            using (IdeconCashFlow.Database.ContextFolder.IdeconCashflowMySqlDbContext context = new Database.ContextFolder.IdeconCashflowMySqlDbContext())
            {
                #region Ana Baslik DUMMY
                AnaBaslik ab1 = new AnaBaslik();
                ab1.ID = FakeData.TextData.GetAlphabetical(10);
                ab1.BaslikTanimi = "Banka Bakiyeleri";
                ab1.IsVadeIliskili = false;
                ab1.SirketKodu = "2000";


                AnaBaslik ab2 = new AnaBaslik();
                ab2.ID = FakeData.TextData.GetAlphabetical(10);
                ab2.BaslikTanimi = "Banka Bakiyeleri";
                ab2.IsVadeIliskili = false;
                ab2.SirketKodu = "2000";

                AnaBaslik ab3 = new AnaBaslik();
                ab3.ID = FakeData.TextData.GetAlphabetical(10);
                ab3.BaslikTanimi = "Banka Bakiyeleri";
                ab3.IsVadeIliskili = false;
                ab3.SirketKodu = "2000";

                AnaBaslik ab4 = new AnaBaslik();
                ab4.ID = FakeData.TextData.GetAlphabetical(10);
                ab4.BaslikTanimi = "Banka Bakiyeleri";
                ab4.IsVadeIliskili = false;
                ab4.SirketKodu = "1000";

                AnaBaslik ab5 = new AnaBaslik();
                ab5.BaslikTanimi = "Müşteri Tahsilatı";
                ab5.IsVadeIliskili = false;
                ab5.SirketKodu = "3000";

                AnaBaslik ab6 = new AnaBaslik();
                ab6.ID = FakeData.TextData.GetAlphabetical(10);
                ab6.BaslikTanimi = "Müşteri Tahsilatı";
                ab6.IsVadeIliskili = false;
                ab6.SirketKodu = "3000";

                List<AnaBaslik> anaBaslikList = new List<AnaBaslik>();

                anaBaslikList.Add(ab1);
                anaBaslikList.Add(ab2);
                anaBaslikList.Add(ab3);
                anaBaslikList.Add(ab4);
                anaBaslikList.Add(ab4);
                anaBaslikList.Add(ab5);
                anaBaslikList.Add(ab6);


                context.AnaBasliklar.AddRange(anaBaslikList);
                #endregion

                #region User DUMMY
                User user = new User();
                user.Name = "Fethi";
                user.Surname = "Tekyaygil";
                user.Username = "FethiTekyaygil";
                user.Password = Cryptography_Algorithms.Calculate_SHA256("123456", user.Username + "123456");
                user.SirketKodu = "1000";
                user.Yetki = "Admin";

                User user2 = new User();
                user2.Name = "Emre";
                user2.Surname = "Simsek";
                user2.Username = "EmreSimsek";
                user2.SirketKodu = "3000";
                user2.Password = Cryptography_Algorithms.Calculate_SHA256("123456", user.Username + "123456");
                user2.Yetki = "Admin";

                context.Users.Add(user);
                context.Users.Add(user2);
                #endregion

                #region Kalem
                List<string> altBasliklar = new List<string>() { "Ziraat Bankası", "Akbank", "Halk Bankası", "KuveytTürk", "İş Bankası", "Garanti", "QNB Finansbank" };
                List<string> tip = new List<string>() { "Gelir", "Gider" };


                for (int i = 0; i < 10; i++)
                {
                    AnaBaslik anaBaslik = anaBaslikList[FakeData.NumberData.GetNumber(anaBaslikList.Count - 1)];
                    Kalem k1 = new Kalem();
                    k1.Aciklama = altBasliklar[FakeData.NumberData.GetNumber(altBasliklar.Count - 1)];
                    k1.AnaBaslik = anaBaslik;
                    anaBaslik.Kalemler.Add(k1);
                    k1.Ekleyen = user;
                    user.EklenenKalemler.Add(k1);
                    k1.DuzenlemeTarihi = DateTime.Now;
                    k1.Tutar = FakeData.NumberData.GetNumber(1000);
                    k1.VadeTarihi = DateTime.Now;
                    k1.IsTahmin = false;
                    k1.KalemTipiAciklama = tip[FakeData.NumberData.GetNumber(0, 1)];
                    k1.IsUserCreation = true;
                    k1.EkAlan1 = "Açıklama";

                    ParaBirimi pb = context.ParaBirimleri.ToList()[FakeData.NumberData.GetNumber(context.ParaBirimleri.Count())];
                    ParaBirimiKalem pbk = new ParaBirimiKalem()
                    {
                        Kalem = k1,
                        ParaBirimi = pb
                    };
                    pb.ParaBirimiKalemler.Add(pbk);
                    k1.ParaBirimiKalem = pbk;

                    context.Kalemler.Add(k1);
                    context.ParaBirimiKalemler.Add(pbk);
                }
                #endregion

                context.SaveChanges();
                Console.WriteLine("Dummy data oluşturuldu!");
                Console.ReadLine();
            }
        }

        static void CreateParaBirimleri()
        {
            using (IdeconCashFlow.Database.ContextFolder.IdeconCashflowMySqlDbContext context = new Database.ContextFolder.IdeconCashflowMySqlDbContext())
            {
                using (StreamReader r = new StreamReader(@"..\..\..\..\IdeconCashFlow.Data\Dummy\currencyJSON.json"))
                {
                    string json = r.ReadToEnd();
                    List<ParaBirimi> pbListe = JsonConvert.DeserializeObject<List<ParaBirimi>>(json);
                    //for (int i = 0; i < pbListe.Count; i++)
                    //{
                    //    pbListe[i].ID = i + 1;
                    //}
                    context.AddRange(pbListe);
                    context.SaveChanges();

                }

            }
        }

        static void CreateData()
        {
            using (IdeconCashFlow.Database.ContextFolder.IdeconCashflowMySqlDbContext context = new Database.ContextFolder.IdeconCashflowMySqlDbContext())
            {
                anaBasliklar.Clear();
                users.Clear();
                kalemler.Clear();
                paraBirimleri.Clear();
                tekliBasliklar.Clear();

                paraBirimleri = context.ParaBirimleri.ToList();

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
                //for (int i = 0; i < 180; i++)
                //{
                //    AnaBaslik ab7 = new AnaBaslik();
                //    ab7.ID = FakeData.TextData.GetAlphabetical(10);
                //    ab7.BaslikTanimi = FakeData.NameData.GetCompanyName();
                //    ab7.IsVadeIliskili = false;
                //    ab7.SirketKodu = "3000";

                //    anaBaslikList.Add(ab7);
                //}

                anaBaslikList.Add(ab1);
                anaBaslikList.Add(ab2);
                anaBaslikList.Add(ab3);
                //anaBaslikList.Add(ab4);
                anaBaslikList.Add(ab4);
                anaBaslikList.Add(ab5);
                anaBaslikList.Add(ab6);


                context.AddRange(anaBaslikList);
                #endregion

                #region User DUMMY
                User user = new User();
                user.Password = user.Password = Cryptography_Algorithms.Calculate_SHA256("123456", user.Username + "123456");
                user.Name = "Fethi";
                user.Surname = "Tekyaygil";
                user.Username = "FethiTekyaygil";
                user.Yetki = "Admin";

                User user2 = new User();
                user2.Password = user.Password = Cryptography_Algorithms.Calculate_SHA256("123456", user.Username + "123456");
                user2.Name = "Emre";
                user2.Surname = "Simsek";
                user2.Username = "EmreSimsek";
                user2.Yetki = "Admin";

                users.Add(user);
                users.Add(user2);

                context.Users.Add(user);
                context.Users.Add(user2);
                #endregion

                #region Kalem
                List<string> altBasliklar = new List<string>() { "Ziraat Bankası", "Akbank", "Halk Bankası", "KuveytTürk", "İş Bankası", "Garanti", "QNB Finansbank" };
                List<string> tipSymbol = new List<string>() { "+", "-" };
                List<string> tipAciklama = new List<string>() { "Gelir", "Gider" };


                for (int i = 0; i < 50; i++)
                {
                    User u = users[FakeData.NumberData.GetNumber(0, 2)];

                    AnaBaslik anaBaslik = anaBaslikList[FakeData.NumberData.GetNumber(anaBaslikList.Count)];
                    Kalem k1 = new Kalem();
                    k1.ID = FakeData.TextData.GetAlphaNumeric(30);
                    k1.Aciklama = altBasliklar[FakeData.NumberData.GetNumber(altBasliklar.Count - 1)];
                    k1.AnaBaslik = anaBaslik;
                    anaBaslik.Kalemler.Add(k1);
                    k1.Ekleyen = u;
                    u.EklenenKalemler.Add(k1);
                    k1.DuzenlemeTarihi = DateTime.Now;
                    k1.EklemeTarihi = DateTime.Now;
                    k1.Tutar = FakeData.NumberData.GetNumber(1000);
                    k1.VadeTarihi = DateTime.Now.AddDays(FakeData.NumberData.GetNumber(0,105));
                    k1.IsTahmin = false;
                    k1.KalemTipiAciklama = tipAciklama[FakeData.NumberData.GetNumber(0, 2)];
                    k1.KalemTipiSymbol = tipSymbol[tipAciklama.IndexOf(k1.KalemTipiAciklama)];
                    k1.IsUserCreation = true;
                    k1.EkAlan1 = FakeData.TextData.GetSentences(FakeData.NumberData.GetNumber(10));


                    ParaBirimi pb = paraBirimleri.ToList()[FakeData.NumberData.GetNumber(15)];
                    ParaBirimiKalem pbk = new ParaBirimiKalem()
                    {
                        KalemID = k1.ID,
                        ParaBirimi = pb,
                        Tutar = k1.Tutar
                    };
                    pb.ParaBirimiKalemler.Add(pbk);
                    k1.ParaBirimiKalem = pbk;

                    context.ParaBirimiKalemler.Add(pbk);
                    context.Kalemler.Add(k1);
                    kalemler.Add(k1);

                }
                #endregion

                #region Başlık
                for (int i = 0; i < kalemler.Count; i++)
                {
                    TekliBaslik tekliBaslik = new TekliBaslik();

                    tekliBaslik = tekliBasliklar.SingleOrDefault(s => s.ID == kalemler[i].AnaBaslikID);
                    if (tekliBaslik == null)
                    {
                        tekliBaslik = new TekliBaslik();
                        tekliBaslik.FlowDirectionExplanation = kalemler[i].KalemTipiAciklama;
                        tekliBaslik.FlowDirectionSymbol = kalemler[i].KalemTipiAciklama == "Gelir" ? "+" : "-";

                        tekliBaslik.Title = kalemler[i].Aciklama;

                        tekliBaslik.AnaBaslik = kalemler[i].AnaBaslik;
                        tekliBaslik.ID = kalemler[i].AnaBaslikID;

                        kalemler[i].AnaBaslik.TekliBaslik = tekliBaslik;
                        kalemler[i].AnaBaslik.ID = tekliBaslik.ID;
                        tekliBaslik.Kalemler.Add(kalemler[i]);
                        kalemler[i].TekliBaslik = tekliBaslik;

                        context.TekliBasliklar.Add(tekliBaslik);

                        tekliBasliklar.Add(tekliBaslik);
                    }
                    else
                    {
                        tekliBaslik.Kalemler.Add(kalemler[i]);
                        kalemler[i].TekliBaslik = tekliBaslik;
                        //tekliBasliklar.Add(tekliBaslik);
                    }




                    #region Para Birimi Tutar Ops

                    ParaBirimiTutar pbt = tekliBaslik.Currencies.SingleOrDefault(w => w.ParaBirimi.Kur == kalemler[i].ParaBirimiKalem.ParaBirimi.Kur);
                    if (pbt == null)
                    {
                        pbt = new ParaBirimiTutar();

                        pbt.TekliBaslik = tekliBaslik;
                        tekliBaslik.Currencies.Add(pbt);

                        pbt.ParaBirimi = kalemler[i].ParaBirimiKalem.ParaBirimi;
                        pbt.Tutar = kalemler[i].Tutar;

                        context.ParaBirimiTutarlar.Add(pbt);

                    }
                    else
                        pbt.Tutar += kalemler[i].Tutar;


                    #endregion
                }
                #endregion

                context.SaveChanges();
            }
        }

        #region Dapper
        static void GetData()
        {
            using (IdeconCashFlow.Database.ContextFolder.IdeconCashflowMySqlDbContext context = new Database.ContextFolder.IdeconCashflowMySqlDbContext())
            {
                //var list2 = context.Kalemler.Select(s => s.ParaBirimiKalem.ParaBirimi.Kur).Distinct().ToList();
                //var a = context.TekliBasliklar.GroupBy(g => g.Currencies);
                var list3 = context.TekliBasliklar.FirstOrDefault().Currencies.GroupBy(g => g.ParaBirimi);
            }
            //DapperRepository<User> userRepo = new DapperRepository<User>();
            //var list=userRepo.Query();

            ////DapperRepository<AnaBaslik> repo = new DapperRepository<AnaBaslik>();

            ////var list = repo.All();

            //foreach (var user in list)
            //{
            //    Console.WriteLine(user.ID + " - " + user.Name + " " + user.Surname);
            //}
        }

        //static void CreateDummyDapper()
        //{
        //    using (IdeconCashFlow.Database.ContextFolder.IdeconCashflowMySqlDbContext context = new Database.ContextFolder.IdeconCashflowMySqlDbContext())
        //    {
        //        #region Ana Baslik DUMMY
        //        AnaBaslik ab1 = new AnaBaslik();
        //        ab1.ID = FakeData.TextData.GetAlphabetical(10);
        //        ab1.BaslikTanimi = "Banka Bakiyeleri";
        //        ab1.IsVadeIliskili = false;
        //        ab1.SirketKodu = "2000";


        //        AnaBaslik ab2 = new AnaBaslik();
        //        ab2.ID = FakeData.TextData.GetAlphabetical(10);
        //        ab2.BaslikTanimi = "Banka Bakiyeleri";
        //        ab2.IsVadeIliskili = false;
        //        ab2.SirketKodu = "2000";

        //        AnaBaslik ab3 = new AnaBaslik();
        //        ab3.ID = FakeData.TextData.GetAlphabetical(10);
        //        ab3.BaslikTanimi = "Banka Bakiyeleri";
        //        ab3.IsVadeIliskili = false;
        //        ab3.SirketKodu = "2000";

        //        AnaBaslik ab4 = new AnaBaslik();
        //        ab4.ID = FakeData.TextData.GetAlphabetical(10);
        //        ab4.BaslikTanimi = "Banka Bakiyeleri";
        //        ab4.IsVadeIliskili = false;
        //        ab4.SirketKodu = "1000";

        //        AnaBaslik ab5 = new AnaBaslik();
        //        ab5.BaslikTanimi = "Müşteri Tahsilatı";
        //        ab5.IsVadeIliskili = false;
        //        ab5.SirketKodu = "3000";

        //        AnaBaslik ab6 = new AnaBaslik();
        //        ab6.ID = FakeData.TextData.GetAlphabetical(10);
        //        ab6.BaslikTanimi = "Müşteri Tahsilatı";
        //        ab6.IsVadeIliskili = false;
        //        ab6.SirketKodu = "3000";

        //        List<AnaBaslik> anaBaslikList = new List<AnaBaslik>();

        //        anaBaslikList.Add(ab1);
        //        anaBaslikList.Add(ab2);
        //        anaBaslikList.Add(ab3);
        //        anaBaslikList.Add(ab4);
        //        anaBaslikList.Add(ab4);
        //        anaBaslikList.Add(ab5);
        //        anaBaslikList.Add(ab6);


        //        context.AnaBasliklar.AddRange(anaBaslikList);
        //        #endregion

        //        #region User DUMMY
        //        User user = new User();
        //        user.Name = "Fethi";
        //        user.Surname = "Tekyaygil";
        //        user.Username = "FethiTekyaygil";
        //        user.SirketKodu = "1000";
        //        user.Yetki = "Admin";

        //        User user2 = new User();
        //        user2.Name = "Emre";
        //        user2.Surname = "Simsek";
        //        user2.Username = "EmreSimsek";
        //        user2.SirketKodu = "3000";
        //        user2.Yetki = "Admin";

        //        context.Users.Add(user);
        //        context.Users.Add(user2);
        //        #endregion

        //        #region Kalem
        //        List<string> altBasliklar = new List<string>() { "Ziraat Bankası", "Akbank", "Halk Bankası", "KuveytTürk", "İş Bankası", "Garanti", "QNB Finansbank" };
        //        List<string> tip = new List<string>() { "Gelir", "Gider" };


        //        for (int i = 0; i < 10; i++)
        //        {
        //            AnaBaslik anaBaslik = anaBaslikList[FakeData.NumberData.GetNumber(anaBaslikList.Count - 1)];
        //            Kalem k1 = new Kalem();
        //            k1.Aciklama = altBasliklar[FakeData.NumberData.GetNumber(altBasliklar.Count - 1)];
        //            k1.EkleyenUserID = user.ID;
        //            k1.DuzenlemeTarihi = DateTime.Now;
        //            k1.Tutar = FakeData.NumberData.GetNumber(1000);
        //            k1.VadeTarihi = DateTime.Now;
        //            k1.IsTahmin = false;
        //            k1.KalemTipiAciklama = tip[FakeData.NumberData.GetNumber(0, 1)];
        //            k1.IsUserCreation = true;
        //            k1.EkAlan1 = "Açıklama";

        //            ParaBirimi pb = context.ParaBirimleri.ToList()[FakeData.NumberData.GetNumber(context.ParaBirimleri.Count())];
        //            ParaBirimiKalem pbk = new ParaBirimiKalem()
        //            {
        //                ID = k1,
        //                ParaBirimi = pb
        //            };
        //            pb.ParaBirimiKalemler.Add(pbk);
        //            k1.ParaBirimiKalem = pbk;

        //            context.Kalemler.Add(k1);
        //            context.ParaBirimiKalemler.Add(pbk);
        //        }
        //        #endregion

        //        context.SaveChanges();
        //        Console.WriteLine("Dummy data oluşturuldu!");
        //        Console.ReadLine();
        //    }
        //}

        //static void CreateParaBirimleriDapper()
        //{
        //    using (IdeconCashFlow.Database.ContextFolder.IdeconCashflowMySqlDbContext context = new Database.ContextFolder.IdeconCashflowMySqlDbContext())
        //    {
        //        using (StreamReader r = new StreamReader(@"..\..\..\..\IdeconCashFlow.Data\Dummy\currencyJSON.json"))
        //        {
        //            string json = r.ReadToEnd();
        //            List<ParaBirimi> pbListe = JsonConvert.DeserializeObject<List<ParaBirimi>>(json);
        //            //for (int i = 0; i < pbListe.Count; i++)
        //            //{
        //            //    pbListe[i].ID = i + 1;
        //            //}
        //            context.AddRange(pbListe);
        //            context.SaveChanges();

        //        }

        //    }
        //}

        //static void CreateDataDapper()
        //{
        //    using (IdeconCashFlow.Database.ContextFolder.IdeconCashflowMySqlDbContext context = new Database.ContextFolder.IdeconCashflowMySqlDbContext())
        //    {
        //        anaBasliklar.Clear();
        //        users.Clear();
        //        kalemler.Clear();
        //        paraBirimleri.Clear();
        //        tekliBasliklar.Clear();

        //        paraBirimleri = context.ParaBirimleri.ToList();

        //        #region Ana Baslik DUMMY CREATE
        //        AnaBaslik ab1 = new AnaBaslik();
        //        ab1.ID = FakeData.TextData.GetAlphabetical(10);
        //        ab1.BaslikTanimi = "Banka Bakiyeleri";
        //        ab1.IsVadeIliskili = false;
        //        ab1.SirketKodu = "2000";


        //        AnaBaslik ab2 = new AnaBaslik();
        //        ab2.ID = FakeData.TextData.GetAlphabetical(10);
        //        ab2.BaslikTanimi = "Çek Ödemeleri";
        //        ab2.IsVadeIliskili = false;
        //        ab2.SirketKodu = "2000";

        //        AnaBaslik ab3 = new AnaBaslik();
        //        ab3.ID = FakeData.TextData.GetAlphabetical(10);
        //        ab3.BaslikTanimi = "Havale Ödemeleri";
        //        ab3.IsVadeIliskili = false;
        //        ab3.SirketKodu = "2000";

        //        AnaBaslik ab4 = new AnaBaslik();
        //        ab4.ID = FakeData.TextData.GetAlphabetical(10);
        //        ab4.BaslikTanimi = "Komisyon Faizleri";
        //        ab4.IsVadeIliskili = false;
        //        ab4.SirketKodu = "1000";

        //        AnaBaslik ab5 = new AnaBaslik();
        //        ab5.ID = FakeData.TextData.GetAlphabetical(10); ;
        //        ab5.BaslikTanimi = "Müşteri Tahsilatı";
        //        ab5.IsVadeIliskili = false;
        //        ab5.SirketKodu = "3000";

        //        AnaBaslik ab6 = new AnaBaslik();
        //        ab6.ID = FakeData.TextData.GetAlphabetical(10);
        //        ab6.BaslikTanimi = "Masraf Tahsilatı";
        //        ab6.IsVadeIliskili = false;
        //        ab6.SirketKodu = "3000";


        //        List<AnaBaslik> anaBaslikList = new List<AnaBaslik>();
        //        for (int i = 0; i < 180; i++)
        //        {
        //            AnaBaslik ab7 = new AnaBaslik();
        //            ab7.ID = FakeData.TextData.GetAlphabetical(10);
        //            ab7.BaslikTanimi = FakeData.NameData.GetCompanyName();
        //            ab7.IsVadeIliskili = false;
        //            ab7.SirketKodu = "3000";

        //            anaBaslikList.Add(ab7);
        //        }

        //        anaBaslikList.Add(ab1);
        //        anaBaslikList.Add(ab2);
        //        anaBaslikList.Add(ab3);
        //        anaBaslikList.Add(ab4);
        //        anaBaslikList.Add(ab4);
        //        anaBaslikList.Add(ab5);
        //        anaBaslikList.Add(ab6);


        //        context.AddRange(anaBaslikList);
        //        #endregion

        //        #region User DUMMY
        //        User user = new User();
        //        user.Password = "123456";
        //        user.Name = "Fethi";
        //        user.Surname = "Tekyaygil";
        //        user.Username = "FethiTekyaygil";
        //        user.Yetki = "Admin";

        //        User user2 = new User();
        //        user2.Password = "123456";
        //        user2.Name = "Emre";
        //        user2.Surname = "Simsek";
        //        user2.Username = "EmreSimsek";
        //        user2.Yetki = "Admin";

        //        users.Add(user);
        //        users.Add(user2);

        //        context.Users.Add(user);
        //        context.Users.Add(user2);
        //        #endregion

        //        #region Kalem
        //        List<string> altBasliklar = new List<string>() { "Ziraat Bankası", "Akbank", "Halk Bankası", "KuveytTürk", "İş Bankası", "Garanti", "QNB Finansbank" };
        //        List<string> tipSymbol = new List<string>() { "+", "-" };
        //        List<string> tipAciklama = new List<string>() { "Gelir", "Gider" };


        //        for (int i = 0; i < 100; i++)
        //        {
        //            User u = users[FakeData.NumberData.GetNumber(0, 2)];

        //            AnaBaslik anaBaslik = anaBaslikList[FakeData.NumberData.GetNumber(anaBaslikList.Count - 1)];
        //            Kalem k1 = new Kalem();
        //            k1.KalemID = FakeData.TextData.GetAlphaNumeric(10);
        //            k1.Aciklama = altBasliklar[FakeData.NumberData.GetNumber(altBasliklar.Count - 1)];
        //            k1.AnaBaslik = anaBaslik;
        //            anaBaslik.Kalemler.Add(k1);
        //            k1.Ekleyen = u;
        //            u.EklenenKalemler.Add(k1);
        //            k1.DuzenlemeTarihi = DateTime.Now;
        //            k1.EklemeTarihi = DateTime.Now;
        //            k1.Tutar = FakeData.NumberData.GetNumber(1000);
        //            k1.VadeTarihi = DateTime.Now;
        //            k1.IsTahmin = false;
        //            k1.KalemTipiAciklama = tipAciklama[FakeData.NumberData.GetNumber(0, 2)];
        //            k1.KalemTipiSymbol = tipSymbol[tipAciklama.IndexOf(k1.KalemTipiAciklama)];
        //            k1.IsUserCreation = true;
        //            k1.EkAlan1 = FakeData.TextData.GetSentences(FakeData.NumberData.GetNumber(10));


        //            ParaBirimi pb = paraBirimleri.ToList()[FakeData.NumberData.GetNumber(paraBirimleri.Count)];
        //            ParaBirimiKalem pbk = new ParaBirimiKalem()
        //            {
        //                Kalem = k1,
        //                ParaBirimi = pb,
        //                Tutar = k1.Tutar
        //            };
        //            pb.ParaBirimiKalemler.Add(pbk);
        //            k1.ParaBirimiKalem = pbk;

        //            context.ParaBirimiKalemler.Add(pbk);
        //            context.Kalemler.Add(k1);
        //            kalemler.Add(k1);

        //        }
        //        #endregion

        //        #region Başlık
        //        for (int i = 0; i < kalemler.Count; i++)
        //        {
        //            TekliBaslik tekliBaslik = new TekliBaslik();

        //            tekliBaslik = tekliBasliklar.SingleOrDefault(s => s.AnaBaslikID == kalemler[i].AnaBaslikID);
        //            if (tekliBaslik == null)
        //            {
        //                tekliBaslik = new TekliBaslik();
        //                tekliBaslik.FlowDirectionExplanation = kalemler[i].KalemTipiAciklama;
        //                tekliBaslik.FlowDirectionSymbol = kalemler[i].KalemTipiAciklama == "Gelir" ? "+" : "-";

        //                tekliBaslik.Title = kalemler[i].Aciklama;
        //                tekliBaslik.ID = FakeData.TextData.GetAlphabetical(15);

        //                tekliBaslik.AnaBaslik = kalemler[i].AnaBaslik;
        //                tekliBaslik.AnaBaslikID = kalemler[i].AnaBaslikID;

        //                kalemler[i].AnaBaslik.TekliBaslik = tekliBaslik;
        //                kalemler[i].AnaBaslik.TekliBaslikID = tekliBaslik.ID;
        //                tekliBaslik.Kalemler.Add(kalemler[i]);
        //                kalemler[i].TekliBaslik = tekliBaslik;

        //                context.TekliBasliklar.Add(tekliBaslik);

        //                tekliBasliklar.Add(tekliBaslik);
        //            }
        //            else
        //            {
        //                tekliBaslik.Kalemler.Add(kalemler[i]);
        //                kalemler[i].TekliBaslik = tekliBaslik;
        //                //tekliBasliklar.Add(tekliBaslik);
        //            }




        //            #region Para Birimi Tutar Ops

        //            ParaBirimiTutar pbt = tekliBaslik.Currencies.SingleOrDefault(w => w.ParaBirimi.Kur == kalemler[i].ParaBirimiKalem.ParaBirimi.Kur);
        //            if (pbt == null)
        //            {
        //                pbt = new ParaBirimiTutar();

        //                pbt.TekliBaslik = tekliBaslik;
        //                tekliBaslik.Currencies.Add(pbt);

        //                pbt.ParaBirimi = kalemler[i].ParaBirimiKalem.ParaBirimi;
        //                pbt.Tutar = kalemler[i].Tutar;

        //                context.ParaBirimiTutarlar.Add(pbt);

        //            }
        //            else
        //                pbt.Tutar += kalemler[i].Tutar;


        //            #endregion

        //            #endregion
        //        }
        //        context.SaveChanges();
        //    }
        //}
        #endregion
    }
}
