import { Component } from '@angular/core';
import { UploadFileService } from './services/upload-file.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  selectedFiles: FileList;
  coverImageUrl: any = null;

  constructor(private uploadService: UploadFileService) { }

  upload() {
    const file = this.selectedFiles.item(0);
    this.coverImageUrl = this.uploadService.uploadFile(file);
    console.log("Cover image url is: ", this.coverImageUrl);
  }
 
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }
}
