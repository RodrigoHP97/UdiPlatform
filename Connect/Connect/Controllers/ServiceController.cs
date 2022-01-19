using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class ServiceController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public ServiceController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }


        public IActionResult Connect()
        {
            return View();
        }

        public IActionResult API()
        {
            return View();
        }
        public IActionResult PaymentJs()
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
