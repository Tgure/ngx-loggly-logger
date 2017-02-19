import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LogglyService} from './src/loggly.service';

export * from './src/loggly.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: []
})
export class NgxLogglyModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxLogglyModule,
      providers: [LogglyService]
    };
  }
}
