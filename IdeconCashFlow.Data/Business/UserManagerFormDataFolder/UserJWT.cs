using System;
using System.Collections.Generic;
using System.Text;

namespace IdeconCashFlow.Data.Business.UserManagerFormDataFolder
{
    public class UserJWT
    {
        public string Username { get; set; }

        public string Password { get; set; }

        public string SirketKodu { get; set; } = "0000";

        public string Role { get; set; } = "Basic";
    }
}
