using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.Models;
using System.Net.Http;

namespace WebApplication1.Controllers
{
    public class ResponseController : Controller
    {

        [HttpPost]
        public IActionResult Success()
        {
            var oid = Request.Form["oid"];
            ViewBag.oid = oid;
            ViewBag.chargetotal = Request.Form["chargetotal"];
            ViewBag.status = Request.Form["status"];
            return View();
        }

        public IActionResult Failure()
        {
            return View();
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
