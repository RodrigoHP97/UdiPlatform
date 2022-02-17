
using RestSharp;
using Newtonsoft.Json;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Controllers
{
    public class SendTransactionController : Controller
    {
        
        [HttpPost]
        public JsonResult PostTransaction(Jpost postData)
        {
            
            //Parseamos el objeto del Post
            var deserialized_post =JsonConvert.DeserializeObject<Dictionary<string, object>>(postData.post);

            //Reparseamos los headers
            var jheaders= JsonConvert.SerializeObject(deserialized_post["headers"]);

            var url = deserialized_post["url"];

            //Parseamos los headers
            var headers = JsonConvert.DeserializeObject<Dictionary<string, string>>(jheaders);

            //Iniciamos el cliente
            var client = new RestClient(url.ToString());

            var request = new RestRequest(Method.POST); 
            //Agregamos los headers

            foreach (var val in headers.Keys)
            {
                request.AddHeader(val.ToString(), headers[val].ToString());
            }

            request.AddParameter(headers["Content-type"].ToString(), deserialized_post["Payload"].ToString(),ParameterType.RequestBody);

            IRestResponse response = client.Execute(request);

            var des_resp = JsonConvert.DeserializeObject<Dictionary<string, object>>(response.Content);

            if (des_resp!=null)
            {
                try
                {
                    var ser_pros = JsonConvert.SerializeObject(des_resp["requestStatus"]);
                    if (ser_pros == "SUCCESS")
                    {
                        return Json(response.Content);
                    }
                }
                catch
                {
                    try
                    {
                        var ser_pros = JsonConvert.SerializeObject(des_resp["processor"]);

                        var associationRespCode = JsonConvert.DeserializeObject<Dictionary<string, object>>(ser_pros);
                        var code = associationRespCode["associationResponseCode"].ToString();

                        if (code == "000")
                        {
                            return Json(response.Content);
                        }
                        else
                        {
                            return Json(response.Content);
                        }
                    }

                    catch
                    {
                        
                    }

                }

                

            }
            return Json(response.Content);

        }   
    }
    
}

public class Jpost
{
    public string post
    {
        get;
        set;
    }
}
