WebFont.load({
    google: {
        families: ['Roboto:400']
    }
});

jQuery(document).ready(function($){

    $("#contact_form").submit(function(e) {
        e.preventDefault();
    }).validate({
        rules: {
            name: "required",
            email: {
                required: true,
                email: true
            },
            phone: "required",
            msg: "required",

        },
        invalidHandler: function(event, validator) {
            ga('send', 'event', {eventCategory: 'CONTACTFORM', eventAction: 'NO-VALID'});
        },
        submitHandler: function (form) {
            var $element = $(form);
            var data = $element.serialize();
            $('#loading').fadeIn();
            $("#send").attr('disabled', true);

            $.ajax({
                type: 'POST',
                datatype: 'jsonp',
                url: "//karlisweb.me/api/webspace",
                data: data,
                beforeSend: function (){
                    response = "Paldies ka sazinājāties ar mums. Atbildēsim tuvākajā laikā.";
                    $("#contact_form").hide();
                    ga('send', 'event', {eventCategory: 'CONTACTFORM', eventAction: 'SUCCESS'});
                    $("#thanks").html(response).fadeIn();
                    setTimeout(function(){
                            $('#contactform-modal').modal('hide');
                    }, 3000);
                }
            });
            return false;
        }
    });
});