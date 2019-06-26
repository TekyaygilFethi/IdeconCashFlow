using AutoMapper;
using IdeconCashFlow.Business.ExceptionFolder;
using System;
using System.Collections.Generic;

namespace IdeconCashFlow.Business.ManagerFolder.BaseManagerFolder
{
    public class BaseComplexManager
    {
        protected BaseComplexManager() { }

        public string GetExceptionMessage(Exception ex)
        {
            return ExceptionOps.GetExceptionMessage(ex);
        }

        public TDestination AdvancedMap<TSource, TDestination>(TSource src, List<string> propertyNames = null) where TDestination : class where TSource : class
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<TSource, TDestination>();
                if (propertyNames != null)
                {
                    foreach (var prop in propertyNames)
                    {
                        cfg.AddGlobalIgnore(prop);
                    }
                }
            });

            IMapper mapper = config.CreateMapper();
            return mapper.Map<TSource, TDestination>(src);
        }
    }
}
