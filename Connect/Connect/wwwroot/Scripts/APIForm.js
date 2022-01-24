
var sep_conf = {
    "HMACSHA256": {
        "separator": "",
        "controller": "HashHMAC",
        "name":"hashExtended"
    }
};
var jpost = new Object;

var post = new Object;

var redirect = new Object;

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
            var gen_Sort = form[0][$('#type_of_selling').val()].concat(general_form[0].general);
           
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
                if (Object.keys(value)[0] != 'post' && Object.keys(value)[0] != 'redirect') {

                    if (value.label != undefined) {

                        var div = '<div class="form-group col-md-4 col-xs-6" id="' + value.name + '_field"></div>';

                        var label = '<label class="control-label col-sm-12" id="' + value.name + '_label">' + value.label + '</label>';


                        $('#div_master').append(div);


                        //validamos tipo de input
                        if (value.type == "select") {


                            var select = label + '<select class="form-control" id="' + value.name + '" name="' + value.name + '"style="width: 200px"></select>';

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
                    if (Object.keys(value)[0] == 'post') { jpost = value.post; pay_post = value.post}
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
function sendTrans() {


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


function postData(apiKey,apiSec) {
    var hashdata = new Object;
    jpost.payload = JSON.stringify(jpost);
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
            console.log('se genero hash', response);
        }
    })
}

//# sourceMappingURL=ConnectForm.js.map