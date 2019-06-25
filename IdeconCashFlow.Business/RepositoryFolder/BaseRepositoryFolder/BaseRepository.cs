using IdeconCashFlow.Business.ExceptionFolder;
using System;
using System.Collections.Generic;
using System.Text;

namespace IdeconCashFlow.Business.RepositoryFolder.BaseRepositoryFolder
{
    public class BaseRepository
    {
        public static string GetExceptionMessage(Exception ex)
        {
            return ExceptionOps.GetExceptionMessage(ex);
        }
    }
}
