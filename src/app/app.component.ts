import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
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
  objectAnalyzed: any;
  currentUpload: any;
  analyzed = false;
  analyzedImageUrl: any;
  cloudVisionUrl = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCHjMXfcJAtgz9F5izEanwoLyr14hOe4GM';

  httpOptions = {
	  headers: new HttpHeaders({
	    'Content-Type':  'application/json'
	  })
  };

  public constructor(
  	private af: FirebaseApp,
  	private db: AngularFireDatabase,
  	private http: HttpClient){
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
        var imageUrl = uploadTask.snapshot.ref.getDownloadURL()
        	.then(res => {
        		this.analyzedImageUrl = res;
        		this.analyzeImage(res)
	        		.subscribe(result => {
	        			console.log(result);
	        			this.objectAnalyzed = result;
	        			this.analyzed = true; 
	        		});
    		})
      }
    );
  }

  public analyzeImage(imageUrl){
  	console.log("Image url is: ", imageUrl);
    
    //build data to be sent to cloud vision api
  	let data = {
	  "requests":[
	    {
	      "image":{
	        "source":{
	          "imageUri":
	            imageUrl
	        }
	      },
	      "features":[
	        {
	          "type":"LABEL_DETECTION",
	          "maxResults":3
	        }
	      ]
	    }
	  ]
	};

  	return this.http.post(this.cloudVisionUrl, data, this.httpOptions);
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
