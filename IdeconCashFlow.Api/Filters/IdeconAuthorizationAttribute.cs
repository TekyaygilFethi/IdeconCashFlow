using IdeconCashFlow.Data.Business.UserManagerFormDataFolder;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http.Filters;

namespace IdeconCashFlow.Api.Filters
{
    public class IdeconAuthorizationAttribute : Attribute, IAuthenticationFilter
    {
        public bool AllowMultiple => false;
        public string Realm { get; set; }

        //public override void OnAuthorization(HttpActionContext actionContext)
        //{
        //    if (actionContext.Request.Headers.Authorization == null)
        //        actionContext.Response =new HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
        //    else
        //    {
        //        CashflowComplexManager complexManager = new CashflowComplexManager(true);
        //        string username = string.Empty, password = string.Empty, sirketKodu = string.Empty;

        //        var tokenKey = actionContext.Request.Headers.Authorization.Parameter;

        //        ClaimsPrincipal principal = GetPrincipal(tokenKey);

        //        if (principal == null)
        //            actionContext.Response = new HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);


        //        ClaimsIdentity identity = null;

        //        try
        //        {
        //            identity = (ClaimsIdentity)principal.Identity;
        //            username = identity.FindFirst("Username").Value;
        //            password = identity.FindFirst("Password").Value;
        //            sirketKodu = identity.FindFirst("SirketKodu").Value;

        //            var authorizeResult = complexManager.CheckUserCreedientalsByJWT(new UserJWT { Username = username, Password = password, SirketKodu = sirketKodu });
        //            if (authorizeResult.IsSuccess == false)
        //                actionContext.Response = actionContext.Request.CreateResponse<string>(System.Net.HttpStatusCode.Unauthorized,"Wrong Creedientals");
        //        }
        //        catch (Exception ex)
        //        {
        //            actionContext.Response = actionContext.Request.CreateResponse<string>(System.Net.HttpStatusCode.Unauthorized, ex.Message);
        //        }










        //        #region
        //        //userJWT.Claims.Where(w => w.Type == "Username");

        //        //username = userJWT.Username;
        //        //password = userJWT.Password;
        //        //sirketKodu = userJWT.SirketKodu;
        //        //}
        //        //catch (Exception)
        //        //{
        //        //    actionContext.Response = new HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
        //        //}

        //        //var lgnCheckResponse = complexManager.CheckUserCreedientalsByJWT(new UserJWT() { Username = username, Password = password, SirketKodu = sirketKodu });

        //        //#region Eski Basic Authentication
        //        ////username:password:sirketkodu
        //        ////var userInfo = Encoding.UTF8.GetString(Convert.FromBase64String(tokenKey));
        //        ////var userInfoArray = userInfo.Split(':');
        //        ////var username = userInfoArray[0];
        //        ////var password = userInfoArray[1];
        //        ////var sirketkodu = userInfoArray[2];

        //        ////var lgnCheckResponse = complexManager.CheckUserCreedientalsByJWT(new UserJWT() { Username = username, Password = password, SirketKodu = sirketkodu });
        //        //#endregion
        //        //if (lgnCheckResponse.IsSuccess == true && lgnCheckResponse.Object.IsAppropriate == true)
        //        //    Thread.CurrentPrincipal = new GenericPrincipal(new GenericIdentity(username), null);
        //        //else
        //        //    actionContext.Response = new HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
        //        #endregion
        //    }

        //}

        public static ClaimsPrincipal GetPrincipal(string token)
        {
            try
            {
                JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
                JwtSecurityToken jwtToken = tokenHandler.ReadJwtToken(token);
                if (jwtToken == null) return null;
                //byte[] key = Convert.FromBase64String("IDECON1*Pwd is the secret key of this cashflow program");
                TokenValidationParameters parameters = new TokenValidationParameters()
                {
                    RequireExpirationTime = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("IDECON1*Pwd is the secret key of this cashflow program"))
                };
                SecurityToken securityToken;
                ClaimsPrincipal principal = tokenHandler.ValidateToken(token, parameters, out securityToken);
                return principal;
            }
            catch
            {
                return null;
            }

        }

        public async Task AuthenticateAsync(HttpAuthenticationContext context, CancellationToken cancellationToken)
        {
            var request = context.Request;
            var authorization = request.Headers.Authorization;

            if (authorization == null || authorization.Scheme != "Bearer")
                return;

            if (string.IsNullOrEmpty(authorization.Parameter))
            {
                context.ActionContext.Response = new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);
                return;
            }

            var token = authorization.Parameter;
            var principal = await AuthenticateJwtToken(token);

            if (principal == null)
                context.ActionContext.Response = new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized);

            else
                context.Principal = principal;
        }

        private static bool ValidateToken(string token, out UserJWT user)
        {
            user = null;

            var simplePrinciple = GetPrincipal(token);
            var identity = simplePrinciple?.Identity as ClaimsIdentity;

            if (identity == null)
                return false;

            if (!identity.IsAuthenticated)
                return false;

            try
            {
                user.Username = identity.FindFirst("Username")?.Value;
                user.Password= identity.FindFirst("Password")?.Value;
                user.SirketKodu = identity.FindFirst("SirketKodu")?.Value;
            }
            catch (Exception)
            {
                return false;
            }

            // More validate to check whether username exists in system

            return true;
        }

        protected Task<IPrincipal> AuthenticateJwtToken(string token)
        {
            UserJWT userJWT;

            if (ValidateToken(token, out user))
            {
                var claims = new Claim[]
                {
                    new Claim("Username", user.Username),
                    new Claim("Password",user.Password),
                    new Claim("SirketKodu",user.SirketKodu),
                    new Claim("Rol",user.Yetki)
                };

                var identity = new ClaimsIdentity(claims, "Jwt");
                IPrincipal user = new ClaimsPrincipal(identity);

                return Task.FromResult(user);
            }

            return Task.FromResult<IPrincipal>(null);
        }

        public Task ChallengeAsync(HttpAuthenticationChallengeContext context, CancellationToken cancellationToken)
        {
            Challenge(context);
            return Task.FromResult(0);
        }

        private void Challenge(HttpAuthenticationChallengeContext context)
        {
            string parameter = null;

            if (!string.IsNullOrEmpty(Realm))
                parameter = "realm=\"" + Realm + "\"";

            context.ChallengeWith("Bearer", parameter);
        }
    }
}
