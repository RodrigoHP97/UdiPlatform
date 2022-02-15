
var sep_conf = {
    "HMACSHA256": {
        "separator": "",
        "controller": "HashHMAC",
        "name":"hashExtended"
    }
};
var jpost = new Object;
var list = [];
var post = new Object;
var repost = {}
var Req_Obj = new Object;
var orderObj = new Object;
var redirect = new Object;
var onComplete = new Object;
var par_Obj = new Object;

var final = {};

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

        var jval = $('#type_of_selling').children(":selected").attr("id");



        if (jval != 'keyvalidation') {

            var general_form = value.filter(function (case_config) {
                if (Object.keys(case_config)[0] == 'general') {
                    return case_config;
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
                if (Object.keys(value)[0] != 'post' && Object.keys(value)[0] != 'redirect' && Object.keys(value)[0] != 'parentChild' && Object.keys(value)[0] != 'onComplete') {

                    list.push(value.name);

                    if (value.label != undefined) {

                        var div = '<div class="form-group col-md-4 col-xs-6" id="' + value.name + '_field"></div>';

                        var label = '<label class="control-label col-sm-12" id="' + value.name + '_label">' + value.label + '</label>';


                        $('#div_master').append(div);


                        //validamos tipo de input
                        if (value.type == "select") {


                            var select = label + '<select class="form-control" id="' + value.name + '" name="' + value.name + '"parent="'+ value.parent+'" style="width: 200px"></select>';

                            $('#' + value.name + '_field').append(select);



                            value.options.map(function (values) {

                                var option = '<option style="width: 200px" id="' + values.id + '"  value="' + values.value + '">' + values.label + '</option>';

                                $('#' + value.name).append(option);


                            })

                        }


                        else {
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

                    }
                    else {

                        var input = '<input id="' + value.name + '"></input>';

                        $('#div_master').append(input);

                        Object.keys(value).map(function (attributes) {

                            $('#' + value.name).attr(attributes, value[attributes]);

                        })
                    }
                }
                else
                {
                    if (Object.keys(value)[0] == 'post') { jpost = value.post; pay_post = value.post; Req_Obj = value.parentChild }
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

function sendTrans() {

    if (!Req_Obj) {
        Object.keys(jpost).map(function (key) {
            var ex_Obj = jpost[key];
            for (const i in ex_Obj) {
                console.log(ex_Obj, i, ex_Obj[i]);
                if (i == 'number') {
                    jpost[key][i] = $('#' + i).val().split(' ').join('');
                }
                else {
                    jpost[key][i] = $('#' + i).val();
                }
            }

        })
    }
   
    postData($('#apikey').val(), $('#apisec').val());


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


function postData(apiKey, apiSec) {
    var hashdata = new Object;
    var paysend = arrJ(Req_Obj, {});
    if (!paysend['order']) {
        Object.assign(paysend, orderGen())
    }
    else {
        Object.assign(paysend.order, orderGen().order)
    }
    jpost.payload = JSON.stringify(paysend);
    jpost.clientId = uuidv4()
    jpost.timezone = Date.now();
    var message = apiKey + jpost.clientId + jpost.timezone + jpost.payload;
    var controller = sep_conf[$('#hash_action').val()].controller; 
    
    hashdata.message = message;
    hashdata.sharedsecret = apiSec;
    var newHash;
    $.ajax({
        type: 'POST',
        url: '/HashExtended/' +controller+'/',
        data: hashdata,
        success: function (response) {
            console.log('se genero hash', response);
        },
        complete: function (response) {
            $('#hashExtended').val(response.responseJSON.replace(/\"/g, ""));
            newHash = response.responseJSON.replace(/\"/g, "");
            jpost.sign = newHash;

            post.url = $('#action').val() + redirect.url + redirect.id;

            post.Httpmethod = redirect.Httpmethod;

            post.async = redirect.async;
             
            post.headers = {};

            post.controller = redirect.controller;

            repost.ResponseCatcher = redirect.ResponseCatcher;

            post.Payload = jpost.payload;

            post.url_params = redirect.param;

            post.headers["Accept"] = redirect.content

            post.headers["Content-type"] = redirect.content

            post.headers["Api-Key"] = $('#apikey').val();

            post.headers["Client-Request-Id"] = jpost.clientId;

            post.headers["Timestamp"] = jpost.timezone;

            post.headers["Message-Signature"] = jpost.sign;

            console.log('data', post);

            ExecTrans(post);
            return newHash;
        }
    });
    return jpost.sign;
};

function ExecTrans(params) {

    var data = {};

    data.post = JSON.stringify(params);

    $.ajax({
        type: params.Httpmethod,
        url: window.location.origin + '/' + params.controller + '/' + params.url_params,
        dataType: 'json',
        data: data,
        success: function (response) {
            console.log('respuesta', response);
            SuccessPage(response);
        }
    })
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
            $('#modal_id').append(msj_div);
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
            $('#modal-content').append(msj_div);
            var txn_button = '<button id="' + ret.id + '" type="button" onclick="voidTrans(' + JSON.parse(params)[ret.key] + ')" class="center col-sm-12 btn-danger">'+ret.label+'</button>'
            $('#' + ret.id+'_btn').append(txn_button);
        }

    })
}

function close_modal() {

    $("#success_tic").modal('hide');
}

