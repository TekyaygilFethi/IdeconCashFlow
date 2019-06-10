﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace IdeconCashFlow.Data.Dummy
{
    public class Currency
    {
        [JsonProperty("symbol")]
        public string Symbol { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("symbol_native")]
        public string SymbolNative { get; set; }

        [JsonProperty("decimal_digits")]
        public int DecimalDigits { get; set; }

        [JsonProperty("rounding")]
        public int Rounding { get; set; }

        [JsonProperty("code")]
        public string Code { get; set; }

        [JsonProperty("name_plural")]
        public string NamePlural { get; set; }
    }
}
