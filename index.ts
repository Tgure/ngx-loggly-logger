import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {LogglyService} from './src/loggly.service';

@NgModule({
    imports: [
        CommonModule,
        HttpModule
    ],
    declarations: [],
    exports: []
})
export class NgxLogglyModule {
    static forRoot(): ModuleWithProviders{
        return {
            ngModule: NgxLogglyModule,
            providers: [LogglyService]
        };
    }
}
