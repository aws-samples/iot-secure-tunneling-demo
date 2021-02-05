var path = require('path');
var iot = require('aws-iot-device-sdk');
var AWS = require('aws-sdk');
var superagent = require("superagent");

const { spawn } = require('child_process');
const Logger = require(`${__dirname}/logger`);

let configPath = path.join(__dirname, '..', '..','config');

var endpointConfig = require(`${configPath}/iot/resources/endpoint.json`);
var thingsConfig = require(`${configPath}/config.json`);

const host = endpointConfig.endpointAddress;
const localproxypath = path.join(__dirname, '..', '..','build', 'ubuntu18', 'localproxy');

getInstanceName().then(name => {
    
    var thingName = name;
    
    let params = {
        keyPath: path.join(__dirname, '..', '..', 'config', 'iot', 'certs', `${thingName}`, `${thingName}.private.key`),
        certPath: path.join(__dirname,  '..', '..', 'config', 'iot', 'certs', `${thingName}`, `${thingName}.certificate.pem`),
        caPath: path.join(__dirname,  '..', '..', 'config', 'iot', 'certs', 'root.ca.bundle.pem'),
        clientId: thingName,
        host: host
    };
    
    let device = iot.device(params);
    
    let logger = Logger.getLogger('device-agent');
    
    var destinations = thingsConfig.things.filter(t => t.name === thingName)[0].secureTunnelDestinations;
    
    let argIotOptions = {
        region: '',
        destination: destinations,
        token: '',
        verbose: 5
    };
    
    device.on('connect', function() {
        logger.info('Connected!');
        let topicName = `$aws/things/${thingName}/tunnels/notify`;
        logger.info(`Subscribing to ${topicName}...`);
        device.subscribe(topicName);
    
        topicName = `secure-tunnel-demo/ping/${thingName}`;
        logger.info(`Publishing heartbeat message...`);
        device.publish(topicName, JSON.stringify({ msg: 'I am up and running'}));
        setInterval(
            function() {
                let topicName = `secure-tunnel-demo/ping/${thingName}`;
                logger.info(`Publishing heartbeat message...`);
                device.publish(topicName, JSON.stringify({ msg: 'I am up and running'}));
            }, 
            60000
        );
    });

    device.on('message', function(topic, payload) {
        logger.info('A tunnel just got created:');
        logger.info(payload.toString());
        logger.info('opening the tunnel ... ');
        let jpayload = JSON.parse(payload.toString());
        argIotOptions.token = jpayload.clientAccessToken;
        argIotOptions.region = jpayload.region;
        try { 
            calliotagent();
        } catch (e) { 
            logger.error(e);
        }
    });

    const calliotagent = () => {
        const iotagent = spawn(localproxypath, [
            '-r', argIotOptions.region,
            '-d', argIotOptions.destination,
            '-t', argIotOptions.token,
            '-v', argIotOptions.verbose
        ]);
        iotagent.on('error', (e) => logger.error(e));
        iotagent.on('close', (e) => logger.info(e));
        iotagent.stderr.on('data',(data) => {
            logger.error('stderr');
            logger.error(Buffer.from(data).toString());
        });

        iotagent.stdout.on('data', (data) => {
            logger.error('stdout');
            logger.error(Buffer.from(data).toString());
        });
    };
});

function getInstanceName() {
    return new Promise(function(resolve, reject) {
       getInstanceIdentityDocument().then(id => {
         AWS.config.update({region: id.region });

        var ec2 = new AWS.EC2();
    
        var params = {
              Filters: [
                 {
                Name: "resource-id", 
                Values: [id.instanceId]
               }
              ]
        };
     
        ec2.describeTags(params, function(err, data) {
         if (err) reject(err);
         else {
            resolve(data.Tags.filter(d => d.Key === 'Name')[0].ResourceId);
         }
        });
       }); 
    });
}

function getInstanceIdentityDocument() {
    
    return new Promise(function(resolve, reject) {
        superagent.get("http://169.254.169.254/latest/dynamic/instance-identity/document").then(r => {
            return resolve(JSON.parse(r.text));
        }).catch(reject);    
    });
}