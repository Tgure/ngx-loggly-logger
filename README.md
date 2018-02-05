# ngx-loggly-logger [![Build Status](https://travis-ci.org/Tgure/ngx-loggly-logger.svg?branch=master)](https://travis-ci.org/Tgure/ngx-loggly-logger)

## Description
Simple library to log to loggly in Angular

## Installation

Version 5.x is for angular 5, 4.x is for angular 4, if you are on earlier versions of angular try version 0.0.21

To install follow this procedure:

1. __npm install ngx-loggly-logger --save__
2. Add __LogglyService__ import to your __@NgModule__ like example below
    ```js
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { MyTestApp } from './my-test-app';
    import { NgxLogglyModule } from 'ngx-loggly-logger';

    @NgModule({
        providers:    [ ],
        imports:      [ BrowserModule, NgxLogglyModule.forRoot() ],
        declarations: [ MyTestApp ],
        bootstrap:    [ MyTestApp ]
    })
    export class MyTestAppModule {}
    ```
3. Use the following in your components, etc.
    ```js

    import { LogglyService } from 'ngx-loggly-logger';

    constructor(private _logglyService:LogglyService) {
        }

    // Init to set key and tag and sendConsoleErrors boolean
    this._logglyService.push({
        logglyKey: 'Your Loggly Key goes here',
        sendConsoleErrors : true, // Optional set true to send uncaught console errors
        tag : 'loggly-logger'
    });


    // To send logs to loggly
    this._logglyService.push('Your log message');
    ```


