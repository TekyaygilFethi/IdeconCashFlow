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
using System.Linq;
using System.Net.Http;

namespace IdeconCashFlow.Business.ManagerFolder.ComplexManagerFolder
{
    public class CashflowComplexManager : BaseComplexManager
    {
        readonly DapperRepository dapperRepository;

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


                var tekliBaslikQuery = $"SELECT * FROM teklibasliktable;";
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
                    var kalemFilterQuery = $"SELECT * FROM kalemtable WHERE TekliBaslikID = '{baslik.ID}';";
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
                var query = $"SELECT * FROM kalemtable;";
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
                var query = $"SELECT * FROM parabirimitable;";
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
                var query = $"SELECT ID, BaslikTanimi, IsVadeIliskili FROM anabasliktable";
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
                var currencyQuery = $"SELECT DISTINCT Kur FROM parabirimitable;";
                allCurrencies = dapperRepository.Query<string>(currencyQuery);

                var tekliBaslikQuery = $"SELECT * FROM teklibasliktable;";
                tempBaslikList = dapperRepository.Query<TekliBaslikTemp>(tekliBaslikQuery);

                foreach (var kur in allCurrencies)
                {
                    ParaBirimiTutarTemp totalpbt = new ParaBirimiTutarTemp { ParaBirimi = kur, Tutar = 0 };

                    pbtList.Add(totalpbt);
                }
                pbtList.ForEach(each => totalPbtList.Add(new ParaBirimiTutarTemp { ParaBirimi = each.ParaBirimi, Tutar = each.Tutar }));

                foreach (var baslik in tempBaslikList)
                {
                    var kalemFilterQuery = $"SELECT * FROM kalemtable WHERE TekliBaslikID = '{baslik.ID}';";
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
            var query = $"SELECT ParaBirimiID,TekliBaslikID,Tutar FROM parabirimitutartable WHERE TekliBaslikID= '{baslikID}' GROUP BY TekliBaslikID,ParaBirimiID;";
            var list = dapperRepository.Query<GetTotalParaBirimiTutarFormData>(query);

            foreach (var pbt in list)
            {
                var innerQuery = $"SELECT * FROM parabirimitable WHERE ID={pbt.ParaBirimiID}";
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
            var query = $"SELECT ID,ParaBirimiID,TekliBaslikID,Tutar FROM parabirimitutartable GROUP BY TekliBaslikID,ParaBirimiID;";
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
                        dailyQuery = $"SELECT DAYOFYEAR(kt.VadeTarihi),kt.AnaBaslikID,SUM(pbk.Tutar) as 'Total',pb.Code,pb.ID as 'ParaBirimiID',kt.VadeTarihi " +
                            $"FROM kalemtable as kt " +
                            $"JOIN parabirimikalemtable as pbk ON pbk.KalemID = kt.ID " +
                            $"JOIN parabirimitable as pb ON pbk.ParaBirimiID = pb.ID " +
                            $"WHERE kt.VadeTarihi between '{gbwdFormData.BaslangicTarihi.ToString("yyyy-MM-dd")}' and '{gbwdFormData.BaslangicTarihi.AddDays(15).ToString("yyyy-MM-dd")}' " +
                            $"GROUP BY kt.AnaBaslikID,kt.VadeTarihi, pb.Kur ORDER BY kt.VadeTarihi;";


                    else
                        dailyQuery = $"SELECT DAYOFYEAR(kt.VadeTarihi),kt.AnaBaslikID,SUM(pbk.Tutar) as 'Total',pb.Code,pb.ID as 'ParaBirimiID',kt.VadeTarihi " +
                            $"FROM kalemtable as kt " +
                            $"JOIN parabirimikalemtable as pbk ON pbk.KalemID = kt.ID " +
                            $"JOIN parabirimitable as pb ON pbk.ParaBirimiID = pb.ID " +
                            $"WHERE kt.AnaBaslikID='{gbwdFormData.AnaBaslikID}' and kt.VadeTarihi between '{gbwdFormData.BaslangicTarihi.ToString("yyyy-MM-dd")}' and '{gbwdFormData.BaslangicTarihi.AddDays(15).ToString("yyyy-MM-dd")}' " +
                            $"GROUP BY kt.AnaBaslikID,kt.VadeTarihi, pb.Kur ORDER BY kt.VadeTarihi;";

                    var kalemQueryResponseList = dapperRepository.Query<GetParaBirimiParaBirimiKalemQueryResponse>(dailyQuery);

                    foreach (var kalemQueryResponse in kalemQueryResponseList)
                    {
                        #region Totals
                        GetBaslikWithDateTotals gbwdtResponse = gbwdResponse.Totals.SingleOrDefault(s => s.AnaBaslikID == kalemQueryResponse.AnaBaslikID && s.ParaBirimi == kalemQueryResponse.Code);
                        if (gbwdtResponse == null)
                        {
                            gbwdtResponse = new GetBaslikWithDateTotals();
                            gbwdtResponse.AnaBaslikID = kalemQueryResponse.AnaBaslikID;
                            gbwdtResponse.ParaBirimi = kalemQueryResponse.Code;
                            gbwdtResponse.ToplamTutar = kalemQueryResponse.Total;
                        }
                        else
                        {
                            gbwdtResponse.ToplamTutar += kalemQueryResponse.Total;
                        }

                        gbwdResponse.Totals.Add(gbwdtResponse);
                        #endregion

                        #region Details

                        GetBaslikWithDateDetail gbwdd = gbwdResponse.Details.SingleOrDefault(s => s.AnaBaslikID == kalemQueryResponse.AnaBaslikID);

                        if (gbwdd == null)
                        {
                            gbwdd = new GetBaslikWithDateDetail();
                            gbwdd.AnaBaslikID = kalemQueryResponse.AnaBaslikID;
                            gbwdd.AnaBaslikTanim = dapperRepository.Query<string>($"SELECT BaslikTanimi FROM anabasliktable WHERE ID='{kalemQueryResponse.AnaBaslikID}'").FirstOrDefault();

                            gbwdResponse.Details.Add(gbwdd);
                        }

                        #region Chart Model
                        GetBaslikWithDateChartModel gbwdcm = gbwdd.ChartModels.SingleOrDefault(s => s.Name == kalemQueryResponse.Code);

                        if (gbwdcm == null)
                        {
                            gbwdcm = new GetBaslikWithDateChartModel();
                            gbwdcm.Name = kalemQueryResponse.Code;
                            gbwdd.ChartModels.Add(gbwdcm);
                        }
                        gbwdcm.TrueValue += kalemQueryResponse.Total;

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

                                gbwdcm.Value += currencyExchangeResult * kalemQueryResponse.Total;
                            }
                        }



                        #endregion

                        GetBaslikWithDateContents gbwdc = new GetBaslikWithDateContents();
                        gbwdc.ParaBirimi = kalemQueryResponse.Code;

                        var firstWeekOfYear = dapperRepository.Query<int>($"SELECT WEEK('{gbwdFormData.BaslangicTarihi.ToString("yyyy-MM-dd")}')").FirstOrDefault();

                        for (int i = 0; i < 15; i++)
                        {
                            GetBaslikWithDateCurrencyDate gbwcd = new GetBaslikWithDateCurrencyDate();
                            gbwcd.Tutar = 0;
                            gbwcd.VadeTarihi = gbwdFormData.BaslangicTarihi.AddDays(i);

                            gbwdc.CurrencyDates.Add(gbwcd);
                        }

                        gbwdc.CurrencyDates.SingleOrDefault(w => w.DateIndicator.CompareTo(new DateTime().AddDays(kalemQueryResponse.DateIndicator)) == 0).Tutar += kalemQueryResponse.Total;

                        gbwdd.Contents.Add(gbwdc);
                        #endregion
                    }
                    //    #region Totals
                    //    GetBaslikWithDateTotals gbwdtResponse = gbwdResponse.Totals.SingleOrDefault(s => s.AnaBaslikID == kalemQueryResponse.AnaBaslikID);
                    //    if (gbwdtResponse == null)
                    //    {
                    //        new GetBaslikWithDateTotals();
                    //        gbwdtResponse.AnaBaslikID = kalemQueryResponse.AnaBaslikID;
                    //        gbwdtResponse.ParaBirimi = kalemQueryResponse.Code;
                    //        gbwdtResponse.ToplamTutar = kalemQueryResponse.Total;
                    //    }
                    //    else
                    //    {
                    //        gbwdtResponse.ToplamTutar += kalemQueryResponse.Total;
                    //    }

                    //    gbwdResponse.Totals.Add(gbwdtResponse);
                    //    #endregion
                    //    #region Details



                    //    GetBaslikWithDateDetail gbwdd = gbwdResponse.Details.SingleOrDefault(s => s.AnaBaslikID == kalemQueryResponse.AnaBaslikID);

                    //    if (gbwdd == null)
                    //    {
                    //        gbwdd = new GetBaslikWithDateDetail();
                    //        gbwdd.AnaBaslikID = kalemQueryResponse.AnaBaslikID;
                    //        gbwdd.AnaBaslikTanim = dapperRepository.Query<string>($"SELECT BaslikTanimi FROM anabasliktable WHERE ID='{kalemQueryResponse.AnaBaslikID}'").FirstOrDefault();

                    //        gbwdResponse.Details.Add(gbwdd);
                    //    }
                    //    gbwdd.ChartModels.Add(gbwdcm);


                    //    #region Chart Model
                    //    GetBaslikWithDateChartModel gbwdcm = gbwdd.ChartModels.SingleOrDefault(s => s.Name == kalemWeeekly.Code);

                    //    if (gbwdcm == null)
                    //    {
                    //        gbwdcm = new GetBaslikWithDateChartModel();
                    //        gbwdcm.Name = kalemWeeekly.Code;
                    //        gbwdd.ChartModels.Add(gbwdcm);
                    //    }
                    //    gbwdcm.TrueValue += kalemWeeekly.Total;

                    //    using (var client = new HttpClient())
                    //    {
                    //        var responseTask = client.GetAsync("https://api.exchangeratesapi.io/latest?base=" + kalemQueryResponse.Code.ToUpper() + "&symbols=TRY");

                    //        var result = responseTask.Result;

                    //        if (result.IsSuccessStatusCode)
                    //        {
                    //            var readTask = result.Content.ReadAsStringAsync();
                    //            readTask.Wait();
                    //            var jsonString = readTask.Result;
                    //            jsonString = jsonString.Remove(0, jsonString.LastIndexOf(':') + 1);
                    //            jsonString = jsonString.Remove(jsonString.Length - 2);
                    //            var currencyExchangeResult = JsonConvert.DeserializeObject<double>(jsonString);

                    //            gbwdcm.Value = currencyExchangeResult * kalemQueryResponse.Total;
                    //        }
                    //    }
                    //    #endregion



                    //    GetBaslikWithDateContents gbwdc = new GetBaslikWithDateContents();
                    //    gbwdc.ParaBirimi = kalemQueryResponse.Code;

                    //    for (int i = 0; i < 15; i++)
                    //    {
                    //        gbwdc.CurrencyDates.Add(new GetBaslikWithDateCurrencyDate { VadeTarihi = gbwdFormData.BaslangicTarihi.AddDays(i), Tutar = 0 });
                    //    }

                    //    gbwdc.CurrencyDates.SingleOrDefault(w => w.VadeTarihi.ToShortDateString().Equals(kalemQueryResponse.VadeTarihi.ToShortDateString())).Tutar += kalemQueryResponse.Total;

                    //    gbwdd.Contents.Add(gbwdc);
                    //    #endregion
                    //}

                }
                else if (gbwdFormData.FilterType.ToLower() == "w")
                {
                    var weeklyQuery = string.Empty;

                    #region Queries
                    if (gbwdFormData.AnaBaslikID == "all")
                        weeklyQuery = $"SELECT WEEK(kt.VadeTarihi,DAYOFWEEK(kt.VadeTarihi)) as DateIndicator,kt.AnaBaslikID,SUM(pbk.Tutar) as 'Total',pb.Code,pb.ID,kt.VadeTarihi " +
                            $"FROM parabirimikalemtable as pbk " +
                            $"JOIN parabirimitable as pb ON pbk.ParaBirimiID = pb.ID " +
                            $"JOIN kalemtable AS kt ON kt.ID = pbk.KalemID " +
                            $"WHERE kt.VadeTarihi between '{gbwdFormData.BaslangicTarihi.ToString("yyyy-MM-dd")}' and '{gbwdFormData.BaslangicTarihi.AddDays(105).ToString("yyyy-MM-dd")}' " +
                            $"GROUP BY kt.AnaBaslikID,pb.Code,WEEK(kt.VadeTarihi,DAYOFWEEK(kt.VadeTarihi))";

                    else
                        weeklyQuery = $"SELECT WEEK(kt.VadeTarihi,DAYOFWEEK(kt.VadeTarihi)) as DateIndicator,kt.AnaBaslikID,SUM(pbk.Tutar) as 'Total',pb.Code,pb.ID,kt.VadeTarihi " +
                            $"FROM parabirimikalemtable as pbk " +
                            $"JOIN parabirimitable as pb ON pbk.ParaBirimiID = pb.ID " +
                            $"JOIN kalemtable AS kt ON kt.ID = pbk.KalemID " +
                            $"WHERE AnaBaslikID='{gbwdFormData.AnaBaslikID}' AND kt.VadeTarihi between '{gbwdFormData.BaslangicTarihi.ToString("yyyy-MM-dd")}' and '{gbwdFormData.BaslangicTarihi.AddDays(105).ToString("yyyy-MM-dd")}' " +
                            $"GROUP BY kt.AnaBaslikID,pb.Code,WEEK(kt.VadeTarihi,DAYOFWEEK(kt.VadeTarihi))";

                    var filtrelenmisKalemlerWeekly = dapperRepository.Query<GetParaBirimiParaBirimiKalemQueryResponse>(weeklyQuery);
                    if (filtrelenmisKalemlerWeekly == null)
                        throw new Exception($"Query Error!: Query: {weeklyQuery}");
                    #endregion

                    foreach (var kalemWeeekly in filtrelenmisKalemlerWeekly)
                    {
                        #region Totals
                        GetBaslikWithDateTotals gbwdtResponse = gbwdResponse.Totals.SingleOrDefault(s => s.AnaBaslikID == kalemWeeekly.AnaBaslikID && s.ParaBirimi == kalemWeeekly.Code);
                        if (gbwdtResponse == null)
                        {
                            gbwdtResponse = new GetBaslikWithDateTotals();
                            gbwdtResponse.AnaBaslikID = kalemWeeekly.AnaBaslikID;
                            gbwdtResponse.ParaBirimi = kalemWeeekly.Code;
                            gbwdtResponse.ToplamTutar = kalemWeeekly.Total;
                        }
                        else
                        {
                            gbwdtResponse.ToplamTutar += kalemWeeekly.Total;
                        }

                        gbwdResponse.Totals.Add(gbwdtResponse);
                        #endregion

                        #region Details

                        GetBaslikWithDateDetail gbwdd = gbwdResponse.Details.SingleOrDefault(s => s.AnaBaslikID == kalemWeeekly.AnaBaslikID);

                        if (gbwdd == null)
                        {
                            gbwdd = new GetBaslikWithDateDetail();
                            gbwdd.AnaBaslikID = kalemWeeekly.AnaBaslikID;
                            gbwdd.AnaBaslikTanim = dapperRepository.Query<string>($"SELECT BaslikTanimi FROM anabasliktable WHERE ID='{kalemWeeekly.AnaBaslikID}'").FirstOrDefault();

                            gbwdResponse.Details.Add(gbwdd);
                        }

                        #region Chart Model
                        GetBaslikWithDateChartModel gbwdcm = gbwdd.ChartModels.SingleOrDefault(s => s.Name == kalemWeeekly.Code);

                        if (gbwdcm == null)
                        {
                            gbwdcm = new GetBaslikWithDateChartModel();
                            gbwdcm.Name = kalemWeeekly.Code;
                            gbwdd.ChartModels.Add(gbwdcm);
                        }
                        gbwdcm.TrueValue += kalemWeeekly.Total;

                        using (var client = new HttpClient())
                        {
                            var responseTask = client.GetAsync("https://api.exchangeratesapi.io/latest?base=" + kalemWeeekly.Code.ToUpper() + "&symbols=TRY");

                            var result = responseTask.Result;

                            if (result.IsSuccessStatusCode)
                            {
                                var readTask = result.Content.ReadAsStringAsync();
                                readTask.Wait();
                                var jsonString = readTask.Result;
                                jsonString = jsonString.Remove(0, jsonString.LastIndexOf(':') + 1);
                                jsonString = jsonString.Remove(jsonString.Length - 2);
                                var currencyExchangeResult = JsonConvert.DeserializeObject<double>(jsonString);

                                gbwdcm.Value += currencyExchangeResult * kalemWeeekly.Total;
                            }
                        }



                        #endregion

                        GetBaslikWithDateContents gbwdc = new GetBaslikWithDateContents();
                        gbwdc.ParaBirimi = kalemWeeekly.Code;

                        var firstWeekOfYear = dapperRepository.Query<int>($"SELECT WEEK('{gbwdFormData.BaslangicTarihi.ToString("yyyy-MM-dd")}')").FirstOrDefault();

                        for (int i = 0; i < 15; i++)
                        {
                            GetBaslikWithDateCurrencyDate gbwcd = new GetBaslikWithDateCurrencyDate();
                            gbwcd.Tutar = 0;
                            gbwcd.VadeTarihi = gbwdFormData.BaslangicTarihi.AddDays(i * 7);
                            gbwcd.DateIndicator = new DateTime().AddDays(firstWeekOfYear + i);

                            gbwdc.CurrencyDates.Add(gbwcd);
                        }

                        gbwdc.CurrencyDates.SingleOrDefault(w => w.DateIndicator.CompareTo(new DateTime().AddDays(kalemWeeekly.DateIndicator)) == 0).Tutar += kalemWeeekly.Total;

                        gbwdd.Contents.Add(gbwdc);
                        #endregion
                    }

                }
                else if (gbwdFormData.FilterType.ToLower() == "m")
                {
                    var monthlyQuery = string.Empty;

                    #region Queries
                    if (gbwdFormData.AnaBaslikID == "all")
                        monthlyQuery = $"SELECT date_format(date_sub(kt.VadeTarihi, interval {gbwdFormData.BaslangicTarihi.Day} day),'%Y%m')  as DateIndicator ,kt.AnaBaslikID,SUM(pbk.Tutar) as 'Total',pb.Code,pb.ID,kt.VadeTarihi " +
                            $"FROM parabirimikalemtable as pbk " +
                            $"JOIN parabirimitable as pb ON pbk.ParaBirimiID = pb.ID " +
                            $"JOIN kalemtable AS kt ON kt.ID = pbk.KalemID " +
                            $"WHERE kt.VadeTarihi between '{gbwdFormData.BaslangicTarihi.ToString("yyyy-MM-dd")}' and '{gbwdFormData.BaslangicTarihi.AddMonths(15).ToString("yyyy-MM-dd")}' " +
                            $"GROUP BY kt.AnaBaslikID, pb.Code,DateIndicator;";


                    else
                        monthlyQuery = $"SELECT date_format(date_sub(kt.VadeTarihi, interval {gbwdFormData.BaslangicTarihi.Day} day),'%Y%m') as DateIndicator ,kt.AnaBaslikID,SUM(pbk.Tutar) as 'Total',pb.Code,pb.ID,kt.VadeTarihi " +
                            $"FROM parabirimikalemtable as pbk " +
                            $"JOIN parabirimitable as pb ON pbk.ParaBirimiID = pb.ID " +
                            $"JOIN kalemtable AS kt ON kt.ID = pbk.KalemID " +
                            $"WHERE AnaBaslikID='{gbwdFormData.AnaBaslikID}' AND kt.VadeTarihi between '{gbwdFormData.BaslangicTarihi.ToString("yyyy-MM-dd")}' and '{gbwdFormData.BaslangicTarihi.AddMonths(15).ToString("yyyy-MM-dd")}' " +
                            $"GROUP BY kt.AnaBaslikID, pb.Code,DateIndicator;";


                    var filtrelenmisKalemlerMonthly = dapperRepository.Query<GetParaBirimiParaBirimiKalemQueryResponse>(monthlyQuery);
                    if (filtrelenmisKalemlerMonthly == null)
                        throw new Exception($"Query Error!: Query:{monthlyQuery}");
                    #endregion
                    foreach (var kalemMonthly in filtrelenmisKalemlerMonthly)
                    {
                        #region Totals
                        GetBaslikWithDateTotals gbwdtResponse = new GetBaslikWithDateTotals();
                        gbwdtResponse.AnaBaslikID = kalemMonthly.AnaBaslikID;
                        gbwdtResponse.ParaBirimi = kalemMonthly.Code;
                        gbwdtResponse.ToplamTutar = kalemMonthly.Total;

                        gbwdResponse.Totals.Add(gbwdtResponse);
                        #endregion

                        #region Details

                        #region Chart Model
                        GetBaslikWithDateChartModel gbwdcm = new GetBaslikWithDateChartModel();
                        gbwdcm.Name = kalemMonthly.Code;
                        gbwdcm.TrueValue = kalemMonthly.Total;

                        using (var client = new HttpClient())
                        {
                            var responseTask = client.GetAsync("https://api.exchangeratesapi.io/latest?base=" + kalemMonthly.Code.ToUpper() + "&symbols=TRY");

                            var result = responseTask.Result;

                            if (result.IsSuccessStatusCode)
                            {
                                var readTask = result.Content.ReadAsStringAsync();
                                readTask.Wait();
                                var jsonString = readTask.Result;
                                jsonString = jsonString.Remove(0, jsonString.LastIndexOf(':') + 1);
                                jsonString = jsonString.Remove(jsonString.Length - 2);
                                var currencyExchangeResult = JsonConvert.DeserializeObject<double>(jsonString);

                                gbwdcm.Value = currencyExchangeResult * kalemMonthly.Total;
                            }
                        }
                        #endregion

                        GetBaslikWithDateDetail gbwdd = gbwdResponse.Details.SingleOrDefault(s => s.AnaBaslikID == kalemMonthly.AnaBaslikID);

                        if (gbwdd == null)
                        {
                            gbwdd = new GetBaslikWithDateDetail();
                            gbwdd.AnaBaslikID = kalemMonthly.AnaBaslikID;
                            gbwdd.AnaBaslikTanim = dapperRepository.Query<string>($"SELECT BaslikTanimi FROM anabasliktable WHERE ID='{kalemMonthly.AnaBaslikID}'").FirstOrDefault();

                            gbwdResponse.Details.Add(gbwdd);
                        }
                        gbwdd.ChartModels.Add(gbwdcm);

                        GetBaslikWithDateContents gbwdc = new GetBaslikWithDateContents();
                        gbwdc.ParaBirimi = kalemMonthly.Code;

                        for (int i = 0; i < 15; i++)
                        {
                            gbwdc.CurrencyDates.Add(new GetBaslikWithDateCurrencyDate { DateIndicator = new DateTime().AddMonths(kalemMonthly.DateIndicator + i), VadeTarihi = gbwdFormData.BaslangicTarihi.AddDays(i * 7), Tutar = 0 });
                        }

                        gbwdc.CurrencyDates.SingleOrDefault(w => w.DateIndicator == new DateTime().AddMonths(kalemMonthly.DateIndicator)).Tutar += kalemMonthly.Total;

                        gbwdd.Contents.Add(gbwdc);
                        #endregion
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

                return response;
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


                var kalemIDQuery = $"SELECT DISTINCT KalemID FROM kalemtable;";
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

                var paraBirimiQuery = $"SELECT ID FROM ParaBirimiTable WHERE Code='{kalemFormData.ParaBirimi}'";
                pbk.ParaBirimiID = dapperRepository.Query<int>(paraBirimiQuery).FirstOrDefault();
                pbk.Tutar = kalem.Tutar;


                var pbkInsertQuery = $"INSERT INTO parabirimikalemtable (ID,ParaBirimiID,Tutar) VALUES ('{pbk.ID}',{pbk.ParaBirimiID},{pbk.Tutar})";

                dapperRepository.Execute(pbkInsertQuery);
                //paraBirimiKalemManager.Add(pbk);

                #endregion

                #region Ana Başlık Ops
                var anaBaslikQuery = $"SELECT * FROM anabasliktable WHERE ID='{kalemFormData.AnaBaslikID}'";
                AnaBaslik anaBaslik = dapperRepository.Query<AnaBaslik>(anaBaslikQuery).FirstOrDefault();

                if (anaBaslik == null)
                {
                    var anaBaslikIDQuery = $"SELECT DISTINCT ID FROM anabasliktable;";
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
                var tekliBaslikQuery = $"SELECT * FROM teklibasliktable WHERE ID='{kalemFormData.AnaBaslikID}'";

                TekliBaslik tekliBaslik = dapperRepository.Query<TekliBaslik>(tekliBaslikQuery).FirstOrDefault();
                if (tekliBaslik == null)
                {
                    tekliBaslik = new TekliBaslik();

                    var tekliBaslikIDQuery = $"SELECT DISTINCT ID FROM teklibasliktable;";
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

                    var paraBirimiIDQuery = $"SELECT DISTINCT KalemID FROM kalemtable;";
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
                    $"'{kalem.DuzenlemeTarihi.ToString("yyyy-MM-dd HH:mm:ss")}',{kalem.DuzenleyenUserID},{kalem.EkleyenUserID},{kalem.IsTahmin},'{kalem.Aciklama}','{kalem.TekliBaslikID}'," +
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

    }
}
#endregion