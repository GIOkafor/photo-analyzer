import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database'; 
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';
import * as firebase from 'firebase';
import * as _ from "lodash";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private basePath:string = '/uploads';
  image: any;
  currentUpload: any;

  public constructor(
  	private af: FirebaseApp,
  	private db: AngularFireDatabase){
  }

  ngOnInit(){}

  ngAfterViewInit(){

  }

  upload(upload: Upload){
  	let storageRef = this.af.storage().ref();
    let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success
        console.log("Success");
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
		    console.log('File available at', downloadURL);
			upload.url = uploadTask.snapshot.downloadURL;
		    upload.name = upload.file.name;

		    //this.saveFileData(upload);

		    //pass url to function for image rekognition
		    //key = AIzaSyCHjMXfcJAtgz9F5izEanwoLyr14hOe4GM
		    
		});
        
      }
    );
  }


  // Writes the file details to the realtime db
  //return image upload url
  private saveFileData(upload: any) {
    console.log("Uploading file: ", upload.name);
    const promise = this.db.list('uploads').push(upload);
  }

  detectFiles(event) {
	this.image = event.target.files;
  }

  uploadSingle() {
    let file = this.image.item(0);
    this.currentUpload = new Upload(file);
    this.upload(this.currentUpload);
  }
}

export class Upload {

  $key: string;
  file:File;
  name:string;
  url:string;
  progress:number;
  createdAt: Date = new Date();

  constructor(file:File) {
    this.file = file;
  }
}
