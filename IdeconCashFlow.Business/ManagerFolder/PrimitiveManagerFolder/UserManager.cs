using IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder.BasePrimitiveManagerFolder;
using IdeconCashFlow.Business.RepositoryFolder;
using IdeconCashFlow.Data.Business.GenericResponse;
using IdeconCashFlow.Data.Business.UserManagerFormDataFolder;
using IdeconCashFlow.Data.POCO;
using System;
using System.Collections.Generic;
using System.Text;

namespace IdeconCashFlow.Business.ManagerFolder.PrimitiveManagerFolder
{
    class UserManager:BasePrimitiveManager<User>
    {
        private readonly IRepository<User> userRepository;

        public UserManager(IRepository<User> repo) : base(repo)
        {
            userRepository = base.repository;
        }

        public ResponseObject<User> CheckCreedientals(LoginFormData lgnForm)
        {
            ResponseObject<User> response = new ResponseObject<User>();
            string username = lgnForm.Username;
            string password = lgnForm.Password;

            User user = userRepository.SingleGetBy(w => w.Username == username);

            if (user == null)
            {
                response.IsSuccess = false;
                response.StatusCode = "400";
                response.Explanation = "Username is invalid!";
            }
            else
            {
                if (user.Password.Equals(lgnForm.Password))
                {
                    response.IsSuccess = true;
                    response.StatusCode = "200";
                    response.Explanation = "Success";
                }
                else
                {
                    response.IsSuccess = false;
                    response.StatusCode = "400";
                    response.Explanation = "Password is invalid!";
                }
            }
            return response;
        }

        public bool IsUserExists(string username)
        {
            return userRepository.GetBy(w => w.Username == username) == null;
        }

    }
}
