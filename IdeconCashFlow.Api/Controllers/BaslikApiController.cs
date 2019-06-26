using IdeconCashFlow.Business.ManagerFolder.ComplexManagerFolder;
using IdeconCashFlow.Data.Business.BaslikManagerFormDataFolder;
using IdeconCashFlow.Data.Business.KalemManagerFormDataFolder;
using IdeconCashFlow.Data.POCO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace IdeconCashFlow.Api.Controllers
{
    [Route("api/Baslik")]
    [ApiController]

    public class BaslikApiController : Controller
    {
        CashflowComplexManager cashflowManager;
        UserManager userManager;

        public BaslikApiController()
        {
            cashflowManager = new CashflowComplexManager();
            userManager = new UserManager();
        }

        #region GET
        [HttpGet, Route("GetAllBasliklarDapper")]
        [Authorize()]
        public IActionResult GetAllBasliklar()
        {
            return Ok(cashflowManager.GetAllBasliklarDapper());
        }

        //[HttpGet, Route("GetGelirBasliklarDapper")]
        //public IActionResult GetGelirBasliklar()
        //{
        //    return Ok(cashflowManager.GetGelirBaslikDapper());
        //}

        [HttpGet, Route("GetAllAnaBasliklarDapper")]
        public IActionResult GetAllAnaBasliklar()
        {
            return Ok(cashflowManager.GetAllAnaBasliklarDapper());
        }

        [HttpGet, Route("GetTotalParaBirimiTutarDapper")]
        public IActionResult GetTotalParaBirimiTutar()
        {
            return Ok(cashflowManager.GetTotalParaBirimiTutarDapper());
        }

        [HttpGet, Route("GetTotalParaBirimiTutarOfBaslikDapper")]
        public IActionResult GetTotalParaBirimiTutarOfBaslik(string baslikID)
        {
            return Ok(cashflowManager.GetTotalParaBirimiTutarOfBaslikDapper(baslikID));
        }

        [HttpPost, Route("GetAllBasliklarWithDate")]
        public IActionResult GetAllBasliklarWithDate(GetBaslikWithDateFormData form)
        {
            return Ok(cashflowManager.GetAllBasliklarWithDateDapper(form));
        }
        #endregion

        #region CREATE
        [HttpPost, Route("CreateKalem"), Authorize()]
        public IActionResult CreateKalem([FromBody]AddKalemFormData kalemFormData)
        {
            var sirketKodu = User.Claims.First(x => x.Type == "SirketKodu").Value;
            var ekleyenUserID = User.Claims.First(x => x.Type == "UserID").Value;

            kalemFormData.SirketKodu = sirketKodu;
            kalemFormData.EkleyenUserID = int.Parse(ekleyenUserID);

            return Ok(cashflowManager.CreateKalemDapper(kalemFormData));
        }

        

        [HttpPost, Route("CreateAnaBaslik"), Authorize()]
        public IActionResult CreateAnaBaslik([FromBody]AddAnaBaslikRequestObject requestObject)
        {
            var sirketKodu = User.Claims.First(x => x.Type == "SirketKodu").Value;
            requestObject.SirketKodu = sirketKodu;

            return Ok(cashflowManager.CreateAnaBaslikDapper(requestObject));
        }
        #endregion
    }
}
