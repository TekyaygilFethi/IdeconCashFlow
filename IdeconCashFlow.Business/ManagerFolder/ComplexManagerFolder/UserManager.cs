using IdeconCashFlow.Business.RepositoryFolder.DapperFolder;
using IdeconCashFlow.Data.Business.GenericResponse;
using IdeconCashFlow.Data.Business.UserManagerFormDataFolder;
using IdeconCashFlow.Data.POCO;
using IdeconCashFlow.Helper.Cryptography;
using System;
using System.Linq;

namespace IdeconCashFlow.Business.ManagerFolder.ComplexManagerFolder
{
    public class UserManager
    {
        //private readonly IRepository<User> userRepository;

        private const string passPhrase = "070718";
        DapperRepository dapperRepository;

        public UserManager()
        {
            dapperRepository = new DapperRepository();
        }

        public ResponseObject<User> CreateUser(User user)
        {
            ResponseObject<User> response = new ResponseObject<User>();

            try
            {
                var userIDQuery = $"SELECT ID FROM usertable ORDER BY ID DESC;";
                int lastID = dapperRepository.Query<int>(userIDQuery).FirstOrDefault();

                user.Username = user.Name + user.Surname;
                user.ID = lastID == 0 ? 1 : lastID + 1;
                user.Password = Cryptography_Algorithms.Calculate_SHA256(user.Password, user.Username + user.Password);

                var userInsertQuery = $"INSERT INTO usertable (ID,Username,Name,Surname,Password,Yetki,SirketKodu) " +
                    $"VALUES ({user.ID},'{user.Username}','{user.Name}','{user.Surname}','{user.Password}','{user.Yetki}','{user.SirketKodu}')";

                dapperRepository.Execute(userInsertQuery);

                response.IsSuccess = true;
                response.StatusCode = "200";
                response.Explanation = "success";
                response.Object = user;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Explanation = ex.Message;
                response.StatusCode = "400";
            }

            return response;
        }

        public ResponseObject<CheckLoginCreedientalsJWTResponse> CheckUserCreedientalsByJWT(UserJWT jwt)
        {
            ResponseObject<CheckLoginCreedientalsJWTResponse> response = new ResponseObject<CheckLoginCreedientalsJWTResponse>();
            try
            {
                bool jwtAuthorization = CheckJWT(jwt);

                CheckLoginCreedientalsJWTResponse checkResult = new CheckLoginCreedientalsJWTResponse() { IsAppropriate = jwtAuthorization };

                response.Explanation = "Success";
                response.IsSuccess = true;
                response.StatusCode = "200";
                response.Object = checkResult;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.StatusCode = "400";
                response.Explanation = ex.Message;
            }
            return response;
        }

        public ResponseObject<User> CheckUserCreedientalsDapper(LoginFormData form)
        {
            ResponseObject<User> response = new ResponseObject<User>();
            try
            {
                string username, password;

                username = form.Username;
                password = form.Password;

                User user = CheckCreedientals(form);

                response.Explanation = "Success";
                response.IsSuccess = true;
                response.StatusCode = "200";
                response.Object = user;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.StatusCode = "400";
                response.Explanation = ex.Message;
            }
            return response;
        }

        public User CheckCreedientals(LoginFormData lgnForm)
        {
            string username, password;

            username = lgnForm.Username;
            password = lgnForm.Password;

            User user;

            var userQuery = $"SELECT * FROM usertable WHERE Username='{username}'";

            user = dapperRepository.Query<User>(userQuery).FirstOrDefault();

            if (user == null)
            {
                throw new Exception("\"Username\" is invalid!");
            }
            else
            {
                if (user.Password.Equals(Cryptography_Algorithms.Calculate_SHA256(password, username + password)))
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

        public string GetPasswordPhrase()
        {
            return passPhrase;
        }

    }
}
