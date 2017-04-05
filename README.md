# ngx-loggly-logger

## Description
Simple library to log to loggly in Angular

## Installation

Version 4.0 has only been tested with angular cli and angular 4, if it does not work for you try version 0.0.21

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
    
    import { LogglyService } from 'ngx-loggly-logger/dist/src/loggly.service';
    
    constructor(private _logglyService:LogglyService) {
        }
        
    // Init to set key and tag and sendConsoleErrors boolean    
    this._logglyService.push({
        'logglyKey': 'Your Loggly Key goes here',
        'sendConsoleErrors' : true, // Optional set true to send uncaught console errors
        'tag' : 'loggly-logger'
    });
    
    
    // To send logs to loggly
    this._logglyService.push('Your log message');
    ```


