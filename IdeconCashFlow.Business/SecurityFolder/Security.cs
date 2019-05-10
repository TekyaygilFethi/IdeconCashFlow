using System;
using System.Collections.Generic;
using System.Text;
using System.Web.Helpers;

namespace IdeconCashFlow.Business.SecurityFolder
{
    public static class Security
    {
        public static string GetEncryptedPassword(string password)
        {
            return Crypto.HashPassword(password);
        }

        public static bool VerifyPassword(string actualPassword, string userEnteredPassword)
        {
            return Crypto.VerifyHashedPassword(actualPassword, userEnteredPassword);
        }
    }
}
