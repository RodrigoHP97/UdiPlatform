using System;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Security.Cryptography;

namespace WebApplication1.Controllers
{
    public class HashExtendedController : Controller
    {
        [HttpPost]
        public JsonResult HashHMAC(HashValues stringHash)
        {
            Encoding encoding = Encoding.UTF8;

            string hashString =
                stringHash.message;

            string secret = stringHash.sharedsecret;
            

            var keyByte = encoding.GetBytes(secret);
            using (var hmacsha256 = new HMACSHA256(keyByte))
            {
                hmacsha256.ComputeHash(encoding.GetBytes(hashString));

                string Base64hash = Convert.ToBase64String(hmacsha256.Hash);

                return Json(Base64hash);

            }
            
        }
        [HttpPost]
        public JsonResult HashNoHMAC(HashValues stringHash)
        {
            Encoding encoding = Encoding.UTF8;

            string hashString =
                stringHash.message;

            string secret = stringHash.sharedsecret;


            var keyByte = encoding.GetBytes(secret);
            using (var hmacsha256 = new HMACSHA256(keyByte))
            {
                hmacsha256.ComputeHash(encoding.GetBytes(hashString));

                string Base64hash = Convert.ToBase64String(hmacsha256.Hash);

                return Json(Base64hash);

            }

        }
    }

    public class HashValues
    {
        public string message
        {
            get;
            set;
        }
        public string sharedsecret
        {
            get;
            set;
        }
    }
}
