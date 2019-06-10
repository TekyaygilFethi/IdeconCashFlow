using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdeconCashFlow.Business.ExceptionFolder
{
    public static class ExceptionOps
    {
        public static string GetExceptionMessage(Exception ex)
        {
            Exception tempException = ex;

            while (tempException.InnerException != null) ex = tempException.InnerException;

            return tempException.Message;
        }               
    }
}
