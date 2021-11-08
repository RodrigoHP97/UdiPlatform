window.addEventListener("message", receiveMessage, false);

var final_url = $('#action').val() + '/connect/gateway/processing'
if (!($('#form_udi')[0].getAttribute('action'))) {
    var url = $('#action').val() + '/connect/gateway/processing';
    $('#form_udi').attr('action', url);
}
var sep_conf = {
    "HMACSHA256": {
        "separator": "|",
        "controller": "HashHMAC",
        "name":"hashExtended"
    },
    "SHA256": {
        "separator": "",
        "controller": "HashNoHMAC",
        "name": "hash"
    }
};

function sort_by_key(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

const jconf=
fetch("/Configurations/Connect.json")
    .then(response => {
        return response.json();
    })
        .then(data => { return Promise.resolve(data) });

//Armamos formulario
jconf.then((value) => {
    var general_form = value.filter(function (case_config) {
        if (Object.keys(case_config)[0] == 'general') {
            return case_config;
        }

    });

    var gen_Sort = sort_by_key(general_form[0].general, "name");

    gen_Sort.map(function (value) {

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

    })
    $('#hash_algorithm').val($('#hash_action').val());
});


$(document).ready(function () {
    $('#action').on('change', function () {
        var url = $('#action').val() + '/connect/gateway/processing';
        $('#form_udi').attr('action', url);
    });

    $('#hash_action').on('change', function () {
        $('#hash_algorithm').val($('#hash_action').val());
    });


    $('#form_udi').submit(function (e) {
        
        e.preventDefault();
        e.returnValue = false;
        
        var d = new Date();
        var datestring = d.getFullYear() + ":" + ('0' + (d.getMonth() + 1)).slice(-2) + ":" + ('0' + d.getDate()).slice(-2)+ "-" +
            ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' +  d.getSeconds()).slice(-2);
        $('#txndatetime').val(datestring.replace(/\s*:\s*/, ":"));
       createExtendedHash(this);
        //return false; //I put it here as a fallback
    });

    $('#type_of_selling').on('change', function () {

        var input_obj = obj_opt.filter(function (newf) {
            var type_of_selling = $('#type_of_selling').val();
            var keys = Object.keys(newf)[0];
            if (type_of_selling == keys) {
                return newf[keys];
            }
        })[0];

        var type_of_selling = $('#type_of_selling').val();
        var key_arr = Object.keys(input_obj[type_of_selling]);

        key_arr.map(function (input) {
            var trans_input = input_obj[type_of_selling][input]
            if (trans_input) {
                $("#" + input).removeClass("hide");
                $("#" + input+'_label').removeClass("hide");
            }
            else {
                $("#" + input).addClass("hide");
                $("#" + input + '_label').addClass("hide");

            }
        })

    });

});

function receiveMessage(event) {
    if (event.origin != final_url)
        return;

    var elementArr = event.data.elementArr;
    forwardForm(event.data, elementArr);
}

function forwardForm(responseObj, elementArr) {
    var newForm = document.createElement("form");
    newForm.setAttribute('method', 'post');
    newForm.setAttribute('action', responseObj.redirectURL);
    newForm.setAttribute('id', 'newForm');
    newForm.setAttribute('name', 'newForm');
    document.body.appendChild(newForm);
    for (var i = 0; i < elementArr.length; i++) {
        var element = elementArr[i];
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        newForm.setAttribute('name', element.name);
        newForm.setAttribute('value', element.value);
        newForm.appendChild(input);
    }
    newForm.submit();
}

function createExtendedHash(form) {
    var $form = form
    var hashdata = new Object;
    var jform = $('#form_udi').serializeArray()
    var filtered_form = jform.filter(function (vals) {
        if (vals.name != '__RequestVerificationToken' && vals.name != 'hashExtended')
            return (vals.value)

    })
    var separator = sep_conf[$('#hash_action').val()].separator;
    var controller = sep_conf[$('#hash_action').val()].controller;
    var input_name = sep_conf[$('#hash_action').val()].name;

    $('#hashExtended').attr('name', input_name);

    var mapped_Form = filtered_form.map(function (vals) {
        return vals.value
    })
    
    hashdata.message = mapped_Form.join(separator);
    hashdata.sharedsecret = $('#sharedsecret').val();
    var newHash;
    $.ajax({
        type: 'POST',
        url: '/HashExtended/' +controller+'/',
        context: $form,
        data: hashdata,
        success: function (response) {
            console.log('se genero hash', response);
        },
        complete: function (response) {
            $('#hashExtended').val(response.responseJSON.replace(/\"/g, ""));
            form.submit();
            newHash = response.responseJSON.replace(/\"/g, "");
            return newHash;
        }
    });
};

//# sourceMappingURL=ConnectForm.js.map