using System;
using System.IO;
using RestSharp;
using Newtonsoft.Json;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Controllers
{
    public class ThreeDSValidatorController : Controller
    {
        [HttpPost]
        public IActionResult Notification()
        {
            ViewBag.id = Request.Form["test"];

            return View();
        }
        [HttpPost]
        public IActionResult Authentication()
        {
            var list = new Dictionary<string, string>();
            foreach (string key in Request.Form.Keys)
            {
                list.Add(key, Request.Form[key]);
            }
            var data = Json(list).Value;
            ViewBag.data = JsonConvert.SerializeObject(data);

            return PartialView("~/Views/ThreeDSValidator/Authentication.cshtml");
        }
    }
}
