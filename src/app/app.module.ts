import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { UploadFileService } from './services/upload-file.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [ UploadFileService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
