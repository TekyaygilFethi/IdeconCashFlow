using IdeconCashFlow.Business.ManagerFolder.ComplexManagerFolder;
using IdeconCashFlow.Data.Business.UserManagerFormDataFolder;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Security.Principal;
using System.Threading;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace IdeconCashFlow.Api.Filters
{
    public class IdeconAuthorizationAttribute : AuthorizationFilterAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (actionContext.Request.Headers.Authorization == null)
                actionContext.Response = new HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
            else
            {
                CashflowComplexManager complexManager = new CashflowComplexManager(true);
                string username=string.Empty, password = string.Empty, sirketKodu = string.Empty;
                try
                {
                    var tokenKey = actionContext.Request.Headers.Authorization.Parameter;
                    var jsonString = FTH.Extension.Encrypter.Decrypt(tokenKey, complexManager.GetPasswordPhrase(),System.Security.Cryptography.CipherMode.CBC);

                    var userJWT = JsonConvert.DeserializeObject<UserJWT>(jsonString);
                    username = userJWT.Username;
                    password = userJWT.Password;
                    sirketKodu = userJWT.SirketKodu;
                }catch(Exception)
                {
                    actionContext.Response = new HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
                }

                var lgnCheckResponse = complexManager.CheckUserCreedientalsByJWT(new UserJWT() { Username = username, Password = password, SirketKodu = sirketKodu });

                #region Eski Basic Authentication
                //username:password:sirketkodu
                //var userInfo = Encoding.UTF8.GetString(Convert.FromBase64String(tokenKey));
                //var userInfoArray = userInfo.Split(':');
                //var username = userInfoArray[0];
                //var password = userInfoArray[1];
                //var sirketkodu = userInfoArray[2];

                //var lgnCheckResponse = complexManager.CheckUserCreedientalsByJWT(new UserJWT() { Username = username, Password = password, SirketKodu = sirketkodu });
                #endregion
                if (lgnCheckResponse.IsSuccess == true && lgnCheckResponse.Object.IsAppropriate == true)
                    Thread.CurrentPrincipal = new GenericPrincipal(new GenericIdentity(username), null);
                else
                    actionContext.Response = new HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
            }

        }

    }
}
