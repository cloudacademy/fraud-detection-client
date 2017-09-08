(function ($) {
    'use strict';

    function ServerfulWorkshopClient() {
        // TBD
        console.log("New Serverful Workshop Client");
    }

    ServerfulWorkshopClient.prototype.config = function serverfulConfig(params) {
        this.ECSEndpoint = params.ECSEndpoint;
        if (!this.ECSEndpoint) {
            console.error(params);
            return alert("Wrong Serverful configuration");
        }
    };

    ServerfulWorkshopClient.prototype.send = function serverfulSend(count) {
        var records = _generateRecords(count),
            postData = {
                features: records
            };
        $.ajax({
            type: 'POST',
            url: this.ECSEndpoint,
            data: JSON.stringify(postData),
            contentType: "application/json",
            crossDomain: true,
            dataType: "json"
        }).success(function successCallback(data) {
            console.log(data);
            alert("Done.");
        }).fail(function failCallback(data) {
            console.error(data);
            alert("Something went wrong.");
        });
    };

    function ServerlessWorkshopClient() {
        console.log("New Serverless Workshop Client");
    }


    ServerlessWorkshopClient.prototype.config = function serverlessConfig(params) {
        this.AWSRegion = params.AWSRegion;
        this.CognitoIdentityPoolID = params.CognitoIdentityPoolID;
        this.KinesisStreamName = params.KinesisStreamName;
        if (!this.AWSRegion || !this.CognitoIdentityPoolID || !this.KinesisStreamName) {
            console.error(params);
            return alert("Wrong Serverless configuration");
        }
        // init region
        AWS.config.region = this.AWSRegion;
        // create credentials obj (can be reused)
        this.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: this.CognitoIdentityPoolID
        });
    };

    ServerlessWorkshopClient.prototype.send = function serverlessSend(count) {
        // re-configure AWS SDK (may have changed)
        AWS.config.credentials = this.credentials;
        AWS.config.region = this.AWSRegion;
        // generate random records
        var client = this,
            records = _generateRecords(count);
        // obtain temporary credentials
        AWS.config.credentials.get(function getCognitoCredentials(err) {
            if (err) {
                console.error(err, err.stack);
            } else {
                client.putRecords(records);
            }
        });
    };

    ServerlessWorkshopClient.prototype.putRecords = function serverlessPut(records) {
        // init kinesis client
        var kinesis = new AWS.Kinesis({
            apiVersion: '2013-12-02'
        });
        // build request params
        var params = {
            StreamName: this.KinesisStreamName,
            Records: records.map(function mapKinesisRecord(record) {
                return {
                    Data: JSON.stringify(record),
                    PartitionKey: "serverless-workshop"
                };
            })
        };
        // put records all at once
        kinesis.putRecords(params, function putRecordsCallback(err, data) {
            if (err) {
                console.error(err, err.stack);
            } else {
                console.log(data);
                alert("Done.");
            }
        });
    };

    function _generateRecords(count) {
        var records = [], i;
        for (i = 0; i < count; i += 1) {
            records.push(_generateRecord());
        }
        return records;
    }

    function _generateRecord() {
        var record = [], j;
        record.push(parseInt(generateRandomNumber(1, 100, 0)));
        for (j = 0; j < 28; j += 1) {
            record.push(generateRandomNumber(-1.95, +1.95));
        }
        record.push(generateRandomNumber(1, 250, 2));
        return record;
    }

    function generateRandomNumber(min, max, decimals) {
        var num = (Math.random() * (max - min) + min);
        if (typeof decimals !== 'undefined') {
            num = parseFloat(num.toFixed(decimals));
        }
        return num;
    }

    window.ServerfulWorkshopClient = ServerfulWorkshopClient;
    window.ServerlessWorkshopClient = ServerlessWorkshopClient;

})(window.jQuery);