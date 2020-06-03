var fs = require('fs');
var path = require('path');
var iot = require('aws-iot-device-sdk');
const { spawn } = require('child_process');
const Logger = require(`${__dirname}/logger`);

let configPath = path.join(__dirname, '..', '..','config')
var thingConfig = require(`${configPath}/iot/resources/thing.json`);
var endpointConfig = require(`${configPath}/iot/resources/endpoint.json`);

const thingName = thingConfig.thingName
const host = endpointConfig.endpointAddress
const localproxypath = path.join(__dirname, '..', '..','build', 'ubuntu18', 'localproxy');

let logger = Logger.getLogger('device-agent');
let argIotOptions = {
    region: '',
    destination: 'localhost:22',
    token: '',
    verbose: 5
}

let params = {
    keyPath: path.join(__dirname, '..', '..', 'config', 'iot', 'certs', `${thingName}.private.key`),
    certPath: path.join(__dirname,  '..', '..', 'config', 'iot', 'certs', `${thingName}.certificate.pem`),
    caPath: path.join(__dirname,  '..', '..', 'config', 'iot', 'certs', 'root.ca.bundle.pem'),
    clientId: thingName,
    host: host
 }
let device = iot.device(params);

 device.on('connect', function() {
    logger.info('Connected!');
    let topicName = `$aws/things/${thingName}/tunnels/notify`
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
    iotagent.on('error', (e) => logger.error(e))
    iotagent.on('close', (e) => logger.info(e))
    iotagent.stderr.on('data',(data) => {
        logger.error('stderr')
        logger.error(Buffer.from(data).toString())
    });

    iotagent.stdout.on('data', (data) => {
        logger.error('stdout')
        logger.error(Buffer.from(data).toString())
    })

}

