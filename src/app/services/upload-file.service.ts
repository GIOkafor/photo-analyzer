import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  FOLDER = 'jsa-s3/';
  BUCKET = 'revmuzik-photo-upload-bucket';

  constructor() { }

  getS3Bucket(): any{
  	const bucket = new S3(
      {
        accessKeyId: environment.s3bucket.accessKeyId,
        secretAccessKey: environment.s3bucket.secretAccessKey,
        region: environment.s3bucket.region
      }
    );

    return bucket;
  }

  uploadFile(file){
  	const params = {
      Bucket: this.BUCKET,
      Key: this.FOLDER + file.name,
      Body: file,
      ACL: 'public-read'
    };
 
    this.getS3Bucket().upload(params, function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
 
      console.log('Successfully uploaded file.', data);
      return true;//experiment with returning 'data'
    });
  }
}
