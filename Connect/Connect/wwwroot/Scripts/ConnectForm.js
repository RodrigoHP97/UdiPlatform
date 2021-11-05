window.addEventListener("message", receiveMessage, false);

var final_url = $('#action').val() + '/connect/gateway/processing'
if (!($('#form_udi')[0].getAttribute('action'))) {
    var url = $('#action').val() + '/connect/gateway/processing';
    $('#form_udi').attr('action', url);
}
$(document).ready(function () {
    $('#action').on('change', function () {
        var url = $('#action').val() + '/connect/gateway/processing';
        $('#form_udi').attr('action', url);
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
        createExtendedHash();
        var d = new Date();
        var datestring = d.getFullYear() + ":" + (d.getMonth() + 1) + ":" + d.getDate() + "-" +
            d.getHours() + ":" + d.getMinutes() + ":" + (d.getSeconds()+1);
        $('#txndatetime').val(datestring);
        this.submit();
        return false; //I put it here as a fallback
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

function createExtendedHash() {

    var hashdata = new Object;
    hashdata.chargetotal = $('#chargetotal').val();
    hashdata.checkoutoption = $('#checkoutoption').val();
    hashdata.currency = $('#currency').val();
    hashdata.hash_algorithm = $('#hash_algorithm').val();
    hashdata.paymentMethod = $('#paymentMethod').val();
    hashdata.responseFailURL = $('#responseFailURL').val();
    hashdata.responseSuccessURL = $('#responseSuccessURL').val();
    hashdata.storename = $('#storename').val();
    hashdata.timezone = $('#timezone').val();
    hashdata.transactionNotificationURL = $('#transactionNotificationURL').val();
    hashdata.txndatetime = $('#txndatetime').val();
    hashdata.txntype = $('#txntype').val();
    hashdata.sharedsecret = $('#sharedsecret').val();

    $.ajax({
        type: 'POST',
        url: '/HashExtended/HashHMAC/',
        data: hashdata,
        success: function (response) {
            $('#hashExtended').val(JSON.stringify(response));
        }
    });
};

//# sourceMappingURL=ConnectForm.js.map