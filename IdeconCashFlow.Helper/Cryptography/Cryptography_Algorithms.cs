using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;
using System.Collections.Generic;
using System.Text;

namespace IdeconCashFlow.Helper.Cryptography
{
    public class Cryptography_Algorithms
    {
        /// <summary>
        /// Kullanıcının şifresinin şifrelemek için 
        /// </summary>
        /// <param name="password">Kullanıcının şifresi</param>
        /// <param name="salt">Kullanıcı adı ve şifresi</param>
        /// <returns></returns>
        public static string Calculate_SHA256(string password, string salt)
        {
            byte[] newsalt = Encoding.ASCII.GetBytes(salt);
            
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                            password: password,
                            salt: newsalt,
                            prf: KeyDerivationPrf.HMACSHA256,
                            iterationCount: 10000,
                            numBytesRequested: 256 / 8));

            return hashed;
        }
    }
}
