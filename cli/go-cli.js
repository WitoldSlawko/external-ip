#!/usr/bin/env nodejs
'use strict';

//Dependencies
var extIP = require('../index');
var GetOpt = require('node-getopt');

//CLI parser Object
var getOpt = new GetOpt([
	['h',	'help'			,	'display this help'],
	['r',	'replace'       ,	'set to replace services with -s insted of adding'],
	['s',	'services=ARG+'	,	'add service, one per -s (if not set uses default list)'],
	['t',	'timeout=ARG'	,	'set timeout per request (default 500ms)'],
	['P',	'parallel'		,	'set to parallel mode (default sequential)']
])
.bindHelp()
.setHelp(
	"\nThis program prints the external IP of the machine.\n"+
	"Usage: go-cli [OPTION] or [OPTION] <arguement>.\n\n"+
	"If without options, runs with default configuration.\n\n"+
	"[[OPTIONS]]"+
	"\n\n Git: https://github.com/J-Chaniotis/external-ip"
)
.parseSystem();

//Config generator
var generateConfig = function (cliConf) {
    var config = {};
    config.getIP = cliConf.parallel ? 'parallel' : 'sequential';
    if (cliConf.timeout)
        config.timeout = parseInt(cliConf.timeout);
    if (cliConf.replace)
        config.replace = cliConf.replace;
    if(cliConf.services)
        config.services = cliConf.services;
    return config;
};
//Function that handles the output
var ipPrint = function(err,ip){
    if (err)
        console.log("Could not retrieve IP. Check internet connection.");
    else
        console.log(ip);
};

//Passes the config
var getIP = extIP( generateConfig(getOpt.options) );

//Runs the main thing
getIP(ipPrint);