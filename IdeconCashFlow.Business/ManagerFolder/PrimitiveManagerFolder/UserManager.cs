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

        public ResponseObject CheckCreedientals(LoginFormData lgnForm)
        {
            ResponseObject response = new ResponseObject();
            string username = lgnForm.Username;
            string password = lgnForm.Password;

            User user = userRepository.SingleGetBy(w => w.Username == username);

            if (user == null)
            {
                response.IsSuccess = false;
                response.Explanation = "Username is invalid!";
            }
            else
            {
                if (SecurityFolder.Security.VerifyPassword(user.Password, password))
                    response.IsSuccess = true;

                else
                {
                    response.IsSuccess = false;
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
