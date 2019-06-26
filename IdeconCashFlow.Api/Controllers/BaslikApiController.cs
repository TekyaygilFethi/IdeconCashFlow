using IdeconCashFlow.Business.ManagerFolder.ComplexManagerFolder;
using IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder;
using IdeconCashFlow.Data.Business.GenericResponse;
using IdeconCashFlow.Data.Business.KalemManagerFormDataFolder;
using IdeconCashFlow.Data.POCO;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Web.Http.Cors;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace IdeconCashFlow.Api.Controllers
{
    [Route("api/Baslik")]
    public class BaslikApiController : Controller
    {
        CashflowComplexManager cashflowManager;

        public BaslikApiController()
        {
            cashflowManager = new CashflowComplexManager();
        }

        #region DUMMY
        //[HttpGet, Route("DummyGetAllBasliklar")]
        //public ResponseObject<GetBaslikFormData> DummyGetAllBasliklar()
        //{
        //    return cashflowManager.GetAllBaslikDummy();
        //}

        //[HttpGet, Route("DummyGetGelirBasliklar")]
        //public ResponseObject<List<GetBaslikFormData>> DummyGetGelirBasliklar()
        //{
        //    return cashflowManager.GetGelirBaslikDummy();
        //}

        //[HttpGet, Route("DummyGetGiderBasliklar")]
        //public ResponseObject<List<GetBaslikFormData>> DummyGetGiderBasliklar()
        //{
        //    return cashflowManager.GetGiderBaslikDummy();
        //}
        #endregion

        // GET: api/<controller>
        [HttpGet, Route("GetAllBasliklar")]
        public ResponseObject<GetBaslikFormData> GetAllBasliklar()
        {
            return cashflowManager.GetAllBasliklar();
        }

        [HttpGet, Route("GetGelirBasliklar")]
        public ResponseObject<List<GetBaslikFormData>> GetGelirBasliklar()
        {
            return cashflowManager.GetGelirBaslik();
        }

        [HttpGet, Route("GetGiderBasliklar")]
        public ResponseObject<List<GetBaslikFormData>> GetGiderBasliklar()
        {
            return cashflowManager.GetGiderBaslik();
        }

        [HttpPost, Route("CreateKalem")]
        public ResponseObject<Kalem> CreateKalem([FromBody]AddKalemFormData kalemFormData)
        {
            return cashflowManager.AddKalem(kalemFormData);
        }

        [HttpGet,Route("GetAllAnaBasliklar")]
        public ResponseObject<List<GetAnaBaslikFormData>> GetAllAnaBasliklar()
        {
            return cashflowManager.GetAllAnaBasliklar();
        }

        [HttpGet,Route("GetBasliklarWithDate")]
        public ResponseObject<List<GetBaslikWithDateResponse>> GetAllBasliklarWithDate(GetBaslikWithDateFormData gbwdFormData)
        {
            return cashflowManager.GetAllBasliklarWithDate(gbwdFormData);
        }

        [HttpGet,Route("GetAllParaBirimleri")]
        public ResponseObject<List<ParaBirimi>> GetAllParaBirimleri()
        {
            return cashflowManager.GetAllParaBirimi();
        }

        [HttpPost, Route("CreateAnaBaslik")]
        public ResponseObject<GetAnaBaslikFormData> CreateAnaBaslik([FromBody]AddAnaBaslikRequestObject requestObject)
        {
            return cashflowManager.AddAnaBaslik(requestObject);
        }

    }
}
