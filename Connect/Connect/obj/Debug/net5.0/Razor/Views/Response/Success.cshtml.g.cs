#pragma checksum "C:\Users\herib\Documents\Fiserv-Rodrigo\Connect\Connect\Connect\Views\Response\Success.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "b35179b3796ee8fd83ffc195153495ccc1deef48"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Response_Success), @"mvc.1.0.view", @"/Views/Response/Success.cshtml")]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#nullable restore
#line 1 "C:\Users\herib\Documents\Fiserv-Rodrigo\Connect\Connect\Connect\Views\_ViewImports.cshtml"
using WebApplication1;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "C:\Users\herib\Documents\Fiserv-Rodrigo\Connect\Connect\Connect\Views\_ViewImports.cshtml"
using WebApplication1.Models;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"b35179b3796ee8fd83ffc195153495ccc1deef48", @"/Views/Response/Success.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"729efaa87342638aecfe1a972ce9f9f8dff55b4c", @"/Views/_ViewImports.cshtml")]
    public class Views_Response_Success : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
#nullable restore
#line 1 "C:\Users\herib\Documents\Fiserv-Rodrigo\Connect\Connect\Connect\Views\Response\Success.cshtml"
  
    ViewData["Title"] = "La compra se ha realizado con éxito";

#line default
#line hidden
#nullable disable
            WriteLiteral("<h1>");
#nullable restore
#line 4 "C:\Users\herib\Documents\Fiserv-Rodrigo\Connect\Connect\Connect\Views\Response\Success.cshtml"
Write(ViewData["Title"]);

#line default
#line hidden
#nullable disable
            WriteLiteral("</h1>\r\n<h2>Folio: ");
#nullable restore
#line 5 "C:\Users\herib\Documents\Fiserv-Rodrigo\Connect\Connect\Connect\Views\Response\Success.cshtml"
      Write(ViewBag.oid);

#line default
#line hidden
#nullable disable
            WriteLiteral("</h2>\r\n<p>Su compra de ");
#nullable restore
#line 6 "C:\Users\herib\Documents\Fiserv-Rodrigo\Connect\Connect\Connect\Views\Response\Success.cshtml"
           Write(ViewBag.chargetotal);

#line default
#line hidden
#nullable disable
            WriteLiteral(" MXN ha sido completada dar click en Home para regresar a la pantalla principal o elegir una de las pestañas de servicios</p>");
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<dynamic> Html { get; private set; }
    }
}
#pragma warning restore 1591
