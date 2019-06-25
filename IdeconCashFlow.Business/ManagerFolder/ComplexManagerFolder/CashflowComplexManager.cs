using IdeconCashFlow.Business.ManagerFolder.BaseManagerFolder;
using IdeconCashFlow.Business.RepositoryFolder.DapperFolder;
using IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder;
using IdeconCashFlow.Data.Business.GenericResponse;
using IdeconCashFlow.Data.Business.KalemManagerFormDataFolder;
using IdeconCashFlow.Data.Business.ParaBirimiTutarFormDataFolder;
using IdeconCashFlow.Data.POCO;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;

namespace IdeconCashFlow.Business.ManagerFolder.ComplexManagerFolder
{
    public class CashflowComplexManager : BaseComplexManager
    {
        readonly DapperRepository dapperRepository;

        const string dbName = "ideconcashflowdapperdb";

        public CashflowComplexManager()
        {
            dapperRepository = new DapperRepository();
        }

        #region Dapper
        public ResponseObject<GetBaslikFormData> GetAllBasliklarDapper()
        {
            #region Tanımlamalar
            ResponseObject<GetBaslikFormData> response = new ResponseObject<GetBaslikFormData>();
            GetBaslikFormData gbFormData = new GetBaslikFormData();
            IEnumerable<TekliBaslikTemp> tempBaslikList = new List<TekliBaslikTemp>();
            TempBaslikFilterFormData tbffd = new TempBaslikFilterFormData();
            IEnumerable<string> allCurrencies = null;
            List<ParaBirimiTutarTemp> pbtList = new List<ParaBirimiTutarTemp>();
            List<ParaBirimiTutarTemp> totalPbtList = new List<ParaBirimiTutarTemp>();
            #endregion

            try
            {
                var currencyQuery = @"SELECT pbt.Kur
                                            FROM kalemtable AS kt 
                                            LEFT JOIN ParaBirimiKalemTable AS pbkt ON pbkt.ID = kt.ParaBirimiKalemID
                                            LEFT JOIN ParaBirimiTable AS pbt ON pbt.ID =pbkt.ParaBirimiID";

                allCurrencies = dapperRepository.Query<string>(currencyQuery);


                var tekliBaslikQuery = $"SELECT * FROM {dbName}.teklibasliktable;";
                tempBaslikList = dapperRepository.Query<TekliBaslikTemp>(tekliBaslikQuery);

                foreach (var tempBaslik in tempBaslikList)
                {
                    if (tempBaslik.FlowDirectionSymbol == "+")
                        tbffd.GelirBasliklar.Add(tempBaslik);
                    else
                        tbffd.GiderBasliklar.Add(tempBaslik);
                }



                foreach (var kur in allCurrencies)
                {
                    ParaBirimiTutarTemp totalpbt = new ParaBirimiTutarTemp { ParaBirimi = kur, Tutar = 0 };

                    pbtList.Add(totalpbt);
                }
                pbtList.ForEach(each => totalPbtList.Add(new ParaBirimiTutarTemp { ParaBirimi = each.ParaBirimi, Tutar = each.Tutar }));

                foreach (var baslik in tempBaslikList)
                {
                    var kalemFilterQuery = $"SELECT * FROM {dbName}.kalemtable WHERE TekliBaslikID = '{baslik.ID}';";
                    IEnumerable<Kalem> kalemList = dapperRepository.Query<Kalem>(kalemFilterQuery);

                    pbtList.ForEach(each => baslik.Currencies.Add(new ParaBirimiTutarTemp { ParaBirimi = each.ParaBirimi, Tutar = each.Tutar }));

                    foreach (var kalem in kalemList)
                    {
                        string query = currencyQuery;
                        query += $" WHERE kt.KalemID='" + kalem.ID + "'";
                        string kur = dapperRepository.Query<string>(query).SingleOrDefault();

                        if (kalem.KalemTipiAciklama == "Gelir")
                        {
                            totalPbtList.SingleOrDefault(w => w.ParaBirimi == kur).Tutar += kalem.Tutar;
                            baslik.Currencies.SingleOrDefault(w => w.ParaBirimi == kur).Tutar += kalem.Tutar;
                        }
                        else
                        {
                            totalPbtList.SingleOrDefault(w => w.ParaBirimi == kur).Tutar -= kalem.Tutar;
                            baslik.Currencies.SingleOrDefault(w => w.ParaBirimi == kur).Tutar -= kalem.Tutar;
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

            gbFormData.Basliklar = tbffd;
            gbFormData.TotalParaBirimiTutar = totalPbtList;

            response.StatusCode = "200";
            response.Explanation = "Success";
            response.IsSuccess = true;
            response.Object = gbFormData;
            return response;
        }

        public ResponseObject<IEnumerable<Kalem>> GetAllKalemlerDapper()
        {
            ResponseObject<IEnumerable<Kalem>> response = new ResponseObject<IEnumerable<Kalem>>();

            try
            {
                var query = $"SELECT * FROM {dbName}.kalemtable;";
                response.Object = dapperRepository.Query<Kalem>(query);
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

        public ResponseObject<IEnumerable<ParaBirimi>> GetAllParaBirimiDapper()
        {
            ResponseObject<IEnumerable<ParaBirimi>> response = new ResponseObject<IEnumerable<ParaBirimi>>();

            try
            {
                var query = $"SELECT * FROM {dbName}.parabirimitable;";
                response.Object = dapperRepository.Query<ParaBirimi>(query);//paraBirimiManager.GetAll();
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

        public ResponseObject<IEnumerable<GetAnaBaslikFormData>> GetAllAnaBasliklarDapper()
        {
            ResponseObject<IEnumerable<GetAnaBaslikFormData>> response = new ResponseObject<IEnumerable<GetAnaBaslikFormData>>();

            try
            {
                var query = $"SELECT ID, BaslikTanimi, IsVadeIliskili FROM {dbName}.anabasliktable";
                IEnumerable<GetAnaBaslikFormData> gabfdList = dapperRepository.Query<GetAnaBaslikFormData>(query);
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

        public ResponseObject<GetBaslikFormData> GetGiderBaslikDapper()
        {
            #region Tanımlamalar
            ResponseObject<GetBaslikFormData> response = new ResponseObject<GetBaslikFormData>();
            GetBaslikFormData gbFormData = new GetBaslikFormData();
            IEnumerable<TekliBaslikTemp> tempBaslikList = new List<TekliBaslikTemp>();
            IEnumerable<string> allCurrencies = null;
            List<ParaBirimiTutarTemp> pbtList = new List<ParaBirimiTutarTemp>();
            List<ParaBirimiTutarTemp> totalPbtList = new List<ParaBirimiTutarTemp>();
            #endregion

            try
            {
                var currencyQuery = $"SELECT DISTINCT Kur FROM {dbName}.parabirimitable;";
                allCurrencies = dapperRepository.Query<string>(currencyQuery);

                var tekliBaslikQuery = $"SELECT * FROM {dbName}.teklibasliktable;";
                tempBaslikList = dapperRepository.Query<TekliBaslikTemp>(tekliBaslikQuery);

                foreach (var kur in allCurrencies)
                {
                    ParaBirimiTutarTemp totalpbt = new ParaBirimiTutarTemp { ParaBirimi = kur, Tutar = 0 };

                    pbtList.Add(totalpbt);
                }
                pbtList.ForEach(each => totalPbtList.Add(new ParaBirimiTutarTemp { ParaBirimi = each.ParaBirimi, Tutar = each.Tutar }));

                foreach (var baslik in tempBaslikList)
                {
                    var kalemFilterQuery = $"SELECT * FROM {dbName}.kalemtable WHERE TekliBaslikID = '{baslik.ID}';";
                    IEnumerable<Kalem> kalemList = dapperRepository.Query<Kalem>(kalemFilterQuery);

                    pbtList.ForEach(each => baslik.Currencies.Add(new ParaBirimiTutarTemp { ParaBirimi = each.ParaBirimi, Tutar = each.Tutar }));

                    foreach (var kalem in kalemList)
                    {
                        string qry = @"SELECT pbt.Kur
                                            FROM kalemtable AS kt 
                                            LEFT JOIN ParaBirimiKalemTable AS pbkt ON pbkt.ID = kt.ParaBirimiKalemID
                                            LEFT JOIN ParaBirimiTable AS pbt ON pbt.ID =pbkt.ParaBirimiID WHERE kt.KalemID='" + kalem.ID + "'";

                        string kur = dapperRepository.Query<string>(qry).SingleOrDefault();

                        if (kalem.KalemTipiAciklama == "Gelir")
                        {
                            totalPbtList.SingleOrDefault(w => w.ParaBirimi == kur).Tutar += kalem.Tutar;
                            baslik.Currencies.SingleOrDefault(w => w.ParaBirimi == kur).Tutar += kalem.Tutar;
                        }
                        else
                        {
                            totalPbtList.SingleOrDefault(w => w.ParaBirimi == kur).Tutar -= kalem.Tutar;
                            baslik.Currencies.SingleOrDefault(w => w.ParaBirimi == kur).Tutar -= kalem.Tutar;
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

            gbFormData.Basliklar = null;
            gbFormData.TotalParaBirimiTutar = totalPbtList;

            response.StatusCode = "200";
            response.Explanation = "Success";
            response.IsSuccess = true;
            response.Object = gbFormData;
            return response;
        }

        public ResponseObject<List<GetBaslikFormData>> GetGelirBaslikDapper()
        {
            ResponseObject<List<GetBaslikFormData>> response = new ResponseObject<List<GetBaslikFormData>>();

            try
            {
                //List<GetBaslikFormData> gbfdList = new List<GetBaslikFormData>();

                //List<TekliBaslik> baslikList = new List<TekliBaslik>();

                //foreach (var grup in kalemManager.GetAllQueryable().Where(w => w.KalemTipiAciklama == "Gelir").GroupBy(g => g.AnaBaslikID))
                //{
                //    TekliBaslik baslik = new TekliBaslik();
                //    foreach (var kalem in grup)
                //    {
                //        baslik.FlowDirectionExplanation = kalem.KalemTipiAciklama;
                //        baslik.Title = kalem.AnaBaslik.BaslikTanimi;

                //        baslik.Currencies.Add(new ParaBirimiTutar { ParaBirimi = paraBirimiManager.SingleGetBy(b => b.Kur == kalem.ParaBirimiKalem.ParaBirimi.Kur), Tutar = kalem.Tutar });
                //    }

                //    baslikList.Add(baslik);
                //}
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

        public List<ParaBirimiTutar> GetTotalParaBirimiTutarOfBaslikDapper(string baslikID)
        {
            List<ParaBirimiTutar> totalParaBirimiTutar = new List<ParaBirimiTutar>();
            var query = $"SELECT ParaBirimiID,TekliBaslikID,Tutar FROM {dbName}.parabirimitutartable WHERE TekliBaslikID= '{baslikID}' GROUP BY TekliBaslikID,ParaBirimiID;";
            var list = dapperRepository.Query<GetTotalParaBirimiTutarFormData>(query);

            foreach (var pbt in list)
            {
                var innerQuery = $"SELECT * FROM {dbName}.parabirimitable WHERE ID={pbt.ParaBirimiID}";
                ParaBirimiTutar newPtb = new ParaBirimiTutar();
                newPtb.ParaBirimi = dapperRepository.Query<ParaBirimi>(innerQuery).FirstOrDefault();
                newPtb.ParaBirimiID = pbt.ParaBirimiID;
                newPtb.Tutar += pbt.Tutar;

                totalParaBirimiTutar.Add(newPtb);
            }

            return totalParaBirimiTutar;
        }

        public List<ParaBirimiTutar> GetTotalParaBirimiTutarDapper()
        {
            List<ParaBirimiTutar> totalParaBirimiTutar = new List<ParaBirimiTutar>();
            var query = $"SELECT ID,ParaBirimiID,TekliBaslikID,Tutar FROM {dbName}.parabirimitutartable GROUP BY TekliBaslikID,ParaBirimiID;";
            var list = dapperRepository.Query<GetTotalParaBirimiTutarFormData>(query);

            foreach (var pbt in list)
            {
                var innerQuery = $"SELECT * FROM ideconcashflowdapperdb.parabirimitable WHERE ID={pbt.ParaBirimiID}";
                ParaBirimiTutar newPtb = new ParaBirimiTutar
                {
                    ParaBirimi = dapperRepository.Query<ParaBirimi>(innerQuery).FirstOrDefault(),
                    ParaBirimiID = pbt.ParaBirimiID
                };

                newPtb.ID = newPtb.ID;

                newPtb.Tutar += pbt.Tutar;

                totalParaBirimiTutar.Add(newPtb);
            }

            return totalParaBirimiTutar;
        }

        public ResponseObject<GetBaslikWithDateResponse> GetAllBasliklarWithDateDapper(GetBaslikWithDateFormData gbwdFormData)
        {
            ResponseObject<GetBaslikWithDateResponse> response = new ResponseObject<GetBaslikWithDateResponse>();
            GetBaslikWithDateResponse gbwdResponse = new GetBaslikWithDateResponse();

            try
            {
                if (gbwdFormData.FilterType.ToLower() == "d")
                {
                    var dailyQuery = string.Empty;

                    if (gbwdFormData.AnaBaslikID == "all")
                        dailyQuery = $"SELECT kt.AnaBaslikID,SUM(pbk.Tutar) as 'Total',pb.Code,pb.ID as 'ParaBirimiID',kt.VadeTarihi " +
                            $"FROM kalemtable as kt " +
                            $"JOIN parabirimikalemtable as pbk ON pbk.KalemID = kt.ID " +
                            $"JOIN parabirimitable as pb ON pbk.ParaBirimiID = pb.ID " +
                            $"WHERE kt.VadeTarihi between '{gbwdFormData.BaslangicTarihi.ToString("yyyy-MM-dd")}' and '{gbwdFormData.BaslangicTarihi.AddDays(15).ToString("yyyy-MM-dd")}' " +
                            $"GROUP BY kt.AnaBaslikID,kt.VadeTarihi, pb.Kur ORDER BY kt.VadeTarihi;";


                    else
                        dailyQuery = $"SELECT kt.AnaBaslikID,SUM(pbk.Tutar) as 'Total',pb.Code,pb.ID as 'ParaBirimiID',kt.VadeTarihi " +
                            $"FROM kalemtable as kt " +
                            $"JOIN parabirimikalemtable as pbk ON pbk.KalemID = kt.ID " +
                            $"JOIN parabirimitable as pb ON pbk.ParaBirimiID = pb.ID " +
                            $"WHERE kt.AnaBaslikID='{gbwdFormData.AnaBaslikID}' and kt.VadeTarihi between '{gbwdFormData.BaslangicTarihi.ToString("yyyy-MM-dd")}' and '{gbwdFormData.BaslangicTarihi.AddDays(15).ToString("yyyy-MM-dd")}' " +
                            $"GROUP BY kt.AnaBaslikID,kt.VadeTarihi, pb.Kur ORDER BY kt.VadeTarihi;";

                    var kalemQueryResponseList = dapperRepository.Query<GetParaBirimiParaBirimiKalemQueryResponse>(dailyQuery);

                    foreach (var kalemQueryResponse in kalemQueryResponseList)
                    {
                        #region Totals
                        GetBaslikWithDateTotals gbwdtResponse = new GetBaslikWithDateTotals();
                        gbwdtResponse.AnaBaslikID = kalemQueryResponse.AnaBaslikID;
                        gbwdtResponse.ParaBirimi = kalemQueryResponse.Code;
                        gbwdtResponse.ToplamTutar = kalemQueryResponse.Total;

                        gbwdResponse.Totals.Add(gbwdtResponse);
                        #endregion

                        #region Details

                        #region Chart Model
                        GetBaslikWithDateChartModel gbwdcm = new GetBaslikWithDateChartModel();
                        gbwdcm.Name = kalemQueryResponse.Code;
                        gbwdcm.TrueValue = kalemQueryResponse.Total;

                        using (var client = new HttpClient())
                        {
                            var responseTask = client.GetAsync("https://api.exchangeratesapi.io/latest?base=" + kalemQueryResponse.Code.ToUpper() + "&symbols=TRY");

                            var result = responseTask.Result;

                            if (result.IsSuccessStatusCode)
                            {
                                var readTask = result.Content.ReadAsStringAsync();
                                readTask.Wait();
                                var jsonString = readTask.Result;
                                jsonString = jsonString.Remove(0, jsonString.LastIndexOf(':') + 1);
                                jsonString = jsonString.Remove(jsonString.Length - 2);
                                var currencyExchangeResult = JsonConvert.DeserializeObject<double>(jsonString);

                                gbwdcm.Value = currencyExchangeResult * kalemQueryResponse.Total;
                            }
                        }
                        #endregion

                        GetBaslikWithDateDetail gbwdd = gbwdResponse.Details.SingleOrDefault(s => s.AnaBaslikID == kalemQueryResponse.AnaBaslikID);

                        if (gbwdd == null)
                        {
                            gbwdd = new GetBaslikWithDateDetail();
                            gbwdd.AnaBaslikID = kalemQueryResponse.AnaBaslikID;
                            gbwdd.AnaBaslikTanim = dapperRepository.Query<string>($"SELECT BaslikTanimi FROM anabasliktable WHERE ID='{kalemQueryResponse.AnaBaslikID}'").FirstOrDefault();

                            gbwdResponse.Details.Add(gbwdd);
                        }
                        gbwdd.ChartModels.Add(gbwdcm);

                        GetBaslikWithDateContents gbwdc = new GetBaslikWithDateContents();
                        gbwdc.ParaBirimi = kalemQueryResponse.Code;

                        for (int i = 0; i < 15; i++)
                        {
                            gbwdc.CurrencyDates.Add(new GetBaslikWithDateCurrencyDate { VadeTarihi = gbwdFormData.BaslangicTarihi.AddDays(i), Tutar = 0 });
                        }

                        gbwdc.CurrencyDates.SingleOrDefault(w => w.VadeTarihi.ToShortDateString().Equals(kalemQueryResponse.VadeTarihi.ToShortDateString())).Tutar += kalemQueryResponse.Total;

                        gbwdd.Contents.Add(gbwdc);
                        #endregion


                        #endregion
                    }

                }
                else if (gbwdFormData.FilterType.ToLower() == "w")
                {
                    var weeklyQuery = string.Empty;

                    if (gbwdFormData.AnaBaslikID == "all")
                        weeklyQuery = $"SELECT WEEK(kt.VadeTarihi) as 'Week',kt.AnaBaslikID,SUM(pbk.Tutar) as 'Total',pb.Code,pb.ID,kt.VadeTarihi " +
                            $"FROM parabirimikalemtable as pbk " +
                            $"JOIN parabirimitable as pb ON pbk.ParaBirimiID = pb.ID " +
                            $"JOIN kalemtable AS kt ON kt.ID = pbk.KalemID " +
                            $"WHERE VadeTarihi >= STR_TO_DATE('{gbwdFormData.BaslangicTarihi.ToString("yyy-MM-dd")}') and VadeTarihi <= {gbwdFormData.BaslangicTarihi.AddDays(105).ToString("yyyy-MM-dd")} " +
                            $"GROUP BY kt.AnaBaslikID,pb.Code,WEEK(kt.VadeTarihi)";

                    else
                        weeklyQuery = $"SELECT WEEK(kt.VadeTarihi) as 'Week',kt.AnaBaslikID,SUM(pbk.Tutar) as 'Total',pb.Code,pb.ID,kt.VadeTarihi " +
                            $"FROM parabirimikalemtable as pbk " +
                            $"JOIN parabirimitable as pb ON pbk.ParaBirimiID = pb.ID " +
                            $"JOIN kalemtable AS kt ON kt.ID = pbk.KalemID " +
                            $"WHERE AnaBaslikID='{gbwdFormData.AnaBaslikID}' AND VadeTarihi >= STR_TO_DATE('{gbwdFormData.BaslangicTarihi.ToString("yyy-MM-dd")}') and VadeTarihi <= {gbwdFormData.BaslangicTarihi.AddDays(105).ToString("yyyy-MM-dd")} " +
                            $"GROUP BY kt.AnaBaslikID,pb.Code,WEEK(kt.VadeTarihi)";

                    var filtrelenmisKalemlerWeekly = dapperRepository.Query<Kalem>(weeklyQuery);


                    foreach(var kalemWeeekly in filtrelenmisKalemlerWeekly)
                    {

                    }



            //        foreach (var baslikGrupKalemWeekly in basliklaGruplanmisKalemlerWeekly)
            //        {
            //            //    GetBaslikWithDateResponse gbwdResponse = new GetBaslikWithDateResponse()
            //            //    {
            //            //        AnaBaslikID = baslikGrupKalemWeekly.Key,
            //            //        AnaBaslikAciklama = dapperRepository.Query<string>($"SELECT BaslikTanimi FROM anabasliktable WHERE ID='{baslikGrupKalemWeekly.Key}'").FirstOrDefault()
            //            //    };

            //            var tarihGruplanmisKalemler = baslikGrupKalemWeekly.GroupBy(i => CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(
            //i.VadeTarihi, CalendarWeekRule.FirstDay, CultureInfo.CurrentCulture.Calendar.GetDayOfWeek(i.VadeTarihi)));

            //            foreach (var tarihGruplanmisKalem in tarihGruplanmisKalemler)
            //            {
            //                foreach (var tarihKurGrupKalem in tarihGruplanmisKalem.GroupBy(g => g.ParaBirimiKalem.ParaBirimi.Kur))
            //                {
            //                    double total = 0;

            //                    foreach (var tarihKurKalem in tarihKurGrupKalem)
            //                    {
            //                        total += tarihKurKalem.Tutar;
            //                    }
            //                    ParaBirimiTutarTemp pbt = new ParaBirimiTutarTemp()
            //                    {
            //                        //ParaBirimi = paraBirimiManager.SingleGetBy(b => b.Kur == tarihKurGrupKalem.Key),
            //                        Tutar = total
            //                    };
            //                    //gbwdResponse.ParaBirimiTutarlar.Add(pbt);
            //                    //gbwdList.Add(gbwdResponse);
            //                }
            //            }
            //        }
                }
                else if (gbwdFormData.FilterType.ToLower() == "m")
                {
                    List<Kalem> filtrelenmisKalemler = null;//kalemManager.GetBy(w => w.VadeTarihi.CompareTo(gbwdFormData.BaslangicTarihi) >= 0 && w.VadeTarihi.CompareTo(gbwdFormData.BaslangicTarihi.AddMonths(105)) <= 0);
                    var basliklaGruplanmisKalemler = filtrelenmisKalemler.GroupBy(g => g.AnaBaslik);

                    foreach (var baslikGrupKalem in basliklaGruplanmisKalemler)
                    {
                        //GetBaslikWithDateResponse gbwdResponse = new GetBaslikWithDateResponse()
                        //{
                        //    AnaBaslikID = baslikGrupKalem.Key.ID,
                        //    AnaBaslikAciklama = baslikGrupKalem.Key.BaslikTanimi
                        //};

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
                                ParaBirimiTutarTemp pbt = new ParaBirimiTutarTemp()
                                {
                                    //ParaBirimi = paraBirimiManager.SingleGetBy(b => b.Kur == tarihKurGrupKalem.Key),
                                    Tutar = total
                                };
                                //gbwdResponse.ParaBirimiTutarlar.Add(pbt);
                                //gbwdList.Add(gbwdResponse);
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
            response.Object = gbwdResponse;/*gbwdList;*/

            return response;
        }

        public ResponseObject<Kalem> CreateKalemDapper(AddKalemFormData kalemFormData)
        {
            ResponseObject<Kalem> response = new ResponseObject<Kalem>();

            try
            {
                Kalem kalem = base.AdvancedMap<AddKalemFormData, Kalem>(kalemFormData);
                Dictionary<Type, bool> isUpdatedDictionary = new Dictionary<Type, bool>();
                isUpdatedDictionary.Add(typeof(TekliBaslik), false);


                var kalemIDQuery = $"SELECT DISTINCT KalemID FROM {dbName}.kalemtable;";
                string ID = FakeData.TextData.GetAlphaNumeric(30);
                var kalemIDList = dapperRepository.Query<string>(kalemIDQuery);

                while (kalemIDList.Contains(ID))
                {
                    ID = FakeData.TextData.GetAlphaNumeric(30);
                }
                kalem.ID = ID;

                #region Para Birimi Kalem
                ParaBirimiKalem pbk = new ParaBirimiKalem();
                pbk.ID = kalem.ID;
                kalem.ParaBirimiKalemID = pbk.ID;
                kalem.KalemTipiSymbol = kalem.KalemTipiAciklama == "Gelir" ? "+" : "-";

                var paraBirimiQuery = $"SELECT ID FROM {dbName}.ParaBirimiTable WHERE Code='{kalemFormData.ParaBirimi}'";
                pbk.ParaBirimiID = dapperRepository.Query<int>(paraBirimiQuery).FirstOrDefault();
                pbk.Tutar = kalem.Tutar;


                var pbkInsertQuery = $"INSERT INTO parabirimikalemtable (ID,ParaBirimiID,Tutar) VALUES ('{pbk.ID}',{pbk.ParaBirimiID},{pbk.Tutar})";

                dapperRepository.Execute(pbkInsertQuery);
                //paraBirimiKalemManager.Add(pbk);

                #endregion

                #region Ana Başlık Ops
                var anaBaslikQuery = $"SELECT * FROM {dbName}.anabasliktable WHERE ID='{kalemFormData.AnaBaslikID}'";
                AnaBaslik anaBaslik = dapperRepository.Query<AnaBaslik>(anaBaslikQuery).FirstOrDefault();

                if (anaBaslik == null)
                {
                    var anaBaslikIDQuery = $"SELECT DISTINCT ID FROM {dbName}.anabasliktable;";
                    string anaBaslikID = FakeData.TextData.GetAlphaNumeric(30);
                    var anaBaslikIDList = dapperRepository.Query<string>(anaBaslikIDQuery);

                    while (anaBaslikIDList.Contains(anaBaslikID))
                    {
                        anaBaslikID = FakeData.TextData.GetAlphaNumeric(30);
                    }

                    anaBaslik = new AnaBaslik();
                    anaBaslik = base.AdvancedMap<AddKalemFormData, AnaBaslik>(kalemFormData);

                    kalem.AnaBaslikID = anaBaslikID;
                    anaBaslik.ID = anaBaslikID;
                    //dapperRepository.Insert<AnaBaslik>(anaBaslik);
                }
                else
                {
                    if (anaBaslik.IsVadeIliskili)
                        kalem.VadeTarihi = DateTime.Now;

                    //dapperRepository.Update<Kalem>(kalem);
                    //isUpdatedDictionary[typeof(AnaBaslik)]
                }
                #endregion

                #region Başlık Ops
                var tekliBaslikQuery = $"SELECT * FROM {dbName}.teklibasliktable WHERE ID='{kalemFormData.AnaBaslikID}'";

                TekliBaslik tekliBaslik = dapperRepository.Query<TekliBaslik>(tekliBaslikQuery).FirstOrDefault();
                if (tekliBaslik == null)
                {
                    tekliBaslik = new TekliBaslik();

                    var tekliBaslikIDQuery = $"SELECT DISTINCT ID FROM {dbName}.teklibasliktable;";
                    string tekliBaslikID = anaBaslik.ID;

                    tekliBaslik.ID = tekliBaslikID;
                    tekliBaslik.FlowDirectionExplanation = kalemFormData.KalemTipiAciklama;
                    tekliBaslik.FlowDirectionSymbol = kalemFormData.KalemTipiAciklama == "Gelir" ? "+" : "-";

                    tekliBaslik.Title = anaBaslik.BaslikTanimi;
                    //anaBaslik.TekliBaslikID = tekliBaslik.ID;

                    kalem.TekliBaslikID = tekliBaslik.ID;
                    var tbInsertQuery = $"INSERT INTO teklibasliktable (ID,FlowDirectionSymbol,FlowDirectionExplanation,Title) " +
                        $"VALUES ('{tekliBaslik.ID}','{tekliBaslik.FlowDirectionSymbol}','{tekliBaslik.FlowDirectionExplanation}','{tekliBaslik.Title}')";

                    dapperRepository.Execute(tbInsertQuery);
                }
                else
                {
                    //tekliBaslik.ID = anaBaslik.ID;
                    //anaBaslik.TekliBaslikID = tekliBaslik.ID;
                    kalem.TekliBaslikID = tekliBaslik.ID;
                    //var tekliBaslikUpdateQuery = $"UPDATE teklibasliktable SET" +
                    //    $"AnaBaslikID='{tekliBaslik.ID}' WHERE ID='{tekliBaslik.ID}'";


                    //dapperRepository.Execute(tekliBaslikUpdateQuery);
                }


                #endregion

                #region Para Birimi Tutar Ops
                var paraBirimiTutarQuery = @"SELECT * FROM parabirimitutartable as pbt 
                                    WHERE pbt.TekliBaslikID='" + tekliBaslik.ID + "' AND " +
                                    "pbt.ParaBirimiID=(SELECT ID FROM parabirimitable as pb WHERE pb.Code='" + kalemFormData.ParaBirimi + "')";

                ParaBirimiTutar pbt = dapperRepository.Query<ParaBirimiTutar>(paraBirimiTutarQuery).FirstOrDefault();
                //tekliBaslik.Currencies.SingleOrDefault(w => w.ParaBirimi.Code == kalemFormData.ParaBirimi);
                if (pbt == null)
                {
                    pbt = new ParaBirimiTutar();

                    var paraBirimiIDQuery = $"SELECT DISTINCT KalemID FROM {dbName}.kalemtable;";
                    string paraBirimiID = FakeData.TextData.GetAlphaNumeric(30);
                    var paraBirimiIDList = dapperRepository.Query<string>(paraBirimiIDQuery);

                    while (paraBirimiIDList.Contains(paraBirimiID))
                    {
                        paraBirimiID = FakeData.TextData.GetAlphaNumeric(30);
                    }

                    pbt.TekliBaslikID = tekliBaslik.ID;

                    pbt.ParaBirimiID = pbk.ParaBirimiID;
                    pbt.Tutar += kalemFormData.Tutar;

                    var pbtInsertQuery = $"INSERT INTO parabirimitutartable (ID,ParaBirimiID,Tutar) VALUES ('{pbt.ID}',{pbt.ParaBirimiID},{pbt.Tutar})";


                    dapperRepository.Execute(pbtInsertQuery);
                }
                else
                {
                    pbt.Tutar += kalemFormData.Tutar;

                    var paraBirimiTutarUpdateQuery = $"UPDATE parabirimitutartable SET " +
                       $"Tutar={pbt.Tutar} WHERE ID={pbt.ID}";

                    dapperRepository.Execute(paraBirimiTutarUpdateQuery);
                }
                #endregion

                #region Ekleyen ve Duzenleyen User Ops
                //var userQuery = $"SELECT * FROM usertable WHERE ID={kalemFormData.EkleyenUserID}";
                //User ekleyenUser = dapperRepository.Query<User>(userQuery).FirstOrDefault(); /*userManager.GetByID(kalemFormData.EkleyenUserID)*/

                kalem.EkleyenUserID = kalemFormData.EkleyenUserID;

                #endregion

                var anaBaslikInsertQuery = $"INSERT INTO anabasliktable (ID,BaslikTanimi,IsVadeIliskili,SirketKodu)" +
                    $"VALUES ('{anaBaslik.ID}','{anaBaslik.BaslikTanimi}',{anaBaslik.IsVadeIliskili},'{anaBaslik.SirketKodu}')";

                //dapperRepository.Execute(anaBaslikInsertQuery);

                Dictionary<string, string> ekAlanlarDict = new Dictionary<string, string>();
                ekAlanlarDict.Add("EkAlan1", kalem.EkAlan1);
                ekAlanlarDict.Add("EkAlan2", kalem.EkAlan2);
                ekAlanlarDict.Add("EkAlan3", kalem.EkAlan3);
                ekAlanlarDict.Add("EkAlan4", kalem.EkAlan4);
                ekAlanlarDict.Add("EkAlan5", kalem.EkAlan5);

                Dictionary<string, string> filteredEkAlanlarDict = new Dictionary<string, string>();

                foreach (var pair in ekAlanlarDict)
                {
                    if (pair.Value != null)
                    {
                        filteredEkAlanlarDict.Add(pair.Key, pair.Value);
                    }
                }

                kalem.DuzenlemeTarihi = DateTime.Now;
                kalem.EklemeTarihi = DateTime.Now;
                kalem.DuzenleyenUserID = kalemFormData.EkleyenUserID;


                var kalemInsertQuery = $"INSERT INTO kalemtable (KalemID,FaturaTarihi,VadeTarihi,EklemeTarihi,DuzenlemeTarihi,DuzenleyenUserID,EkleyenUserID,IsTahmin,Aciklama,TekliBaslikID,AnaBaslikID," +
                    $"ParaBirimiKalemID,IsUserCreation,KalemTipiAciklama,KalemTipiSymbol,Tutar,";

                foreach (var filteredPair in filteredEkAlanlarDict)
                {
                    kalemInsertQuery += filteredPair.Key + ",";
                }


                kalemInsertQuery = kalemInsertQuery.Remove(kalemInsertQuery.LastIndexOf(','));
                kalemInsertQuery += $") VALUES ('{kalem.ID}','{kalem.FaturaTarihi.ToString("yyyy-MM-dd HH:mm:ss")}','{kalem.VadeTarihi.ToString("yyyy-MM-dd HH:mm:ss")}','{kalem.EklemeTarihi.ToString("yyyy-MM-dd HH:mm:ss")}'," +
                    $"'{kalem.DuzenlemeTarihi.Value.ToString("yyyy-MM-dd HH:mm:ss")}',{kalem.DuzenleyenUserID},{kalem.EkleyenUserID},{kalem.IsTahmin},'{kalem.Aciklama}','{kalem.TekliBaslikID}'," +
                    $"'{kalem.AnaBaslikID}','{kalem.ParaBirimiKalemID}',{kalem.IsUserCreation},'{kalem.KalemTipiAciklama}','{kalem.KalemTipiSymbol}',{kalem.Tutar},";


                foreach (var filteredPair in filteredEkAlanlarDict)
                {
                    kalemInsertQuery += "'" + filteredPair.Value + "',";
                }
                kalemInsertQuery = kalemInsertQuery.Remove(kalemInsertQuery.Count() - 1);
                kalemInsertQuery += $")";

                dapperRepository.Execute(kalemInsertQuery);

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

        public ResponseObject<GetAnaBaslikFormData> CreateAnaBaslikDapper(AddAnaBaslikRequestObject requestObject)
        {
            ResponseObject<GetAnaBaslikFormData> response = new ResponseObject<GetAnaBaslikFormData>();

            try
            {
                string ID = string.Empty;
                string anaBaslikIDQuery = string.Empty;
                string anaBaslikIDFromDb = string.Empty;

                do
                {
                    ID = FakeData.TextData.GetAlphaNumeric(30);
                    anaBaslikIDQuery = $"SELECT ID FROM anabasliktable WHERE ID={ID}";
                    dapperRepository.Query<string>(anaBaslikIDQuery).FirstOrDefault();
                }
                while (!String.IsNullOrEmpty(anaBaslikIDFromDb));

                var anaBaslikInsertQuery = $"INSERT INTO anabasliktable (ID,BaslikTanimi,IsVadeIliskili,SirketKodu) VALUES ({ID},{requestObject.Title},{requestObject.IsVadeIliskili},{requestObject.SirketKodu})";

                response.IsSuccess = true;
                response.Object = new GetAnaBaslikFormData() { ID = ID, BaslikTanimi = requestObject.Title };
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


        #region GET
        //public ResponseObject<List<Kalem>> GetAllKalemler()
        //{
        //    ResponseObject<List<Kalem>> response = new ResponseObject<List<Kalem>>();

        //    try
        //    {
        //        response.Object = kalemManager.GetAll();
        //        response.IsSuccess = true;
        //        response.StatusCode = "200";
        //        response.Explanation = "Success";
        //    }
        //    catch (Exception ex)
        //    {
        //        response.IsSuccess = false;
        //        response.Explanation = ex.Message;
        //        response.StatusCode = "400";
        //    }
        //    return response;
        //}

        //public ResponseObject<List<ParaBirimi>> GetAllParaBirimi()
        //{
        //    ResponseObject<List<ParaBirimi>> response = new ResponseObject<List<ParaBirimi>>();

        //    try
        //    {
        //        response.Object = dummyData.GetParaBirimleri();//paraBirimiManager.GetAll();
        //        response.IsSuccess = true;
        //        response.StatusCode = "200";
        //        response.Explanation = "Success";
        //    }
        //    catch (Exception ex)
        //    {
        //        response.IsSuccess = false;
        //        response.Explanation = ex.Message;
        //        response.StatusCode = "400";
        //    }
        //    return response;
        //}

        //public ResponseObject<GetBaslikFormData> GetAllBaslik()
        //{
        //    return null;
        //    //ResponseObject<GetBaslikFormData> response = new ResponseObject<GetBaslikFormData>();
        //    //GetBaslikFormData gbFormData = new GetBaslikFormData();
        //    //List<TekliBaslik> baslikList = new List<TekliBaslik>();
        //    //List<Kalem> kalemList = kalemManager.GetAll();
        //    //List<string> pbkKurList = kalemList.Select(s => s.ParaBirimiKalem.ParaBirimi.Kur).Distinct().ToList();
        //    //List<ParaBirimiTutarTemp> pbtList = new List<ParaBirimiTutarTemp>();

        //    //for (int i = 0; i < pbkKurList.Count; i++)
        //    //{
        //    //    pbtList.Add(new ParaBirimiTutar { ParaBirimi = pbkKurList[i], Tutar = 0 });
        //    //}

        //    //try
        //    //{
        //    //    foreach (var grup in kalemList.GroupBy(g => g.AnaBaslikID))
        //    //    {
        //    //        TekliBaslik baslik = new TekliBaslik();

        //    //        baslik.Currencies.AddRange(pbtList);

        //    //        foreach (var kalem in grup)
        //    //        {
        //    //            baslik.ID = kalem.AnaBaslikID;
        //    //            baslik.FlowDirectionExplanation = kalem.KalemTipiAciklama;
        //    //            baslik.FlowDirectionSymbol = kalem.KalemTipiAciklama == "Gelir" ? "+" : "-";
        //    //            baslik.Title = kalem.AnaBaslik.BaslikTanimi;

        //    //            pbtList.SingleOrDefault(w => w.ParaBirimi.Kur == kalem.ParaBirimiKalem.ParaBirimi.Kur).Tutar += kalem.Tutar;
        //    //            baslik.Currencies.SingleOrDefault(w => w.ParaBirimi.Kur == kalem.ParaBirimiKalem.ParaBirimi.Kur).Tutar = kalem.Tutar;

        //    //        }
        //    //        baslikList.Add(baslik);
        //    //    }
        //    //}
        //    //catch (Exception ex)
        //    //{
        //    //    response.IsSuccess = false;
        //    //    response.StatusCode = "400";
        //    //    response.Explanation = ex.Message;
        //    //}

        //    ////gbFormData.Basliklar = baslikList;
        //    //gbFormData.TotalParaBirimiTutar = pbtList;

        //    //response.StatusCode = "200";
        //    //response.Explanation = "Success";
        //    //response.IsSuccess = true;
        //    //response.Object = gbFormData;
        //    //return response;
        //}


        //public ResponseObject<List<GetAnaBaslikFormData>> GetAllAnaBasliklar()
        //{
        //    ResponseObject<List<GetAnaBaslikFormData>> response = new ResponseObject<List<GetAnaBaslikFormData>>();

        //    try
        //    {
        //        List<GetAnaBaslikFormData> gabfdList = anaBaslikManager.GetAllQueryable().Select(s => new GetAnaBaslikFormData { ID = s.ID, BaslikTanimi = s.BaslikTanimi }).ToList();
        //        response.Explanation = "success";
        //        response.IsSuccess = true;
        //        response.Object = gabfdList;
        //        response.StatusCode = "200";
        //    }
        //    catch (Exception ex)
        //    {
        //        response.IsSuccess = false;
        //        response.StatusCode = "400";
        //        response.Explanation = ex.Message;
        //    }
        //    return response;
        //}

        //public ResponseObject<List<GetBaslikFormData>> GetGiderBaslik()
        //{
        //    ResponseObject<List<GetBaslikFormData>> response = new ResponseObject<List<GetBaslikFormData>>();

        //    try
        //    {
        //        List<TekliBaslik> baslikList = new List<TekliBaslik>();

        //        foreach (var grup in kalemManager.GetAll().Where(w => w.KalemTipiAciklama == "Gider").GroupBy(g => g.AnaBaslikID))
        //        {
        //            TekliBaslik baslik = new TekliBaslik();
        //            foreach (var kalem in grup)
        //            {
        //                baslik.FlowDirectionExplanation = kalem.KalemTipiAciklama;
        //                baslik.Title = kalem.AnaBaslik.BaslikTanimi;

        //                baslik.Currencies.Add(new ParaBirimiTutar { ParaBirimi = paraBirimiManager.SingleGetBy(b => b.Kur == kalem.ParaBirimiKalem.ParaBirimi.Kur), Tutar = kalem.Tutar });

        //            }
        //            baslikList.Add(baslik);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        response.IsSuccess = false;
        //        response.StatusCode = "400";
        //        response.Explanation = ex.Message;
        //    }
        //    response.StatusCode = "200";
        //    response.Explanation = "Success";
        //    return response;
        //}

        //public ResponseObject<List<GetBaslikFormData>> GetGelirBaslik()
        //{
        //    ResponseObject<List<GetBaslikFormData>> response = new ResponseObject<List<GetBaslikFormData>>();

        //    try
        //    {
        //        List<GetBaslikFormData> gbfdList = new List<GetBaslikFormData>();

        //        List<TekliBaslik> baslikList = new List<TekliBaslik>();

        //        foreach (var grup in kalemManager.GetAllQueryable().Where(w => w.KalemTipiAciklama == "Gelir").GroupBy(g => g.AnaBaslikID))
        //        {
        //            TekliBaslik baslik = new TekliBaslik();
        //            foreach (var kalem in grup)
        //            {
        //                baslik.FlowDirectionExplanation = kalem.KalemTipiAciklama;
        //                baslik.Title = kalem.AnaBaslik.BaslikTanimi;

        //                baslik.Currencies.Add(new ParaBirimiTutar { ParaBirimi = paraBirimiManager.SingleGetBy(b => b.Kur == kalem.ParaBirimiKalem.ParaBirimi.Kur), Tutar = kalem.Tutar });
        //            }

        //            baslikList.Add(baslik);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        response.IsSuccess = false;
        //        response.StatusCode = "400";
        //        response.Explanation = ex.Message;
        //    }
        //    response.StatusCode = "200";
        //    response.Explanation = "Success";
        //    return response;

        //}

        //public List<ParaBirimiTutar> GetTotalParaBirimiTutar(TekliBaslik baslik)
        //{
        //    List<ParaBirimiTutar> totalParaBirimiTutar = new List<ParaBirimiTutar>();

        //    foreach (var pbt in baslik.Currencies.GroupBy(g => g.ParaBirimi))
        //    {
        //        ParaBirimiTutar newPtb = new ParaBirimiTutar();
        //        newPtb.ParaBirimi = pbt.Key;

        //        foreach (var money in pbt)
        //        {
        //            newPtb.Tutar += money.Tutar;
        //        }
        //        totalParaBirimiTutar.Add(newPtb);
        //    }

        //    return totalParaBirimiTutar;
        //}

        //public ResponseObject<List<GetBaslikWithDateResponse>> GetAllBasliklarWithDate(GetBaslikWithDateFormData gbwdFormData)
        //{
        //    ResponseObject<List<GetBaslikWithDateResponse>> response = new ResponseObject<List<GetBaslikWithDateResponse>>();
        //    List<GetBaslikWithDateResponse> gbwdList = new List<GetBaslikWithDateResponse>();

        //    try
        //    {
        //        if (gbwdFormData.FilterType.ToLower() == "d")
        //        {
        //            List<Kalem> filtrelenmisKalemler = kalemManager.GetBy(w => w.VadeTarihi.CompareTo(gbwdFormData.BaslangicTarihi) >= 0 && w.VadeTarihi.CompareTo(gbwdFormData.BaslangicTarihi.AddDays(15)) <= 0);
        //            var basliklaGruplanmisKalemler = filtrelenmisKalemler.GroupBy(g => g.AnaBaslik);

        //            foreach (var baslikGrupKalem in basliklaGruplanmisKalemler)
        //            {
        //                GetBaslikWithDateResponse gbwdResponse = new GetBaslikWithDateResponse()
        //                {
        //                    AnaBaslikID = baslikGrupKalem.Key.ID,
        //                    AnaBaslikAciklama = baslikGrupKalem.Key.BaslikTanimi
        //                };

        //                foreach (var kurGrupKalem in baslikGrupKalem.GroupBy(g => g.ParaBirimiKalem.ParaBirimi.Kur))
        //                {
        //                    double total = 0;

        //                    foreach (var tarihKurKalem in kurGrupKalem)
        //                    {
        //                        total += tarihKurKalem.Tutar;
        //                    }

        //                    ParaBirimiTutar pbt = new ParaBirimiTutar()
        //                    {
        //                        ParaBirimi = paraBirimiManager.SingleGetBy(b => b.Kur == kurGrupKalem.Key),
        //                        Tutar = total
        //                    };
        //                    gbwdResponse.ParaBirimiTutarlar.Add(pbt);
        //                    gbwdList.Add(gbwdResponse);
        //                }
        //            }
        //        }
        //        else if (gbwdFormData.FilterType.ToLower() == "w")
        //        {
        //            List<Kalem> filtrelenmisKalemler = kalemManager.GetBy(w => w.VadeTarihi.CompareTo(gbwdFormData.BaslangicTarihi) >= 0 && w.VadeTarihi.CompareTo(gbwdFormData.BaslangicTarihi.AddDays(105)) <= 0);
        //            var basliklaGruplanmisKalemler = filtrelenmisKalemler.GroupBy(g => g.AnaBaslik);

        //            foreach (var baslikGrupKalem in basliklaGruplanmisKalemler)
        //            {
        //                GetBaslikWithDateResponse gbwdResponse = new GetBaslikWithDateResponse()
        //                {
        //                    AnaBaslikID = baslikGrupKalem.Key.ID,
        //                    AnaBaslikAciklama = baslikGrupKalem.Key.BaslikTanimi
        //                };

        //                var tarihGruplanmisKalemler = baslikGrupKalem.GroupBy(i => CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(
        //    i.VadeTarihi, CalendarWeekRule.FirstDay, CultureInfo.CurrentCulture.Calendar.GetDayOfWeek(i.VadeTarihi)));

        //                foreach (var tarihGruplanmisKalem in tarihGruplanmisKalemler)
        //                {
        //                    foreach (var tarihKurGrupKalem in tarihGruplanmisKalem.GroupBy(g => g.ParaBirimiKalem.ParaBirimi.Kur))
        //                    {
        //                        double total = 0;

        //                        foreach (var tarihKurKalem in tarihKurGrupKalem)
        //                        {
        //                            total += tarihKurKalem.Tutar;
        //                        }
        //                        ParaBirimiTutar pbt = new ParaBirimiTutar()
        //                        {
        //                            ParaBirimi = paraBirimiManager.SingleGetBy(b => b.Kur == tarihKurGrupKalem.Key),
        //                            Tutar = total
        //                        };
        //                        gbwdResponse.ParaBirimiTutarlar.Add(pbt);
        //                        gbwdList.Add(gbwdResponse);
        //                    }
        //                }
        //            }
        //        }
        //        else if (gbwdFormData.FilterType.ToLower() == "m")
        //        {
        //            List<Kalem> filtrelenmisKalemler = kalemManager.GetBy(w => w.VadeTarihi.CompareTo(gbwdFormData.BaslangicTarihi) >= 0 && w.VadeTarihi.CompareTo(gbwdFormData.BaslangicTarihi.AddMonths(105)) <= 0);
        //            var basliklaGruplanmisKalemler = filtrelenmisKalemler.GroupBy(g => g.AnaBaslik);

        //            foreach (var baslikGrupKalem in basliklaGruplanmisKalemler)
        //            {
        //                GetBaslikWithDateResponse gbwdResponse = new GetBaslikWithDateResponse()
        //                {
        //                    AnaBaslikID = baslikGrupKalem.Key.ID,
        //                    AnaBaslikAciklama = baslikGrupKalem.Key.BaslikTanimi
        //                };

        //                var tarihGruplanmisKalemler = baslikGrupKalem.GroupBy(g => g.VadeTarihi.Month);

        //                foreach (var tarihGruplanmisKalem in tarihGruplanmisKalemler)
        //                {
        //                    foreach (var tarihKurGrupKalem in tarihGruplanmisKalem.GroupBy(g => g.ParaBirimiKalem.ParaBirimi.Kur))
        //                    {
        //                        double total = 0;

        //                        foreach (var tarihKurKalem in tarihKurGrupKalem)
        //                        {
        //                            total += tarihKurKalem.Tutar;
        //                        }
        //                        ParaBirimiTutar pbt = new ParaBirimiTutar()
        //                        {
        //                            ParaBirimi = paraBirimiManager.SingleGetBy(b => b.Kur == tarihKurGrupKalem.Key),
        //                            Tutar = total
        //                        };
        //                        gbwdResponse.ParaBirimiTutarlar.Add(pbt);
        //                        gbwdList.Add(gbwdResponse);
        //                    }
        //                }
        //            }
        //        }
        //        else
        //        {
        //            response.IsSuccess = false;
        //            response.StatusCode = "400";
        //            response.Explanation = "Yanlış Filtreleme Tipi.. Filtreleme tipi yalnızca \"d\",\"w\",\"m\" olabilir";
        //            return response;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        response.IsSuccess = false;
        //        response.Explanation = ex.Message;
        //        response.StatusCode = "400";
        //    }


        //    response.StatusCode = "200";
        //    response.Explanation = "Success";
        //    response.IsSuccess = true;
        //    response.Object = gbwdList;

        //    return response;
        //}

        #endregion

        #region CREATE

        #endregion

    }
}
