(function() {

    $(function() {

        // fetch DOM nodes
        var $sendRecordServerful = $('.send-serverful'),
            $sendRecordServerless = $('.send-serverless');

        // initialize workshop clients
        var serverfulWorkshopClient = new ServerfulWorkshopClient(),
            serverlessWorkshopClient = new ServerlessWorkshopClient();

        window.serverfulWorkshopClient = serverfulWorkshopClient;
        window.serverlessWorkshopClient = serverlessWorkshopClient;

        // register DOM events
        $('form').on('click', '.send-serverful', function() {
            var params = readServerfulParams();
            serverfulWorkshopClient.config(params);
            var count = $(this).data('count') || 1;
            serverfulWorkshopClient.send(count);
            return false;
        });

        $('form').on('click', '.send-serverless', function() {
            var params = readServerlessParams();
            serverlessWorkshopClient.config(params);
            var count = $(this).data('count') || 1;
            serverlessWorkshopClient.send(count);
            return false;
        });

    });

    function readServerfulParams() {
        return {
            'ECSEndpoint': $('#ecs-endpoint-serverful').val(),
        }
    }

    function readServerlessParams() {
        return {
            'AWSRegion': $('#aws-region-serverless').val(),
            'CognitoIdentityPoolID': $('#cognito-pool-serverless').val(),
            'KinesisStreamName': $('#stream-name-serverless').val(),
        }
    }

})();