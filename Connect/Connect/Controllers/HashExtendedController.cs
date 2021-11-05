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
              string hashString =
                stringHash.chargetotal+'|'+
                stringHash.checkoutoption +'|' + 
                stringHash.currency + '|' + 
                stringHash.hash_algorithm + '|' 
                + stringHash.paymentMethod + '|' 
                + stringHash.responseFailURL + '|' 
                + stringHash.responseSuccessURL + '|' 
                + stringHash.storename + '|'
                + stringHash.timezone + '|'
                +stringHash.transactionNotificationURL + '|'
                + stringHash.txndatetime + '|'
                + stringHash.txntype;

            string secret = stringHash.sharedsecret;
            Encoding encoding = Encoding.UTF8;

            var keyByte = encoding.GetBytes(secret);
            using (var hmacsha256 = new HMACSHA256(keyByte))
            {
                hmacsha256.ComputeHash(encoding.GetBytes(hashString));
                return Json(System.Convert.ToBase64String(hmacsha256.Hash));

            }
            
        }

    }

    public class HashValues
    {
        public string chargetotal
        {
            get;
            set;
        }
        public string checkoutoption
        {
            get;
            set;
        }
        public string currency
        {
            get;
            set;
        }
        public string hash_algorithm
        {
            get;
            set;
        }
        public string paymentMethod
        {
            get;
            set;
        }
        public string responseFailURL
        {
            get;
            set;
        }
        public string responseSuccessURL
        {
            get;
            set;
        }
        public string storename
        {
            get;
            set;
        }
        public string timezone
        {
            get;
            set;
        }
        public string transactionNotificationURL
        {
            get;
            set;
        }
        public string txndatetime
        {
            get;
            set;
        }
        public string txntype
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
