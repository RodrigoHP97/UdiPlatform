window.addEventListener("message", receiveMessage, false);

var final_url = $('#action').val() + '/connect/gateway/processing'
if (!($('#form_udi')[0].getAttribute('action'))) {
    var url = $('#action').val() + '/connect/gateway/processing';
    $('#form_udi').attr('action', url);
}
var sep_conf = { "HMACSHA256": "|", "SHA256": "" };

$('#hash_algorithm').val($('#hash_action').val());
$(document).ready(function () {
    $('#action').on('change', function () {
        var url = $('#action').val() + '/connect/gateway/processing';
        $('#form_udi').attr('action', url);
    });

    $('#hash_action').on('change', function () {
        $('#hash_algorithm').val($('#hash_action').val());
    });

    var obj_opt = [
        {
            "direct": {
                "recurringInstallmentCount": false,
                "recurringInstallmentPeriod": false,
                "recurringInstallmentFrequency": false,
                "recurringComments": false,
                "ponumber": false,
                "authenticateTransaction": false,
                "threeDSRequestorChallengeIndicator": false,
                "assignToken": false,
                "numberOfInstallments": false,
                "installmentsInterest": false
            }
        },
        {
            "msi": {
                "recurringInstallmentCount": false,
                "recurringInstallmentPeriod": false,
                "recurringInstallmentFrequency": false,
                "recurringComments": false,
                "ponumber": false,
                "authenticateTransaction": false,
                "threeDSRequestorChallengeIndicator": true,
                "assignToken": false,
                "numberOfInstallments": true,
                "installmentsInterest": true
            }
        },
        {
            "3ds": {
                "recurringInstallmentCount": false,
                "recurringInstallmentPeriod": false,
                "recurringInstallmentFrequency": false,
                "recurringComments": false,
                "ponumber": false,
                "authenticateTransaction": true,
                "threeDSRequestorChallengeIndicator": true,
                "assignToken": false,
                "numberOfInstallments": true,
                "installmentsInterest": true
            }
        },
        {
            "tokenization": {
                "recurringInstallmentCount": false,
                "recurringInstallmentPeriod": false,
                "recurringInstallmentFrequency": false,
                "recurringComments": false,
                "ponumber": false,
                "authenticateTransaction": false,
                "threeDSRequestorChallengeIndicator": false,
                "assignToken": true,
                "numberOfInstallments": false,
                "installmentsInterest": false
            }
        },
        {
            "concurrent": {
                "recurringInstallmentCount": true,
                "recurringInstallmentPeriod": true,
                "recurringInstallmentFrequency": true,
                "recurringComments": true,
                "ponumber": true,
                "authenticateTransaction": false,
                "threeDSRequestorChallengeIndicator": false,
                "assignToken": false,
                "numberOfInstallments": false,
                "installmentsInterest": false
            }
        }
    ];

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
    var separator = sep_conf[$('#hash_action').val()];

    var mapped_Form = filtered_form.map(function (vals) {
        return vals.value
    })
    
    hashdata.message = mapped_Form.join(separator);
    hashdata.sharedsecret = $('#sharedsecret').val();
    var newHash;
    $.ajax({
        type: 'POST',
        url: '/HashExtended/HashHMAC/',
        context: $form,
        data: hashdata,
        success: function (response) {
            console.log('se generó hash', response);
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