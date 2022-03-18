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

            string hashS = hashString + secret;

            var keyByte = encoding.GetBytes(hashS);

            string hex_hash = BitConverter.ToString(keyByte);

            hex_hash = hex_hash.Replace("-", "");

            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(hex_hash));

                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return Json(builder.ToString());

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
