using System;
using System.IO;
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
                            using (StreamReader r = new StreamReader("../Connect/wwwroot/Configurations/DeclineCodes.json"))
                            {
                                string json = r.ReadToEnd();
                                var des_order = JsonConvert.DeserializeObject<Dictionary<string, object>>(response.Content);
                                string order = des_order["orderId"].ToString();
                                dynamic array = JsonConvert.DeserializeObject(json);
                                var Error = new JpostException();
                                Error.Code = "Error";
                                foreach (var item in array)
                                {
                                    if (code == item["Code"].Value)
                                    {
                                        Error.Message = "Tu pedido "+ order + " no pudo ser procesado correctamente. Razón:"+ item["Message"];

                                        sended.Code = JsonConvert.SerializeObject(Error);
                                    }
                                }
                            }
                            //Aquí se mapean los errores


                        }
                    }
                    catch
                    {
                        string status = des_resp["transactionStatus"].ToString();
                        string TransID = des_resp["ipgTransactionId"].ToString();

                        if (status == "WAITING")
                        {
                            var authResp = JsonConvert.SerializeObject(des_resp["authenticationResponse"]);
                            var des_authResp = JsonConvert.DeserializeObject<Dictionary<string, object>>(authResp);


                            var Msj = new JpostMsj();
                            Msj.Code = "Authenticating";
                            Msj.Source = "Authentication";
                            Msj.Message = JsonConvert.SerializeObject(des_authResp["secure3dMethod"]);
                            Msj.Version = des_authResp["version"].ToString();
                            Msj.TransId = TransID;

                            sended.Code = JsonConvert.SerializeObject(Msj);

                        }
                        else
                        {
                            var Error = new JpostException();
                            Error.Code = "Error";
                            Error.Source = "Usuario";
                            Error.Message = "Ocurrió un error inesperado";

                            sended.Code = JsonConvert.SerializeObject(Error);
                        }
                    }

                }
                catch (Exception)
                {
                    var Error = new JpostException();
                    Error.Code = "Error";
                    Error.Source = "Usuario";
                    Error.Message = "Ups parece ser que ocurrió un error";

                    sended.Code = JsonConvert.SerializeObject(Error);


                }
            }

                return Json(sended.Code);
            
            
        }
        public JsonResult PatchTransaction(Jpost postData)
        {
            var sended = new JpostResponse();
            //Parseamos el objeto del Post
            var deserialized_post = JsonConvert.DeserializeObject<Dictionary<string, object>>(postData.post);

            //Reparseamos los headers
            var jheaders = JsonConvert.SerializeObject(deserialized_post["headers"]);

            var url = deserialized_post["url"];

            //Parseamos los headers
            var headers = JsonConvert.DeserializeObject<Dictionary<string, string>>(jheaders);

            //Iniciamos el cliente
            var client = new RestClient(url.ToString());
            var Msj = new JpostMsj();

            var request = new RestRequest(Method.PATCH);
            //Agregamos los headers
            foreach (var val in headers.Keys)
            {
                request.AddHeader(val.ToString(), headers[val].ToString());
            }

            request.AddParameter(headers["Content-type"].ToString(), deserialized_post["Payload"].ToString(), ParameterType.RequestBody);

            IRestResponse response = client.Execute(request);
            var des_resp = JsonConvert.DeserializeObject<Dictionary<string, object>>(response.Content);

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
                    using (StreamReader r = new StreamReader("../Connect/wwwroot/Configurations/DeclineCodes.json"))
                    {
                        string json = r.ReadToEnd();
                        dynamic array = JsonConvert.DeserializeObject(json);
                        var des_order = JsonConvert.DeserializeObject<Dictionary<string, object>>(response.Content);
                        string order = des_order["orderId"].ToString();
                        var Error = new JpostException();
                        Error.Code = "Error";
                        foreach (var item in array)
                        {
                            if (code == item["Code"].Value)
                            {
                                Error.Message = "Tu pedido " + order + " no pudo ser procesado correctamente. Razón:" + item["Message"];

                                sended.Code = JsonConvert.SerializeObject(Error);
                            }
                        }
                    }
                }
            }
            catch
            {
                try
                {

                    var jauthresp = JsonConvert.SerializeObject(des_resp["authenticationResponse"]);

                    var authresp = JsonConvert.DeserializeObject<Dictionary<string, object>>(jauthresp);

                    Msj.Code = "Finalizing_Auth";
                    Msj.Source = "Authentication";
                    Msj.Version = authresp["version"].ToString();
                    Msj.Message = authresp["params"].ToString();

                    sended.Code = JsonConvert.SerializeObject(Msj);
                }
                catch
                {
                    var Error = new JpostException();
                    Error.Code = "Error";
                    Error.Source = "Usuario";
                    Error.Message = "La transacción no pudo ser completada satisfactoriament";

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

public class JpostMsj
{
    public string Code { get; set; }
    public string Message { get; set; }

    public string Source { get; set; }

    public string Version { get; set; }

    public string TransId { get; set; }

}
