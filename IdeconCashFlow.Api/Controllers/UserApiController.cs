using IdeconCashFlow.Business.ManagerFolder.ComplexManagerFolder;
using IdeconCashFlow.Data.Business.UserManagerFormDataFolder;
using IdeconCashFlow.Data.POCO;
using Microsoft.AspNetCore.Authorization;
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
        CashflowComplexManager cashflowManager;
        UserManager userManager;

        public UserApiController()
        {
            //cashflowManager = new CashflowComplexManager();
            userManager = new UserManager();
        }

        [HttpPost]
        [Route("GetUserToken")]
        [AllowAnonymous()]
        public IActionResult GetUserToken([FromBody]LoginFormData lgnForm)
        {
            var response = userManager.CheckUserCreedientalsDapper(lgnForm);
            var user = response.Object;

            if (user != null)
            {
                try
                {
                    var someClaims = new Claim[]{
                    new Claim("Username", user.Username),
                    new Claim("Password",user.Password),
                    new Claim("SirketKodu",user.SirketKodu),
                    new Claim("NameSurname",user.Name+" "+user.Surname),
                    new Claim("UserID",user.ID.ToString()),
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


        [HttpPost, Route("CreateUser"), AllowAnonymous]
        public IActionResult CreateUser([FromBody]User user)
        {
            return Ok(userManager.CreateUser(user));
        }
    }
}