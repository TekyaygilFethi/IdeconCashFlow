using Newtonsoft.Json;

namespace IdeconCashFlow.Data.Business.GenericResponse
{
    public class ResponseObject<T> where T : class
    {
        public bool IsSuccess { get; set; }

        [JsonProperty("statusCode")]
        public string StatusCode { get; set; }

        [JsonProperty("message")]
        public string Explanation { get; set; }

        [JsonProperty("response")]
        public T Object { get; set; }
    }
}
