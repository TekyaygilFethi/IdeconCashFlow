using IdeconCashFlow.Business.ManagerFolder.ComplexManagerFolder;
using IdeconCashFlow.Data.Business.UserManagerFormDataFolder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace IdeconCashFlow.Api.Controllers
{
    [Route("api/User")]
    [ApiController]
    public class UserApiController : ControllerBase
    {
        private readonly IConfiguration _config;
        CashflowComplexManager cashflowManager;

        public UserApiController(IConfiguration _config)
        {
            cashflowManager = new CashflowComplexManager(true);
            this._config = _config;
        }

        [HttpPost]
        [Route("GetUserToken")]
        public IActionResult GetUserToken([FromBody]LoginFormData lgnForm)
        {
            var response = cashflowManager.CheckUserCreedientals(lgnForm);
            var user = response.Object;

            if (user != null)
            {
                try
                {
                    var someClaims = new Claim[]{
                    new Claim("Username", user.Username),
                    new Claim("Password",user.Password),
                    new Claim("SirketKodu",user.SirketKodu),
                    new Claim("Rol",user.Yetki)
                    };

                    SecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("IDECON1*Pwd is the secret key of this cashflow program"));
                    var token = new JwtSecurityToken(
                        issuer: "idecon.com.tr",
                        audience: "ideconclients",
                        claims: someClaims,
                        expires: DateTime.Now.AddHours(12),
                        signingCredentials: new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256)
                    );

                    return Ok(new JwtSecurityTokenHandler().WriteToken(token));

                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
            else
                return Unauthorized();
        }

    }
}