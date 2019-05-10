using IdeconCashFlow.Business.ExceptionFolder;
using System;

namespace IdeconCashFlow.Business.ManagerFolder.BaseManagerFolder
{
    public class BaseComplexManager
    {
        protected BaseComplexManager() { }

        public string GetExceptionMessage(Exception ex)
        {
            return ExceptionOps.GetExceptionMessage(ex);
        }
    }
}
