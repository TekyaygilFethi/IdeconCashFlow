using IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder.BasePrimitiveManagerFolder;
using IdeconCashFlow.Business.RepositoryFolder;
using IdeconCashFlow.Data.Business.UserManagerFormDataFolder;
using IdeconCashFlow.Data.POCO;
using IdeconCashFlow.Helper.Cryptography;
using System;

namespace IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder
{
    public class UserManager : BasePrimitiveManager<User>
    {
        //private readonly IRepository<User> userRepository;

        private const string passPhrase = "070718";

        public UserManager(IRepository<User> repo) : base(repo)
        {
            //userRepository = base.repository;
        }

        public User CheckCreedientals(LoginFormData lgnForm)
        {
            string username, password;

            username = lgnForm.Username;
            password = lgnForm.Password;

            User user;

            user = repository.SingleGetBy(w => w.Username == username);

            if (user == null)
            {
                throw new Exception("\"Username\" or \"Şirket Kodu\" is invalid!");
            }
            else
            {
                if (user.Password.Equals(Cryptography_Algorithms.Calculate_SHA256(lgnForm.Password,lgnForm.Username+lgnForm.Password)))
                {
                    return user;
                }
                else
                {
                    throw new Exception("Password is invalid!");
                }
            }
        }

        public bool CheckJWT(UserJWT jwt)
        {
            string username, password;

            username = jwt.Username;
            password = jwt.Password;

            User user = CheckCreedientals(new LoginFormData() { Username = username, Password = password });

            if (user == null)
                throw new Exception("\"Username\" or \"Şirket Kodu\" is invalid!");

            else
            {
                if (user.SirketKodu == jwt.SirketKodu)
                {
                    return true;
                }
                else
                {
                    throw new Exception("Şirket kodu hatalı!");
                }
            }
        }

        public bool IsUserExists(string username)
        {
            return repository.GetBy(w => w.Username == username) == null;
        }

        public User GetByID(int ID)
        {
            try
            {
                return base.repository.GetByID(ID);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public string GetPasswordPhrase()
        {
            return passPhrase;
        }

    }
}
