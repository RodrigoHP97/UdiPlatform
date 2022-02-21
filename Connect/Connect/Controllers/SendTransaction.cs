using System;
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
            var sended = new JpostResponse();

            var request = new RestRequest(Method.POST); 
            //Agregamos los headers

            foreach (var val in headers.Keys)
            {
                request.AddHeader(val.ToString(), headers[val].ToString());
            }

            request.AddParameter(headers["Content-type"].ToString(), deserialized_post["Payload"].ToString(),ParameterType.RequestBody);

            IRestResponse response = client.Execute(request);
            var des_resp = JsonConvert.DeserializeObject<Dictionary<string, object>>(response.Content);

                try
                {
                    string ser_pros = des_resp["requestStatus"].ToString();
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
                    string code = associationRespCode["associationResponseCode"].ToString();

                    if (code == "000")
                    {
                        sended.Code = response.Content;
                    }
                    else
                    {
                        //Aquí se mapean los errores
                        var Error = new JpostException();
                        Error.Code = "Error";
                        Error.Message = "La transacción no pudo ser completada exitosamente";

                        sended.Code = JsonConvert.SerializeObject(Error);
                    }
                }
                catch (Exception)
                {
                    var Error = new JpostException();
                    Error.Code = "Error";
                    Error.Source = "Usuario";
                    Error.Message = "Favor de corroborar las credenciales";

                    sended.Code = JsonConvert.SerializeObject(Error);


                }
            }

                return Json(sended.Code);
            
            
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

public class JpostResponse
{
    public string Code { get; set; }

}

public class RespCode
{
    public string Code { get; set; }
    public string Message { get; set; }

    public string Source { get; set; }
}

public class JpostException
{
    public string Code { get; set; }
    public string Message { get; set; }

    public string Source { get; set; }

}
