#!/usr/bin/env node

'use strict';
var program = require('commander');
var extIP = require('./extIP');

var collect = function (service, services) {
    services.push(service);
    return services;
};

program
    .option('-R, --replace', 'replace services set with -s insted of adding')
    .option('-s, --services <url>', 'url of service that returns the IP in the HTML body, one per -s ', collect, [])
    .option('-t, --timeout <msec>', 'set timeout per request', parseInt)
    .option('-P, --parallel', 'set to parallel mode');


program.on('--help', function () {
    console.log('This program prints the external IP of the machine.\n' +
        'All arguments are optional.');
    console.log('Examples:');
    console.log('$ external-ip');
    console.log('$ external-ip -P -t 1500 -R -s http://icanhazip.com/ -s http://ifconfig.me/ip');
});

program.parse(process.argv);


var generateConfig = function (cliConf) {
    var config = {};
    config.getIP = cliConf.parallel ? 'parallel' : 'sequential';
    if (cliConf.timeout) {
        config.timeout = cliConf.timeout;
    }
    if (cliConf.replace){
        config.replace = cliConf.replace;
    }
    if(cliConf.services.length){
        config.services = cliConf.services;
    }
    return config;
};


var getIP = extIP(generateConfig(program));

getIP(function (err, ip) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(ip);
});