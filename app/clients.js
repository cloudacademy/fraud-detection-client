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

    ServerfulWorkshopClient.prototype.send = function serverfulSend(count, cb) {
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
        }).fail(function failCallback(data) {
            console.error(data);
            alert("Something went wrong.");
        }).done(cb);
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

    ServerlessWorkshopClient.prototype.send = function serverlessSend(count, cb) {
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
                client.putRecords(records, cb);
            }
        });
    };

    ServerlessWorkshopClient.prototype.putRecords = function serverlessPut(records, cb) {
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
                cb && cb();
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

    var fraudsRanges = {'V23': [-19.0, 5.0], 'V22': [-9.0, 8.0], 'V21': [-23.0, 27.0], 'V20': [-4.0, 11.0], 'V27': [-7.0, 3.0], 'V26': [-1.0, 3.0], 'V25': [-5.0, 2.0], 'V24': [-2.0, 1.0], 'V28': [-2.0, 2.0], 'V1': [-31.0, 2.0], 'V2': [-8.0, 22.0], 'V3': [-31.0, 2.0], 'V4': [-1.0, 12.0], 'V5': [-22.0, 11.0], 'V6': [-6.0, 6.0], 'V7': [-44.0, 6.0], 'V8': [-41.0, 20.0], 'V9': [-13.0, 3.0], 'V18': [-9.0, 4.0], 'V19': [-4.0, 5.0], 'V12': [-19.0, 1.0], 'V13': [-3.0, 3.0], 'V10': [-25.0, 4.0], 'V11': [-2.0, 12.0], 'V16': [-14.0, 3.0], 'V17': [-25.0, 7.0], 'V14': [-19.0, 3.0], 'V15': [-4.0, 2.0]};
    var notFraudsRanges = {'V23': [-45.0, 23.0], 'V22': [-11.0, 11.0], 'V21': [-35.0, 23.0], 'V20': [-54.0, 39.0], 'V27': [-23.0, 32.0], 'V26': [-3.0, 4.0], 'V25': [-10.0, 8.0], 'V24': [-3.0, 5.0], 'V28': [-15.0, 34.0], 'V1': [-56.0, 2.0], 'V2': [-73.0, 19.0], 'V3': [-48.0, 9.0], 'V4': [-6.0, 17.0], 'V5': [-114.0, 35.0], 'V6': [-26.0, 73.0], 'V7': [-32.0, 121.0], 'V8': [-73.0, 19.0], 'V9': [-6.0, 16.0], 'V18': [-5.0, 5.0], 'V19': [-7.0, 6.0], 'V12': [-15.0, 8.0], 'V13': [-6.0, 7.0], 'V10': [-15.0, 24.0], 'V11': [-5.0, 10.0], 'V16': [-10.0, 17.0], 'V17': [-17.0, 9.0], 'V14': [-18.0, 11.0], 'V15': [-4.0, 9.0]};

    function _generateRecord() {
        var record = [], j, range;
        var ranges = (Math.random() * 100 < 3 ? fraudsRanges : notFraudsRanges);
        record.push(parseInt(generateRandomNumber(1, 100, 0)));
        for (j = 1; j <= 28; j += 1) {
            range = ranges['V'+j];
            record.push(generateRandomNumber(range[0], range[1]));
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