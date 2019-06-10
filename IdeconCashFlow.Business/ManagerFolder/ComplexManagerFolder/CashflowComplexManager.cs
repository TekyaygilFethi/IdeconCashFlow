using IdeconCashFlow.Business.DummyFolder;
using IdeconCashFlow.Business.ManagerFolder.BaseManagerFolder;
using IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder;
using IdeconCashFlow.Business.UnitOfWorkFolder;
using IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder;
using IdeconCashFlow.Data.Business.GenericResponse;
using IdeconCashFlow.Data.Business.KalemManagerFormDataFolder;
using IdeconCashFlow.Data.Business.UserManagerFormDataFolder;
using IdeconCashFlow.Data.POCO;
using IdeconCashFlow.Database.ContextFolder;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace IdeconCashFlow.Business.ManagerFolder.ComplexManagerFolder
{
    public class CashflowComplexManager : BaseComplexManager
    {
        IUnitOfWork uow;

        readonly KalemManager kalemManager;
        readonly AnaBaslikManager anaBaslikManager;
        readonly ParaBirimiManager paraBirimiManager;
        readonly TekliBaslikManager tekliBaslikManager;
        readonly ParaBirimiTutarManager paraBirimiTutarManager;
        readonly ParaBirimiKalemManager paraBirimiKalemManager;
        readonly UserManager userManager;
        readonly DummyData dummyData;

        public CashflowComplexManager()
        {
            uow = new UnitOfWork(new IdeconCashFlowDbContext());

            kalemManager = uow.GetManager<KalemManager, Kalem>();
            anaBaslikManager = uow.GetManager<AnaBaslikManager, AnaBaslik>();
            paraBirimiManager = uow.GetManager<ParaBirimiManager, ParaBirimi>();
            tekliBaslikManager = uow.GetManager<TekliBaslikManager, TekliBaslik>();
            paraBirimiTutarManager = uow.GetManager<ParaBirimiTutarManager, ParaBirimiTutar>();
            paraBirimiKalemManager = uow.GetManager<ParaBirimiKalemManager, ParaBirimiKalem>();
            userManager = uow.GetManager<UserManager, User>();
            dummyData = new DummyData();
        }

        public CashflowComplexManager(bool forUser=true)
        {
            uow = new UnitOfWork(new IdeconCashFlowDbContext());

            userManager = uow.GetManager<UserManager,User>();
        }

        #region DUMMY 
        //public ResponseObject<GetBaslikFormData> GetAllBaslikDummy()
        //{
        //    ResponseObject<GetBaslikFormData> response = new ResponseObject<GetBaslikFormData>();
        //    GetBaslikFormData gbFormData = new GetBaslikFormData();
        //    dummyData.CreateData();
        //    List<TekliBaslik> baslikList = new List<TekliBaslik>();

        //    List<Kalem> kalemList = dummyData.GetKalems();
        //    List<string> pbkKurList = kalemList.Select(s => s.ParaBirimiKalem.ParaBirimi.Kur).Distinct().ToList();
        //    List<ParaBirimiTutar> pbtList = new List<ParaBirimiTutar>();


        //    for (int i = 0; i < pbkKurList.Count; i++)
        //    {
        //        pbtList.Add(new ParaBirimiTutar { ParaBirimi = pbkKurList[i], Tutar = 0 });
        //    }

        //    try
        //    {
        //        foreach (var grup in kalemList.GroupBy(g => g.AnaBaslikID))
        //        {

        //            TekliBaslik baslik = new TekliBaslik();

        //            foreach (var pbt in pbtList)
        //            {
        //                baslik.Currencies.Add(new ParaBirimiTutar { ParaBirimi = pbt.ParaBirimi, Tutar = 0 });
        //            }
        //            foreach (var kalem in grup)
        //            {
        //                baslik.ID = kalem.AnaBaslikID;
        //                baslik.FlowDirectionExplanation = kalem.KalemTipiAciklama;
        //                baslik.FlowDirectionSymbol = kalem.KalemTipiAciklama == "Gelir" ? "+" : "-";
        //                baslik.Title = kalem.AnaBaslik.BaslikTanimi;

        //                pbtList.SingleOrDefault(w => w.ParaBirimi == kalem.ParaBirimiKalem.ParaBirimi.Kur).Tutar += kalem.Tutar;
        //                baslik.Currencies.SingleOrDefault(w => w.ParaBirimi == kalem.ParaBirimiKalem.ParaBirimi.Kur).Tutar += kalem.Tutar;

        //            }
        //            baslikList.Add(baslik);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        response.IsSuccess = false;
        //        response.StatusCode = "400";
        //        response.Explanation = base.GetExceptionMessage(ex);
        //    }
        //    gbFormData.Basliklar = baslikList;
        //    gbFormData.TotalParaBirimiTutar = pbtList;

        //    response.StatusCode = "200";
        //    response.Explanation = "Success";
        //    response.IsSuccess = true;
        //    response.Object = gbFormData;
        //    return response;
        //}

        //public ResponseObject<List<GetBaslikFormData>> GetGiderBaslikDummy()
        //{
        //    ResponseObject<List<GetBaslikFormData>> response = new ResponseObject<List<GetBaslikFormData>>();

        //    try
        //    {
        //        List<TekliBaslik> baslikList = new List<TekliBaslik>();

        //        foreach (var grup in dummyData.GetKalems().Where(w => w.KalemTipiAciklama == "Gider").GroupBy(g => g.AnaBaslikID))
        //        {
        //            TekliBaslik baslik = new TekliBaslik();
        //            foreach (var kalem in grup)
        //            {
        //                baslik.FlowDirectionExplanation = kalem.KalemTipiAciklama;
        //                baslik.Title = kalem.AnaBaslik.BaslikTanimi;

        //                baslik.Currencies.Add(new ParaBirimiTutar { ParaBirimi = kalem.ParaBirimiKalem.ParaBirimi.Kur, Tutar = kalem.Tutar });

        //            }
        //            baslikList.Add(baslik);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        response.IsSuccess = false;
        //        response.StatusCode = "400";
        //        response.Explanation = base.GetExceptionMessage(ex);
        //    }
        //    response.StatusCode = "200";
        //    response.Explanation = "Success";
        //    return response;
        //}

        //public ResponseObject<List<GetBaslikFormData>> GetGelirBaslikDummy()
        //{
        //    ResponseObject<List<GetBaslikFormData>> response = new ResponseObject<List<GetBaslikFormData>>();

        //    try
        //    {
        //        List<GetBaslikFormData> gbfdList = new List<GetBaslikFormData>();

        //        List<TekliBaslik> baslikList = new List<TekliBaslik>();

        //        foreach (var grup in dummyData.GetKalems().Where(w => w.KalemTipiAciklama == "Gelir").GroupBy(g => g.AnaBaslikID))
        //        {
        //            TekliBaslik baslik = new TekliBaslik();
        //            foreach (var kalem in grup)
        //            {
        //                baslik.FlowDirectionExplanation = kalem.KalemTipiAciklama;
        //                baslik.Title = kalem.AnaBaslik.BaslikTanimi;

        //                baslik.Currencies.Add(new ParaBirimiTutar { ParaBirimi = kalem.ParaBirimiKalem.ParaBirimi.Kur, Tutar = kalem.Tutar });
        //            }

        //            baslikList.Add(baslik);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        response.IsSuccess = false;
        //        response.StatusCode = "400";
        //        response.Explanation = base.GetExceptionMessage(ex);
        //    }
        //    response.StatusCode = "200";
        //    response.Explanation = "Success";
        //    return response;

        //}
        #endregion

        #region GET
        public ResponseObject<List<Kalem>> GetAllKalemler()
        {
            ResponseObject<List<Kalem>> response = new ResponseObject<List<Kalem>>();

            try
            {
                response.Object = kalemManager.GetAll();
                response.IsSuccess = true;
                response.StatusCode = "200";
                response.Explanation = "Success";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Explanation = ex.Message;
                response.StatusCode = "400";
            }
            return response;
        }

        public ResponseObject<List<ParaBirimi>> GetAllParaBirimi()
        {
            ResponseObject<List<ParaBirimi>> response = new ResponseObject<List<ParaBirimi>>();

            try
            {
                response.Object = dummyData.GetParaBirimleri();//paraBirimiManager.GetAll();
                response.IsSuccess = true;
                response.StatusCode = "200";
                response.Explanation = "Success";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Explanation = ex.Message;
                response.StatusCode = "400";
            }
            return response;
        }

        public ResponseObject<GetBaslikFormData> GetAllBaslik()
        {
            ResponseObject<GetBaslikFormData> response = new ResponseObject<GetBaslikFormData>();
            GetBaslikFormData gbFormData = new GetBaslikFormData();
            List<TekliBaslik> baslikList = new List<TekliBaslik>();
            List<Kalem> kalemList = kalemManager.GetAll();
            List<string> pbkKurList = kalemList.Select(s => s.ParaBirimiKalem.ParaBirimi.Kur).Distinct().ToList();
            List<ParaBirimiTutar> pbtList = new List<ParaBirimiTutar>();

            for (int i = 0; i < pbkKurList.Count; i++)
            {
                pbtList.Add(new ParaBirimiTutar { ParaBirimi = paraBirimiManager.SingleGetBy(b => b.Kur == pbkKurList[i]), Tutar = 0 });
            }

            try
            {
                foreach (var grup in kalemList.GroupBy(g => g.AnaBaslikID))
                {
                    TekliBaslik baslik = new TekliBaslik();

                    baslik.Currencies.AddRange(pbtList);

                    foreach (var kalem in grup)
                    {
                        baslik.ID = kalem.AnaBaslikID;
                        baslik.FlowDirectionExplanation = kalem.KalemTipiAciklama;
                        baslik.FlowDirectionSymbol = kalem.KalemTipiAciklama == "Gelir" ? "+" : "-";
                        baslik.Title = kalem.AnaBaslik.BaslikTanimi;

                        pbtList.SingleOrDefault(w => w.ParaBirimi.Kur == kalem.ParaBirimiKalem.ParaBirimi.Kur).Tutar += kalem.Tutar;
                        baslik.Currencies.SingleOrDefault(w => w.ParaBirimi.Kur == kalem.ParaBirimiKalem.ParaBirimi.Kur).Tutar = kalem.Tutar;

                    }
                    baslikList.Add(baslik);
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.StatusCode = "400";
                response.Explanation = ex.Message;
            }

            //gbFormData.Basliklar = baslikList;
            gbFormData.TotalParaBirimiTutar = pbtList;

            response.StatusCode = "200";
            response.Explanation = "Success";
            response.IsSuccess = true;
            response.Object = gbFormData;
            return response;
        }

        public ResponseObject<GetBaslikFormData> GetAllBasliklar()
        {
            ResponseObject<GetBaslikFormData> response = new ResponseObject<GetBaslikFormData>();
            GetBaslikFormData gbFormData = new GetBaslikFormData();
            List<TekliBaslikTemp> tempBaslikList = new List<TekliBaslikTemp>();
            List<Kalem> tumKalemler = kalemManager.GetAll();
            tekliBaslikManager.GetAll().ForEach(each => tempBaslikList.Add(base.AdvancedMap<TekliBaslik, TekliBaslikTemp>(each)));
            List<ParaBirimiTutar> pbtList = new List<ParaBirimiTutar>();

            try
            {
                List<string> pbkKurList = new List<string>();


                foreach (var kur in tumKalemler.Select(s => s.ParaBirimiKalem.ParaBirimi.Kur))
                {
                    if (!(pbkKurList.Contains(kur)))
                    {
                        pbkKurList.Add(kur);
                    }
                }

                foreach (var baslik in tempBaslikList)
                {
                    List<Kalem> kalemList = baslik.Kalemler;

                    for (int i = 0; i < pbkKurList.Count; i++)
                    {
                        ParaBirimiTutar pbt = new ParaBirimiTutar { ParaBirimi = paraBirimiManager.SingleGetBy(b => b.Kur == pbkKurList[i]), ParaBirimiID = paraBirimiManager.SingleGetBy(b => b.Kur == pbkKurList[i]).ID, Tutar = 0 };
                        pbtList.Add(pbt);

                        if (!(baslik.Currencies.Select(s => s.ParaBirimi.Kur).Contains(pbkKurList[i])))
                        {
                            baslik.Currencies.Add(pbt);
                        }
                    }

                    foreach (var kalem in kalemList)
                    {
                        if (kalem.KalemTipiAciklama == "Gelir")
                        {
                            pbtList.SingleOrDefault(w => w.ParaBirimi.Kur == kalem.ParaBirimiKalem.ParaBirimi.Kur).Tutar += kalem.Tutar;
                            //baslik.Currencies.SingleOrDefault(w => w.ParaBirimi.Kur == kalem.ParaBirimiKalem.ParaBirimi.Kur).Tutar += kalem.Tutar;
                        }
                        else
                        {
                            pbtList.SingleOrDefault(w => w.ParaBirimi.Kur == kalem.ParaBirimiKalem.ParaBirimi.Kur).Tutar -= kalem.Tutar;
                            //baslik.Currencies.SingleOrDefault(w => w.ParaBirimi.Kur == kalem.ParaBirimiKalem.ParaBirimi.Kur).Tutar -= kalem.Tutar;
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.StatusCode = "400";
                response.Explanation = ex.Message;
            }

            gbFormData.Basliklar = tempBaslikList;
            gbFormData.TotalParaBirimiTutar = pbtList;

            response.StatusCode = "200";
            response.Explanation = "Success";
            response.IsSuccess = true;
            response.Object = gbFormData;
            return response;
        }

        public ResponseObject<List<GetAnaBaslikFormData>> GetAllAnaBasliklar()
        {
            ResponseObject<List<GetAnaBaslikFormData>> response = new ResponseObject<List<GetAnaBaslikFormData>>();

            try
            {
                List<GetAnaBaslikFormData> gabfdList = anaBaslikManager.GetAll().Select(s => new GetAnaBaslikFormData { ID = s.ID, Title = s.BaslikTanimi }).ToList();
                response.Explanation = "success";
                response.IsSuccess = true;
                response.Object = gabfdList;
                response.StatusCode = "200";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.StatusCode = "400";
                response.Explanation = ex.Message;
            }
            return response;
        }

        public ResponseObject<List<GetBaslikFormData>> GetGiderBaslik()
        {
            ResponseObject<List<GetBaslikFormData>> response = new ResponseObject<List<GetBaslikFormData>>();

            try
            {
                List<TekliBaslik> baslikList = new List<TekliBaslik>();

                foreach (var grup in kalemManager.GetAll().Where(w => w.KalemTipiAciklama == "Gider").GroupBy(g => g.AnaBaslikID))
                {
                    TekliBaslik baslik = new TekliBaslik();
                    foreach (var kalem in grup)
                    {
                        baslik.FlowDirectionExplanation = kalem.KalemTipiAciklama;
                        baslik.Title = kalem.AnaBaslik.BaslikTanimi;

                        baslik.Currencies.Add(new ParaBirimiTutar { ParaBirimi = paraBirimiManager.SingleGetBy(b => b.Kur == kalem.ParaBirimiKalem.ParaBirimi.Kur), Tutar = kalem.Tutar });

                    }
                    baslikList.Add(baslik);
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.StatusCode = "400";
                response.Explanation = ex.Message;
            }
            response.StatusCode = "200";
            response.Explanation = "Success";
            return response;
        }

        public ResponseObject<List<GetBaslikFormData>> GetGelirBaslik()
        {
            ResponseObject<List<GetBaslikFormData>> response = new ResponseObject<List<GetBaslikFormData>>();

            try
            {
                List<GetBaslikFormData> gbfdList = new List<GetBaslikFormData>();

                List<TekliBaslik> baslikList = new List<TekliBaslik>();

                foreach (var grup in kalemManager.GetAll().Where(w => w.KalemTipiAciklama == "Gelir").GroupBy(g => g.AnaBaslikID))
                {
                    TekliBaslik baslik = new TekliBaslik();
                    foreach (var kalem in grup)
                    {
                        baslik.FlowDirectionExplanation = kalem.KalemTipiAciklama;
                        baslik.Title = kalem.AnaBaslik.BaslikTanimi;

                        baslik.Currencies.Add(new ParaBirimiTutar { ParaBirimi = paraBirimiManager.SingleGetBy(b => b.Kur == kalem.ParaBirimiKalem.ParaBirimi.Kur), Tutar = kalem.Tutar });
                    }

                    baslikList.Add(baslik);
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.StatusCode = "400";
                response.Explanation = ex.Message;
            }
            response.StatusCode = "200";
            response.Explanation = "Success";
            return response;

        }

        public List<ParaBirimiTutar> GetTotalParaBirimiTutar(TekliBaslik baslik)
        {
            List<ParaBirimiTutar> totalParaBirimiTutar = new List<ParaBirimiTutar>();

            foreach (var pbt in baslik.Currencies.GroupBy(g => g.ParaBirimi))
            {
                ParaBirimiTutar newPtb = new ParaBirimiTutar();
                newPtb.ParaBirimi = pbt.Key;

                foreach (var money in pbt)
                {
                    newPtb.Tutar += money.Tutar;
                }
                totalParaBirimiTutar.Add(newPtb);
            }

            return totalParaBirimiTutar;
        }

        public ResponseObject<List<GetBaslikWithDateResponse>> GetAllBasliklarWithDate(GetBaslikWithDateFormData gbwdFormData)
        {
            ResponseObject<List<GetBaslikWithDateResponse>> response = new ResponseObject<List<GetBaslikWithDateResponse>>();
            List<GetBaslikWithDateResponse> gbwdList = new List<GetBaslikWithDateResponse>();

            try
            {
                if (gbwdFormData.FilterType.ToLower() == "d")
                {
                    List<Kalem> filtrelenmisKalemler = kalemManager.GetBy(w => w.VadeTarihi.CompareTo(gbwdFormData.BaslangicTarihi) >= 0 && w.VadeTarihi.CompareTo(gbwdFormData.BaslangicTarihi.AddDays(15)) <= 0);
                    var basliklaGruplanmisKalemler = filtrelenmisKalemler.GroupBy(g => g.AnaBaslik);

                    foreach (var baslikGrupKalem in basliklaGruplanmisKalemler)
                    {
                        GetBaslikWithDateResponse gbwdResponse = new GetBaslikWithDateResponse()
                        {
                            AnaBaslikID = baslikGrupKalem.Key.ID,
                            AnaBaslikAciklama = baslikGrupKalem.Key.BaslikTanimi
                        };

                        foreach (var kurGrupKalem in baslikGrupKalem.GroupBy(g => g.ParaBirimiKalem.ParaBirimi.Kur))
                        {
                            double total = 0;

                            foreach (var tarihKurKalem in kurGrupKalem)
                            {
                                total += tarihKurKalem.Tutar;
                            }

                            ParaBirimiTutar pbt = new ParaBirimiTutar()
                            {
                                ParaBirimi = paraBirimiManager.SingleGetBy(b => b.Kur == kurGrupKalem.Key),
                                Tutar = total
                            };
                            gbwdResponse.ParaBirimiTutarlar.Add(pbt);
                            gbwdList.Add(gbwdResponse);
                        }
                    }
                }
                else if (gbwdFormData.FilterType.ToLower() == "w")
                {
                    List<Kalem> filtrelenmisKalemler = kalemManager.GetBy(w => w.VadeTarihi.CompareTo(gbwdFormData.BaslangicTarihi) >= 0 && w.VadeTarihi.CompareTo(gbwdFormData.BaslangicTarihi.AddDays(105)) <= 0);
                    var basliklaGruplanmisKalemler = filtrelenmisKalemler.GroupBy(g => g.AnaBaslik);

                    foreach (var baslikGrupKalem in basliklaGruplanmisKalemler)
                    {
                        GetBaslikWithDateResponse gbwdResponse = new GetBaslikWithDateResponse()
                        {
                            AnaBaslikID = baslikGrupKalem.Key.ID,
                            AnaBaslikAciklama = baslikGrupKalem.Key.BaslikTanimi
                        };

                        var tarihGruplanmisKalemler = baslikGrupKalem.GroupBy(i => CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(
            i.VadeTarihi, CalendarWeekRule.FirstDay, CultureInfo.CurrentCulture.Calendar.GetDayOfWeek(i.VadeTarihi)));

                        foreach (var tarihGruplanmisKalem in tarihGruplanmisKalemler)
                        {
                            foreach (var tarihKurGrupKalem in tarihGruplanmisKalem.GroupBy(g => g.ParaBirimiKalem.ParaBirimi.Kur))
                            {
                                double total = 0;

                                foreach (var tarihKurKalem in tarihKurGrupKalem)
                                {
                                    total += tarihKurKalem.Tutar;
                                }
                                ParaBirimiTutar pbt = new ParaBirimiTutar()
                                {
                                    ParaBirimi = paraBirimiManager.SingleGetBy(b => b.Kur == tarihKurGrupKalem.Key),
                                    Tutar = total
                                };
                                gbwdResponse.ParaBirimiTutarlar.Add(pbt);
                                gbwdList.Add(gbwdResponse);
                            }
                        }
                    }
                }
                else if (gbwdFormData.FilterType.ToLower() == "m")
                {
                    List<Kalem> filtrelenmisKalemler = kalemManager.GetBy(w => w.VadeTarihi.CompareTo(gbwdFormData.BaslangicTarihi) >= 0 && w.VadeTarihi.CompareTo(gbwdFormData.BaslangicTarihi.AddMonths(105)) <= 0);
                    var basliklaGruplanmisKalemler = filtrelenmisKalemler.GroupBy(g => g.AnaBaslik);

                    foreach (var baslikGrupKalem in basliklaGruplanmisKalemler)
                    {
                        GetBaslikWithDateResponse gbwdResponse = new GetBaslikWithDateResponse()
                        {
                            AnaBaslikID = baslikGrupKalem.Key.ID,
                            AnaBaslikAciklama = baslikGrupKalem.Key.BaslikTanimi
                        };

                        var tarihGruplanmisKalemler = baslikGrupKalem.GroupBy(g => g.VadeTarihi.Month);

                        foreach (var tarihGruplanmisKalem in tarihGruplanmisKalemler)
                        {
                            foreach (var tarihKurGrupKalem in tarihGruplanmisKalem.GroupBy(g => g.ParaBirimiKalem.ParaBirimi.Kur))
                            {
                                double total = 0;

                                foreach (var tarihKurKalem in tarihKurGrupKalem)
                                {
                                    total += tarihKurKalem.Tutar;
                                }
                                ParaBirimiTutar pbt = new ParaBirimiTutar()
                                {
                                    ParaBirimi = paraBirimiManager.SingleGetBy(b => b.Kur == tarihKurGrupKalem.Key),
                                    Tutar = total
                                };
                                gbwdResponse.ParaBirimiTutarlar.Add(pbt);
                                gbwdList.Add(gbwdResponse);
                            }
                        }
                    }
                }
                else
                {
                    response.IsSuccess = false;
                    response.StatusCode = "400";
                    response.Explanation = "Yanlış Filtreleme Tipi.. Filtreleme tipi yalnızca \"d\",\"w\",\"m\" olabilir";
                    return response;
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Explanation = ex.Message;
                response.StatusCode = "400";
            }


            response.StatusCode = "200";
            response.Explanation = "Success";
            response.IsSuccess = true;
            response.Object = gbwdList;

            return response;
        }

        #endregion

        #region CREATE

        public ResponseObject<Kalem> AddKalem(AddKalemFormData kalemFormData)
        {
            ResponseObject<Kalem> response = new ResponseObject<Kalem>();

            try
            {
                //List<string> excludedColumns = new List<string>() { "AnaBaslikID" };
                Kalem kalem = base.AdvancedMap<AddKalemFormData, Kalem>(kalemFormData);
                string ID = FakeData.TextData.GetAlphabetical(10);
                while (kalemManager.GetAll().Select(s => s.KalemID).Contains(ID))
                {
                    ID = FakeData.TextData.GetAlphabetical(10);
                }
                kalem.KalemID = ID;

                #region Para Birimi Kalem
                ParaBirimiKalem pbk = new ParaBirimiKalem();
                pbk.Kalem = kalem;
                kalem.ParaBirimiKalem = pbk;
                kalem.KalemTipiSymbol = kalem.KalemTipiAciklama == "Gelir" ? "+" : "-";

                pbk.ParaBirimi = paraBirimiManager.SingleGetBy(g => g.Code == kalemFormData.ParaBirimi);
                pbk.Tutar = kalem.Tutar;

                paraBirimiKalemManager.Add(pbk);

                #endregion

                #region Ana Başlık Ops
                AnaBaslik anaBaslik = anaBaslikManager.SingleGetBy(kalemFormData.AnaBaslikID);
                if (anaBaslikManager == null)
                {
                    anaBaslik = new AnaBaslik();
                    anaBaslik = base.AdvancedMap<AddKalemFormData, AnaBaslik>(kalemFormData);
                    kalem.AnaBaslik = anaBaslik;
                    anaBaslik.Kalemler.Add(kalem);
                    anaBaslikManager.Add(anaBaslik);
                }
                else
                {
                    if (anaBaslik.IsVadeIliskili)
                        kalem.VadeTarihi = DateTime.Now;

                    kalem.AnaBaslik = anaBaslik;
                    anaBaslik.Kalemler.Add(kalem);
                }
                #endregion

                #region Başlık Ops
                TekliBaslik tekliBaslik = tekliBaslikManager.SingleGetByAnaBaslik(kalemFormData.AnaBaslikID);
                if (tekliBaslik == null)
                {
                    tekliBaslik = new TekliBaslik();

                    tekliBaslik.FlowDirectionExplanation = kalemFormData.KalemTipiAciklama;
                    tekliBaslik.FlowDirectionSymbol = kalemFormData.KalemTipiAciklama == "Gelir" ? "+" : "-";

                    tekliBaslik.Title = anaBaslik.BaslikTanimi;
                    tekliBaslik.ID = FakeData.TextData.GetAlphabetical(15);
                    tekliBaslik.AnaBaslikID = anaBaslik.ID;
                    tekliBaslik.AnaBaslik = anaBaslik;
                    anaBaslik.TekliBaslik = tekliBaslik;
                    anaBaslik.TekliBaslikID = tekliBaslik.ID;

                    tekliBaslik.Kalemler.Add(kalem);
                    kalem.TekliBaslik = tekliBaslik;
                    kalem.TekliBaslikID = tekliBaslik.ID;

                    tekliBaslikManager.Add(tekliBaslik);
                }
                else
                {
                    tekliBaslik.AnaBaslik = anaBaslik;
                    anaBaslik.TekliBaslik = tekliBaslik;

                    tekliBaslik.Kalemler.Add(kalem);
                    kalem.TekliBaslik = tekliBaslik;
                }


                #endregion

                #region Para Birimi Tutar Ops
                ParaBirimiTutar pbt = tekliBaslik.Currencies.SingleOrDefault(w => w.ParaBirimi.Code == kalemFormData.ParaBirimi);
                if (pbt == null)
                {
                    pbt = new ParaBirimiTutar();

                    pbt.TekliBaslik = tekliBaslik;
                    //pbt.TekliBaslikID = tekliBaslik.ID;
                    tekliBaslik.Currencies.Add(pbt);

                    pbt.ParaBirimi = paraBirimiManager.SingleGetBy(g => g.Code == kalemFormData.ParaBirimi);
                    pbt.Tutar += kalemFormData.Tutar;

                    paraBirimiTutarManager.Add(pbt);

                }
                else
                    pbt.Tutar += kalemFormData.Tutar;
                #endregion

                #region Ekleyen ve Duzenleyen User Ops
                User ekleyenUser = userManager.GetByID(kalemFormData.EkleyenUserID);
                ekleyenUser.EklenenKalemler.Add(kalem);
                kalem.Ekleyen = ekleyenUser;

                #endregion

                kalemManager.Add(kalem);
                uow.Save();

                response.IsSuccess = true;
                response.Object = kalem;
                response.StatusCode = "200";
                response.Explanation = "Success";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Explanation = ex.Message;
                response.StatusCode = "400";
            }
            return response;
        }

        public ResponseObject<GetAnaBaslikFormData> AddAnaBaslik(AddAnaBaslikRequestObject requestObject)
        {
            ResponseObject<GetAnaBaslikFormData> response = new ResponseObject<GetAnaBaslikFormData>();

            try
            {
                AnaBaslik anaBaslik = new AnaBaslik();
                string ID = FakeData.TextData.GetAlphabetical(10);
                while (anaBaslikManager.GetAll().Select(s => s.ID).Contains(ID))
                {
                    ID = FakeData.TextData.GetAlphabetical(10);
                }
                anaBaslik.ID = ID;
                anaBaslik.BaslikTanimi = requestObject.Title;
                anaBaslik.IsVadeIliskili = requestObject.IsVadeIliskili;
                //anaBaslik.SirketKodu=JWT deki userın sirket kodu
                anaBaslikManager.Add(anaBaslik);
                uow.Save();
                response.IsSuccess = true;
                response.Object = new GetAnaBaslikFormData() { ID = anaBaslik.ID, Title = anaBaslik.BaslikTanimi };
                response.StatusCode = "200";
                response.Explanation = "Success";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Explanation = ex.Message;
                response.StatusCode = "400";
            }
            return response;
        }

        public ResponseObject<ParaBirimi> AddParaBirimi(ParaBirimi paraBirimi)
        {
            ResponseObject<ParaBirimi> response = new ResponseObject<ParaBirimi>();

            try
            {
                paraBirimiManager.Add(paraBirimi);
                uow.Save();
                response.IsSuccess = true;
                response.Object = paraBirimi;
                response.StatusCode = "200";
                response.Explanation = "Success";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Explanation = ex.Message;
                response.StatusCode = "400";
            }
            return response;
        }
        #endregion

        #region UPDATE

        public ResponseObject<Kalem> UpdateKalem(Kalem kalem)
        {
            ResponseObject<Kalem> response = new ResponseObject<Kalem>();

            try
            {
                kalemManager.Add(kalem);
                uow.Save();
                response.IsSuccess = true;
                response.StatusCode = "200";
                response.Explanation = "Success";
                response.Object = kalem;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Explanation = ex.Message;
                response.StatusCode = "400";
            }
            return response;
        }

        public ResponseObject<AnaBaslik> UpdateAnaBaslik(AnaBaslik anaBaslik)
        {
            ResponseObject<AnaBaslik> response = new ResponseObject<AnaBaslik>();

            try
            {
                anaBaslikManager.Add(anaBaslik);
                response.IsSuccess = true;
                response.StatusCode = "200";
                response.Explanation = "Success";
                response.Object = anaBaslik;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Explanation = ex.Message;
                response.StatusCode = "200";
                response.Explanation = "Success";
            }
            return response;
        }

        public ResponseObject<ParaBirimi> UpdateParaBirimi(ParaBirimi paraBirimi)
        {
            ResponseObject<ParaBirimi> response = new ResponseObject<ParaBirimi>();

            try
            {
                paraBirimiManager.Add(paraBirimi);
                response.IsSuccess = true;
                response.StatusCode = "200";
                response.Explanation = "Success";
                response.Object = paraBirimi;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Explanation = ex.Message;
                response.StatusCode = "400";
            }
            return response;
        }
        #endregion

        #region DELETE

        #endregion


        #region USER
        public ResponseObject<CheckLoginCreedientalsJWTResponse> CheckUserCreedientalsByJWT(UserJWT form)
        {

            ResponseObject<CheckLoginCreedientalsJWTResponse> response = new ResponseObject<CheckLoginCreedientalsJWTResponse>();
            try
            {
                var user = userManager.CheckJWT(form);
                CheckLoginCreedientalsJWTResponse checkResult = new CheckLoginCreedientalsJWTResponse();

                response.Explanation = "Success";
                response.IsSuccess = true;
                response.StatusCode = "200";
                response.Object = checkResult;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.StatusCode = "400";
                response.Explanation = ex.Message;
            }
            return response;
        }

        public ResponseObject<User> CheckUserCreedientals(LoginFormData form) 
        {

            ResponseObject<User> response = new ResponseObject<User>();
            try
            {
                var user = userManager.CheckCreedientals(form);

                response.Explanation = "Success";
                response.IsSuccess = true;
                response.StatusCode = "200";
                response.Object = user;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.StatusCode = "400";
                response.Explanation = ex.Message;
            }
            return response;
        }

        public string GetPasswordPhrase()
        {
            return userManager.GetPasswordPhrase();
        }
        #endregion


    }
}
