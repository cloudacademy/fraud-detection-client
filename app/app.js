(function ($) {
    'use strict';

    $(function () {

        // fetch DOM nodes
        var $formServerful = $('#form-serverful'),
            $formServerless = $('#form-serverless');

        $formServerful.data('client', new ServerfulWorkshopClient());
        $formServerless.data('client', new ServerlessWorkshopClient());

        $formServerful.data('getParamsFunc', readServerfulParams);
        $formServerless.data('getParamsFunc', readServerlessParams);

        // register DOM events
        $("form").on('click', 'button', function buttonClick() {
            // keep track of which button has been clicked
            $("button", $(this).parents("form")).removeAttr("clicked");
            $(this).attr("clicked", "true");
        });

        $("form").on('submit', function formSubmit() {
            var $this = $(this),
                $btn = $this.find('[clicked="true"]'),
                count = $btn.data('count') || 1,
                client = $this.data('client'),
                params = $this.data('getParamsFunc')();

            NProgress.start();
            $this.find('button').prop('disabled', true);
            client.config(params);
            client.send(count, function() {
                NProgress.done();
                $this.find('button').prop('disabled', false);
            });
            return false;  // avoid browser submit
        });

    });

    function readServerfulParams() {
        return {
            ECSEndpoint: $('#ecs-endpoint-serverful').val()
        };
    }

    function readServerlessParams() {
        return {
            AWSRegion: $('#aws-region-serverless').val(),
            CognitoIdentityPoolID: $('#cognito-pool-serverless').val(),
            KinesisStreamName: $('#stream-name-serverless').val()
        };
    }

})(window.jQuery);