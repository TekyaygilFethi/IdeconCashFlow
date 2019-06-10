using IdeconCashFlow.Api.Filters;
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
    [ApiController]
    [IdeconAuthorization]
    public class BaslikApiController : ControllerBase
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
        public IActionResult GetAllBasliklar()
        {
            return Ok(cashflowManager.GetAllBasliklar());
        }

        [HttpGet, Route("GetGelirBasliklar")]
        public IActionResult GetGelirBasliklar()
        {
            return Ok(cashflowManager.GetGelirBaslik());
        }

        [HttpGet, Route("GetGiderBasliklar")]
        public IActionResult GetGiderBasliklar()
        {
            return Ok(cashflowManager.GetGiderBaslik());
        }

        [HttpPost, Route("CreateKalem")]
        public IActionResult CreateKalem([FromBody]AddKalemFormData kalemFormData)
        {
            return Ok(cashflowManager.AddKalem(kalemFormData));
        }

        [HttpGet,Route("GetAllAnaBasliklar")]
        public IActionResult GetAllAnaBasliklar()
        {
            return Ok(cashflowManager.GetAllAnaBasliklar());
        }

        [HttpGet,Route("GetBasliklarWithDate")]
        public IActionResult GetAllBasliklarWithDate(GetBaslikWithDateFormData gbwdFormData)
        {
            return Ok(cashflowManager.GetAllBasliklarWithDate(gbwdFormData));
        }

        [HttpGet,Route("GetAllParaBirimleri")]
        public IActionResult GetAllParaBirimleri()
        {
            return Ok(cashflowManager.GetAllParaBirimi());
        }

        [HttpPost, Route("CreateAnaBaslik")]
        public IActionResult CreateAnaBaslik([FromBody]AddAnaBaslikRequestObject requestObject)
        {
            return Ok(cashflowManager.AddAnaBaslik(requestObject));
        }

    }
}
