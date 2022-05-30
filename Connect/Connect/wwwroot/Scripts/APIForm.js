
var sep_conf = {
    "HMACSHA256": {
        "separator": "",
        "controller": "HashHMAC",
        "name":"hashExtended"
    }
};

$(document).ready(function () {
    $(document).ajaxStart(function () {
        $('#bckgloaderframe').removeClass('hide');
    }).ajaxStop(function () {
        $('#bckgloaderframe').addClass('hide');
    });
});

$(document).ready(function () {
    $(document).ajaxStart(function () {
        $('#bckgloader').removeClass('hide');
    }).ajaxStop(function () {
        $('#bckgloader').addClass('hide');
    });
});
var jpost = new Object;
var list = [];
var post = new Object;
var repost = {}
var services_conf;
var version;
var patch = {};
var orderObj = new Object;
var redirect = new Object;
var onComplete = new Object;
var par_Obj = new Object;
var Req_Obj = new Object;
var final = {};
var auth;
var authParent;
var Sredirect;
var authpatch;
var threeDsfunction;
var t_request = new Object;

function sort_by_key(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function load_config() {
    
    $('#div_master').remove();
    const jconf =
        fetch("/Configurations/API.json")
            .then(response => {
                return response.json();
            })
            .then(data => { return Promise.resolve(data) });

    //Armamos formulario
    jconf.then((value) => {
        Req_Obj = {};
        var jval = $('#type_of_selling').children(":selected").attr("id");



        if (jval != 'keyvalidation') {

            var general_form = value.filter(function (case_config) {
                if (Object.keys(case_config)[0] == 'general') {
                    return case_config;
                }

            });

            value.filter(function (case_config) {
                if (Object.keys(case_config)[0] == 'partial') {
                    services_conf = case_config['partial'];
                }

            });

            var form = value.filter(function (case_config) {
                if (Object.keys(case_config)[0] != 'general') {

                    return case_config;
                }

            });
            var types = form.filter(function (e) { return e[$('#type_of_selling').val()] })[0]
            var gen_Sort = types[$('#type_of_selling').val()].concat(general_form[0].general);
           
        }
        else {
            var general_form = value.filter(function (case_config) {
                if (Object.keys(case_config)[0] == 'keyvalidation') {
                    return case_config;
                }

            });
            var gen_Sort = (general_form[0].keyvalidation);
        }


        
            gen_Sort = sort_by_key(gen_Sort, "order");

            $('#buttonData').before('<div id="div_master"></div>');

            gen_Sort.map(function (value) {
                if (Object.keys(value)[0] != 'post' &&
                    Object.keys(value)[0] != 'redirect' &&
                    Object.keys(value)[0] != 'parentChild' &&
                    Object.keys(value)[0] != 'onComplete' &&
                    Object.keys(value)[0] != '3ds' &&
                    Object.keys(value)[0] != '3ds' &&
                    Object.keys(value)[0] != 'services') {

                    list.push(value.name);
                    input_loader(value)
                }
                else
                {
                    //Mapeamos checkbox de servicios
                    if (Object.keys(value)[0] == 'services') {
                        servicesMapper(value.services);
                    }
                    if (Object.keys(value)[0] == 'post') { jpost = value.post; pay_post = value.post;  }
                    if (Object.keys(value)[0] == 'parentChild') { Req_Obj = value.parentChild }
                    if (Object.keys(value)[0] == 'onComplete') { onComplete = value.onComplete }
                    if (Object.keys(value)[0] == 'redirect') {
                        Object.keys(value.redirect).map(function (ind) {
                            redirect[ind] = value.redirect[ind]
                        })
                    }
                }

            })

            $('#hash_algorithm').val($('#hash_action').val());

            if ($('#number').val() != undefined) {
                document.getElementById('number').addEventListener('input', function (e) {
                    e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
                });
            }
        });
}

function servicesMapper(serv) {

    serv.map(function (check) {
        if (services_conf) {
            services_conf.map(function (trans) {
                if (trans[check]) {
                    //construimos formulario escondido 
                    var checkbox = trans[check].form;
                    if (checkbox) {
                        checkbox.map(function (value) {
                            input_loader(value)

                        })
                        
                    }
                    if (trans[check].input) {
                        input_loader(trans[check].input)
                    }

                    if (trans[check].version) {
                        version = trans[check].version;
                    }

                    if (trans[check].redirect) {
                        Sredirect = trans[check].redirect
                    }
                }
            })
        }


    })

}

function input_loader(value) {

    if (value.label != undefined) {

        //input loader


        //validamos tipo de input
        if (value.type == "select") {

            if (value.subtype == 'month') {
                value.options = monthArrayLoader();
            }
            if (value.subtype == 'year') {
                value.options = yearArrayLoader();
            }
            var div = '<div class="form-group col-md-4 col-xs-6 ' + value.class + '" master="'+value.master +'"  id="' + value.name + '_field"></div>';

            var label = '<label class="control-label col-sm-12" id="' + value.name + '_label">' + value.label + '</label>';


            $('#div_master').append(div);
            var select = label + '<select class="form-control" id="' + value.name + '" name="' + value.name + '"parent="' + value.parent + '" style="width: 200px"></select>';

            $('#' + value.name + '_field').append(select);



            value.options.map(function (values) {

                var option = '<option style="width: 200px" id="' + values.id + '"  value="' + values.value + '">' + values.label + '</option>';

                $('#' + value.name).append(option);


            })

        }


        else {
            if (value.type != "checkbox") {
            var div = '<div class="form-group col-md-4 col-xs-6 ' + value.class + '" id="' + value.name + '_field"></div>';

            var label = '<label class="control-label col-sm-12" id="' + value.name + '_label">' + value.label + '</label>';


            $('#div_master').append(div);

           
                var input_div = label + '<div class="item-box input-group" id="' + value.name + '_input"></div>';

                $('#' + value.name + '_field').append(input_div);

                var input = '<input class="form-control" id="' + value.name + '"  style="width: 200px"></input>';

                $('#' + value.name + '_input').append(input);


                Object.keys(value).map(function (attributes) {

                    if (value[attributes] != '') {
                        $('#' + value.name).attr(attributes, value[attributes]);
                    }

                })
            }
            else {
                $('#'+ value.name + '_field').remove();
                var div_c = document.createElement('div');
                div_c.setAttribute('id', value.name + '_field');
                div_c.setAttribute('class','input-group-append')
                $('#serviceTab').append(div_c);

                var input = document.createElement('input');
                input.setAttribute('id', value.name + '_input');
                input.setAttribute('type', 'checkbox');
                input.setAttribute('onclick', 'validateState("' + value.name + '","' + value.action + '","' + value.parent + '")');


                $('#' + value.name + '_field').append(input);

                var label = document.createElement('label');
                label.setAttribute('id', value.name + '_label');
                label.innerHTML = value.label;
                $('#' + value.name + '_field').append(label);
                document.getElementById(value.name + '_input').checked = JSON.parse(value.state.toLowerCase());
                validateState(value.name, value.action, value.parent );
            }

        }

    }
    else {

        var input = '<input id="' + value.name + '"></input>';

        $('#div_master').append(input);

        Object.keys(value).map(function (attributes) {

            $('#' + value.name).attr(attributes, value[attributes]);

        })
    }
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
// función de mapeo de post
function arrJ(obj, res, par, child) {
    var result = {};
    var subres = {};
    //var final={}
    if (Object.keys(res).length == 0) {
        obj.map(function (Objv, i) {
            Object.values(Objv).map(function (Obv, j) {
                if (Objv.parent == Obv) {
                    if (Objv.value) {
                        result[Objv.parent] = Objv.value;
                    }
                    else {
                        if (Objv.child) {
                            var child_element = $("[parent='" + Objv.child + "']");
                            var parent_element = $("[parent='" + Objv.parent + "']");

                            if (par != Objv.parent && parent_element.length > 0 && child == Objv.parent) {

                                if (par) {
                                    //console.log(par,child,JSON.stringify(result),Objv) 
                                    if (!result[par]) {
                                        final[par] = {};

                                    }
                                    //console.log(par,Objv, JSON.stringify(result),child_element.length,parent_element.length)
                                    if (!subres[Objv.child]) {
                                        //console.log(par,Objv,JSON.stringify(subres),JSON.stringify(result))
                                        subres[Objv.child] = {};
                                    }

                                    parent_element.map(function (i, input) {
                                        //console.log(par,child,JSON.stringify(result),JSON.stringify(subres),Objv)
                                        subres[input.id] = $('#' + input.id).val().split(' ').join('');

                                    })

                                    child_element.map(function (i, input) {

                                        subres[Objv.child][input.id] = $('#' + input.id).val().split(' ').join('');;
                                    })
                                    final[par][Objv.parent] = subres;

                                }
                            }
                            else {
                                if (!par) {
                                    //console.log(obj,{},Objv.parent,Objv.child,JSON.stringify(final))
                                    arrJ(obj, {}, Objv.parent, Objv.child)
                                }
                            }
                        }
                        else {
                            if (!result[Objv.parent]) {
                                result[Objv.parent] = {};
                            }


                            var element = $("[parent='" + Objv.parent + "']");
                            var ele_l = element.length;
                            if (ele_l > 0) {
                                element.map(function (i, input) {
                                    result[Objv.parent][input.id] = $('#' + input.id).val().split(' ').join('');;

                                })

                            }
                        }
                        if (result[par]) {
                            final = result;
                            // console.log(JSON.stringify(final),i)
                        }
                    }
                }

            })
        })
    }

    // console.log(final,result)
    return Object.assign(final, result)
}


function validateCard(obj) {
    auth=false
    if (Object.keys(Req_Obj).length == 0) {
        Object.keys(jpost).map(function (key) {
            obj[key] = {};
            var ex_Obj = jpost[key];
            for (const i in ex_Obj) {
                console.log(ex_Obj, i, ex_Obj[i]);
                if (i == 'number') {
                    obj[key][i] = $('#' + i).val().split(' ').join('');
                }
                else {
                    obj[key][i] = $('#' + i).val();
                }
            }

        })
        return obj;
    }
}

function sendTrans() {

    if (!tokenize) {
        postData($('#apikey').val(), $('#apisec').val(), Post_ReqGen(), 'primary', '');
    }
    else {
        postData($('#apikey').val(), $('#apisec').val(), Tok_ReqGen(), 'primary', '');
    }
    

}
function show_pwd(el) {
    if (el) {
        var elem = el.parentElement.parentElement.children[0];
        var id = el.parentElement.parentElement.children[0].id
        if (elem.type == "password") {
            elem.type = "text";
            $('#'+id+'_span').removeClass('fa fa-eye-slash').addClass('fa fa-eye');
        } else {
            elem.type = "password";
            $('#' + id + '_span').removeClass('fa fa-eye').addClass('fa fa-eye-slash');
        }
    }
}

$(document).ready(function () {
    load_config();
    show_pwd();
    $('#action').on('change', function () {
        var url = $('#action').val() + '/connect/gateway/processing';
        $('#form_udi').attr('action', url);
    });

    $('#hash_action').on('change', function () {
        $('#hash_algorithm').val($('#hash_action').val());
    });

    $('#type_of_selling').on('change', function () {
        load_config();
 
    });

});


function postData(apiKey, apiSec, payL, Case, transId) {

    var hashdata = new Object;

    var typeCase = Case;

    var payload = JSON.stringify(payL);
    var clientId =  uuidv4();
    var timezone = Date.now();
    var message = apiKey + clientId + timezone + payload;
    var controller = sep_conf[$('#hash_action').val()].controller; 
    
    hashdata.message = message;
    hashdata.sharedsecret = apiSec;


    var sign = MessageSignatureGen(hashdata, controller);

    post = Request_loader(post, sign, timezone, clientId, payload,typeCase,transId);

    ExecTrans(post);
};



function MessageSignatureGen(hashdata, controller) {

    var result=$.ajax({
        type: 'POST',
        url: '/HashExtended/' + controller + '/',
        data: hashdata,
        async: false,
        success: function (response) {
            console.log(response)
        }
    });

    return result.responseJSON.replace(/\"/g, "")
}



function Post_ReqGen() {

    var paysend = {};
    if (Object.keys(Req_Obj).length > 0) {
        paysend = arrJ(Req_Obj, {});
        if (!paysend['order']) {
            Object.assign(paysend, orderGen())
        }
        else {
            Object.assign(paysend.order, orderGen().order)
        }   
    }
    else {
        paysend = validateCard({});
    }

    if (auth) {
        var authReq = {};
        authReq[authParent] = {};
        $("[parent='" + authParent + "']").map(function (index, input) {

            if (input.getAttribute('concat_type') == 'URL') {
                var val_in = window.location.origin + $('#' + input.id).val();

            }
            else {
                var val_in = $('#' + input.id).val();
            }

            authReq[authParent][input.id] = val_in;

        })
        Object.assign(paysend, authReq);

    }

    return paysend;

}


function Request_loader(params, message, time, client, request, typeCase, transId) {

    params.headers = {};

    heads = headerGen(typeCase);

    if (transId != '') {
        transId = '/' + transId;
    }

    params.url = $('#action').val() + heads.url + transId;

    params.Httpmethod = heads.Httpmethod;

    params.async = heads.async;
    
    params.controller = heads.controller;

    params.url_params = heads.param;

    params.headers["Accept"] = heads.content

    params.headers["Content-type"] = heads.content

    params.Payload = request;

    params.headers["Api-Key"] = $('#apikey').val();

    params.headers["Client-Request-Id"] = client;

    params.headers["Timestamp"] = time;

    params.headers["Message-Signature"] = message;

    console.log('data', params);

    return params;

}

function headerGen(typeCase) {

    if (typeCase == 'primary') {

        return redirect;

    }
    else {
        return Sredirect;
    }
}

function ExecTrans(params) {

    var data = {};

    data.post = JSON.stringify(params);


    if (validateCardNumber($('#number').val())) {
 
        $.ajax({
            type: params.Httpmethod,
            url: window.location.origin + '/' + params.controller + '/' + params.url_params,
            dataType: 'json',
            data: data,
            error: function (response) {
                console.log(response);
            },
            success: function (response) {

                //console.log('respuesta', response);
                if (JSON.parse(response).Code == 'Error') {
                    $('#threeds_tic', window.parent.document).removeClass('hide')
                    FailurePage(response);
                    final = {};
                }
                else if (!JSON.parse(response).Code) {
                    SuccessPage(response)
                    final = {};
                }
                else {
                    threedsAuthProcessor(response);
                    final = {}
                }

            }
        })
    }
    else {
        FailurePage('{"Message":"No. Tarjeta no valida"}');
    }
}

function yearArrayLoader() {

    var yarray = [];
    for (var i = 0; i < 30; i++) {
        var date = new Date();
        var year = date.getFullYear() + i
        var value = (date.getFullYear() + i).toString().substr(-2);
        if (value.length < 2) {
            value = '0' + val;
        }
        var dateobj = new Object;
        dateobj.id = year;
        dateobj.label = year;
        dateobj.value = value;
        yarray.push(dateobj)
    }

    return yarray;
}

function monthArrayLoader() {
    var marray = [];
    for (var i = 0; i < 12; i++) {
        var date = new Date(2020, i, 1);
        var month = date.toLocaleString('default', { month: 'long' });
        var mobj = new Object();
        mobj.id = month;
        mobj.label = month;
        var val = (i + 1).toString();
        if (val.length < 2) {
            val = '0' + val;
        }
        mobj.value = val;
        marray.push(mobj)
    }
    return marray;

}

function patchLoader(code,vers, transId) {


    patch = getPatch(code, vers, version[vers].request);
    console.log(patch)

    patch['authenticationType'] = version[vers].ReqVal;

    var request = postData($('#apikey').val(), $('#apisec').val(), patch, 'secondary', transId);

    console.log(request)


}

function threeDsformLoader(jform, response) {
    var htform;
    var input = "";
    var html;

    Object.keys(response).map(function (resp) {
        console.log(resp)
        jform.map(function (form) {
            if (form.type == 'form') {

                htform = '<form action="' + response[form["action"]] + '" target="threeds_tic" method="POST" id="formAcs">'
                
            }
            else {

                if (response[form["value"]] && resp == form["value"]) {
                    input = input+'<input name="' + form["name"] + '" id="'+form["name"]+'" type="hidden" value="' + response[form["value"]] + '">'

                }
                
            }
            
        })
        html = htform + input + '</form>'

    })
    console.log(html)
    return html;
}

function orderGen() {

    var order = "FD";
    var d = new Date();
    var oid_str = d.getFullYear().toString() + (d.getMonth() + 1).toString() + d.getDate().toString() + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString() + d.getMilliseconds().toString();
    order = order + oid_str;
    console.log(order);
    orderObj.order = { "orderId": "" };
    orderObj.order.orderId = order;
    return orderObj;
}

function SuccessPage(params) {
    $("#success_tic").modal('show');
    onComplete.map(function (ret) {

        if (ret.type != 'button') {
            $('#txn' + ret.id + '_header').remove();
            $('#txn' + ret.id).remove();
            var message_str = document.createElement(ret.type);
            var msj_div = document.createElement('div');
            msj_div.setAttribute('id', 'txn' + ret.id);
            message_str.setAttribute('id', 'txn' + ret.id + '_header');
            $('#modal_success_id').append(msj_div);
            if (ret.label) {
                var message = ret.label;
                if (ret.key) {


                    //message_str.innerHTML = ret.label
                    var Obj;
                    var msj;
                    var sub_msj = "";
                    ret.key.map(function (keys) {


                        var subObj = JSON.parse(params)[keys];
                        if (subObj) {
                            Obj = subObj
                            msj = subObj;
                            //message_str.innerHTML = message + msj;
                        }

                        if (typeof (keys) != 'string') {
                            keys.map(function (arr, i) {
                                sub_msj = sub_msj + Obj[arr]
                                if (i === keys.length - 1) {

                                    msj = sub_msj;
                                }
                            })

                        }
                        if (msj) {
                            message_str.innerHTML = message + msj;
                        }
                    })

                }
                else {
                    message_str.innerHTML = message;
                }

            }

            $('#txn' + ret.id).append(message_str);
        }
        else {
            $('#' + ret.id + '_btn').remove();
            var msj_div = document.createElement('div');
            msj_div.setAttribute('id', ret.id + '_btn');
            $('#modal-success-content').append(msj_div);
            var txn_button = '<button id="' + ret.id + '" type="button" onclick="voidTrans(' + JSON.parse(params)[ret.key] + ')" class="center col-sm-12 btn-danger">'+ret.label+'</button>'
            $('#' + ret.id+'_btn').append(txn_button);
        }

    })
}

function close_modal() {
    $('#threeds_tic', window.parent.document).modal('hide')
    $('#threeds_tic', window.parent.document).addClass('hide')
    var range = document.createRange();
    range.selectNodeContents(document.getElementById("modal_success_id"));
    range.selectNodeContents(document.getElementById("modal_error_id"));
    range.deleteContents();
    $("#success_tic").modal('hide');
    $("#error_tic").modal('hide');
}

function FailurePage(params) {
    $('#txnerror').remove();
    var msj = JSON.parse(params).Message
    var msj_div = document.createElement('h2');
    msj_div.setAttribute('id', 'txnerror');
    $('#modal_error_id').append(msj_div);
    $("#error_tic").modal('show');
    msj_div.innerHTML = msj;

}

const validateCardNumber = number => {
    //Check if the number contains only numeric value  
    //and is of between 13 to 19 digits
    number=number.split(' ').join('');
    const regex = new RegExp("^[0-9]{13,19}$");
    if (!regex.test(number)) {
        return false;
    }

    return luhnCheck(number);
}

const luhnCheck = val => {
    let checksum = 0; // running checksum total
    let j = 1; // takes value of 1 or 2

    // Process each digit one by one starting from the last
    for (let i = val.length - 1; i >= 0; i--) {
        let calc = 0;
        // Extract the next digit and multiply by 1 or 2 on alternative digits.
        calc = Number(val.charAt(i)) * j;

        // If the result is in two digits add 1 to the checksum total
        if (calc > 9) {
            checksum = checksum + 1;
            calc = calc - 10;
        }

        // Add the units element to the checksum total
        checksum = checksum + calc;

        // Switch the value of j
        if (j == 1) {
            j = 2;
        } else {
            j = 1;
        }
    }

    //Check if it is divisible by 10 or not.
    return (checksum % 10) == 0;
}

function Split_transaction() {

    var first= new Object;

    var last = new Object;

    var Arr_r = [];

    first = Post_TokGen();
        
    last = Post_TokPay(); 

    Arr_r.push(first);

    Arr_r.push(last);

    return Arr_r;

}

function Post_TokGen() {

    //Generamos Token aquí


}

function Post_TokPay() {
    //Generamos botón aquí


}

function validateState(val,type,parent) {

    var state = document.getElementById(val + '_input').checked;
    t_request = {};
    if (state) {

        if (Sredirect) {
            if (Sredirect.split_trans) {

                t_request = Split_transaction();

            }
        }

        $("[master='" + val + "']").map(function (index, cls) {

            $('#' + cls.id).removeClass('hide')
            auth = true; authParent = parent;   

        })
    }
    else {
        $("[master='" + val + "']").map(function (index, cls) {

            $('#' + cls.id).addClass('hide')
            auth = false;

        })

    }

}

function threedsAuthProcessor(params) {
    
    if (JSON.parse(params).Code == 'FINALIZING') {
        
        $('#threeds_tic', window.parent.document).removeClass('hide')
        var resp_auth = JSON.parse(JSON.parse(params).Message);
        var vs = JSON.parse(params).Version
        console.log(resp_auth)
        //generamos el form de la respuesta del PATCH
        var form = version[vs].form;
        var requestArr = version[vs].request;
        //Mapeamos respuesta 
        var final_form = threeDsformLoader(form, resp_auth,requestArr);
        $('#div_master').append(final_form)
        document.getElementById('formAcs').submit();
        $('#threeds_tic').modal('show');
        //Mandamos al iframe los datos como header,ipgtransactionId y completar la transaccioón
        authpatch = getPatch(JSON.parse(params).Code, JSON.parse(params).Version, requestArr);
        var mapper = version[vs].resultMapper
        console.log(authpatch)
        post.Payload = authpatch;
        post.url_params = 'PatchTransaction';
        post.url = $('#action').val() + heads.url + '/' +JSON.parse(params).TransId;;
        post.Payload.securityCode = $('#securityCode').val();
        $('#threeds_tic_id').attr('obj', JSON.stringify(post))
        $('#threeds_tic_id').attr('mapper', JSON.stringify(mapper))
        $('#threeds_tic_id').attr('complete', JSON.stringify(onComplete))
        $('#formAcs').remove();
        final = {};
    }
    else {
        console.log(params)
        document.getElementById('authframe').innerHTML = ""
        var iframeauth = JSON.parse(JSON.parse(params).Message).methodForm;
        var vers = JSON.parse(params).Version;
        var transactionId = JSON.parse(params).TransId;
        $('#authframe').append(iframeauth);
        patchLoader(JSON.parse(params).Code,vers, transactionId);
        final = {};
    }
}

function getPatch(code,version,request) {
    var result;
    request.map(function (req) {
        if (req[code]) {
            result = req[code];
        }
    });
    return result;
}