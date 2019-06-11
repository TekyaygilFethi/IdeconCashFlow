using IdeconCashFlow.Business.ManagerFolder.ComplexManagerFolder;
using IdeconCashFlow.Data.Business.UserManagerFormDataFolder;
using IdeconCashFlow.Helper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.Diagnostics;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace IdeconCashFlow.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(o => o.AddPolicy("MyPolicy", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            }));

            IdentityModelEventSource.ShowPII = true;

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = true,
                    ValidAudience = "ideconclients",
                    ValidateIssuer = true,
                    ValidIssuer = "idecon.com.tr",
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes("IDECON1*Pwd is the secret key of this cashflow program"))
                };

                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = ctx =>
                    {
                        CashflowComplexManager complexManager = new CashflowComplexManager(true);

                        var principal = ctx.Principal;//Gerekirse burada gelen token içerisindeki çeşitli bilgilere göre doğrulam yapılabilir.
                        var identity = (ClaimsIdentity)principal.Identity;
                        string username = identity.FindFirst("Username").Value;
                        string password = identity.FindFirst("Password").Value;
                        string sirketKodu = identity.FindFirst("SirketKodu").Value;

                        var authorizeResult = complexManager.CheckUserCreedientalsByJWT(new UserJWT { Username = username, Password = password, SirketKodu = sirketKodu });

                        if(!(authorizeResult.IsSuccess))
                        {
                            
                        }

                        return Task.CompletedTask;
                    },
                    OnAuthenticationFailed = ctx =>
                    {
                        Debug.WriteLine("Exception:{0}", ctx.Exception.Message);
                        return Task.CompletedTask;
                    }
                };
            });


            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("CoreSwagger", new Info
                {
                    Title = "Swagger on ASP.NET Core",
                    Version = "1.0.0",
                    Description = "Try Swagger on (ASP.NET Core 2.1)",
                    Contact = new Contact()
                    {
                        Name = "IDECON Cashflow Swagger",
                        Url = "http://www.idecon.com.tr",
                        Email = "fethi.tekyaygil@idecon.com.tr"
                    },
                    TermsOfService = "http://swagger.io/terms/"
                });
            });
            //services.AddDbContext<IdeconCashFlow>(opt => opt.UseInMemoryDatabase("FabrikaDb"));
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddMvc().AddJsonOptions(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling =
                    Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });
        }


        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseCorsMiddleware();
            app.UseSwagger()
            .UseSwaggerUI(c =>
            {
                //TODO: Either use the SwaggerGen generated Swagger contract (generated from C# classes)
                c.SwaggerEndpoint("/swagger/CoreSwagger/swagger.json", "Swagger Test .Net Core");

                //TODO: Or alternatively use the original Swagger contract that's included in the static files
                // c.SwaggerEndpoint("/swagger-original.json", "Swagger Petstore Original");
            });

            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseMvc();
            app.UseCors("MyPolicy");
        }
    }
}
