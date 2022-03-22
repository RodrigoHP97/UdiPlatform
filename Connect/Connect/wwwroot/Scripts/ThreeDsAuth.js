
$(document).ready(function () {
    $(document).ajaxStart(function () {
        $('#bckgloaderframe', window.parent.document).removeClass('hide');
    }).ajaxStop(function () {
        $('#bckgloaderframe', window.parent.document).addClass('hide');
    });
});
var frame = window.parent.document.getElementById('threeds_tic_id');
var spost = frame.getAttribute('obj');
var jpost = JSON.parse(spost);

var data = {};
var apiKey = window.parent.document.getElementById('apikey').value;

var hashdata = new Object;
var onComplete = JSON.parse(window.parent.document.getElementById('threeds_tic_id').getAttribute('complete'));
jpost.Payload.acsResponse.cRes = jdata.cres;

console.log('authpatch', jpost);

var payload = JSON.stringify(jpost.Payload);
var clientId = uuidv4();
var timezone = Date.now();
var message = apiKey + clientId + timezone + payload;
var controller = "HashHMAC";
jpost.Payload = payload;
hashdata.message = message;
hashdata.sharedsecret = window.parent.document.getElementById('apisec').value;

jpost.headers.Timestamp = timezone;
jpost.headers['Client-Request-Id'] = clientId;
var sign = MessageSignatureGen(hashdata, controller);

jpost.headers['Message-Signature'] = sign;

data.post = JSON.stringify(jpost);

console.log(payload);

$.ajax({
    type: jpost.Httpmethod,
    url: window.location.origin + '/' + jpost.controller + '/' + jpost.url_params,
    dataType: 'json',
    data: data,
    success: function (response) {
        //console.log('respuesta', response);
        if (JSON.parse(response).Code == 'Error') {
            FailurePage(response);
            final = {};
        }
        else {
            SuccessPage(response)
        }
    }
})


function close_modal() {
    $('#threeds_tic', window.parent.document).modal('hide')
    var range = document.createRange();
    range.selectNodeContents(document.getElementById("modal_success_id"));
    range.selectNodeContents(document.getElementById("modal_error_id"));
    range.deleteContents();
    $("#success_tic").modal('hide');
    $("#error_tic").modal('hide');
}


function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function MessageSignatureGen(hashdata, controller) {

    var result = $.ajax({
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

function SuccessPage(params) {
    
    var msuccess = window.parent.document.getElementById('modal_success_id');

    onComplete.map(function (ret) {

        if (ret.type != 'button') {
            var txn_r = window.parent.document.getElementById('txn' + ret.id);
            var txn_h = window.parent.document.getElementById('txn' + ret.id + '_header');
            $(txn_h).remove();
            $(txn_r).remove();
            var message_str = document.createElement(ret.type);
            var msj_div = document.createElement('div');
            msj_div.setAttribute('id', 'txn' + ret.id);
            message_str.setAttribute('id', 'txn' + ret.id + '_header');
            $(msuccess).append(msj_div);
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
            
            $(msj_div).append(message_str);
        }
        else {
            var txn_btn = window.parent.document.getElementById(ret.id + '_btn');
            $(txn_btn).remove();
            var msj_div = document.createElement('div');
            msj_div.setAttribute('id', ret.id + '_btn');
            var msuccessc = $(window.parent.document.getElementById('modal-success-content'));
            $(msuccessc).append(msj_div);
            var txn_button = '<button id="' + ret.id + '" type="button" onclick="voidTrans(' + JSON.parse(params)[ret.key] + ')" class="center col-sm-12 btn-danger">' + ret.label + '</button>'
            $(msj_div).append(txn_button);
        }

    })
    $('#threeds_tic', window.parent.document).addClass('hide')
    $('#success_tic', window.parent.document).addClass('show')
    $('#success_tic', window.parent.document).modal('show')
}

function FailurePage(params) {

    var txnerror = window.parent.document.getElementById('txnerror');
    var modal_error_id = window.parent.document.getElementById('modal_error_id');
    $(txnerror).remove();
    var msj = JSON.parse(params).Message
    var msj_div = document.createElement('h2');
    msj_div.setAttribute('id', 'txnerror');
    $(modal_error_id).append(msj_div);  
    msj_div.innerHTML = msj;
    $('#threeds_tic', window.parent.document).addClass('hide')
    $('#threeds_tic', window.parent.document).modal('hide');
    $('#error_tic', window.parent.document).addClass('show')
    $('#error_tic', window.parent.document).modal('show')
}//Armamos request final