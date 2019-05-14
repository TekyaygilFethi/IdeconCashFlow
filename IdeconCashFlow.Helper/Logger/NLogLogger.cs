using NLog;
using NLog.Web;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace IdeconCashFlow.Helper.Logger
{
    public class Logger
    {
        public static bool Write(Exception ex, string path = "", LogPriority priority = LogPriority.Normal, string customMessage = "")
        {
            try
            {
                NLog.Logger logger = NLogBuilder.ConfigureNLog(Directory.GetCurrentDirectory() + "\\Nlog.config").GetCurrentClassLogger();

                switch (priority)
                {
                    case LogPriority.Low:
                        logger.Info(ex, path);
                        break;
                    case LogPriority.Normal:
                        logger.Warn(ex,path);
                        break;
                    case LogPriority.High:
                        logger.Error(ex,path);
                        break;
                    case LogPriority.RedAlert:
                        logger.Fatal(ex,path);
                        break;
                }
                return true;
            }
            catch { return false; }
        }

        public static bool Write(string req,string res,string path)
        {
            try
            {
                NLog.Logger logger = NLogBuilder.ConfigureNLog(Directory.GetCurrentDirectory() + "\\NlogRequestResponse.config").GetCurrentClassLogger();
                GlobalDiagnosticsContext.Set("Request", req);
                GlobalDiagnosticsContext.Set("Response", res);
                logger.Info(path);
            }
            catch { return false; }

            return true;
        }
    }
}
