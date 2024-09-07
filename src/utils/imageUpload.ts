import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { error } from 'console';
import { exit } from 'process';

@Injectable()
export class FirebaseService {
  private logger: Logger = new Logger('FirebaseService');

  constructor() {
    const firebaseConfig =
      process.env.FIREBASE_CONFIG != undefined
        ? JSON.parse(process.env.FIREBASE_CONFIG)
        : '';

    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      storageBucket: 'gs://farm7-e6457.appspot.com',
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const bucket = admin.storage().bucket();

      const fileName = `images/${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      const [exists] = await fileUpload.exists();

      if (exists) {
        this.logger.log(`File ${fileName} already exists. Deleting it.`);
        await fileUpload.delete();
      }

      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      stream.on('error', (err) => {
        this.logger.error('File upload error:', err);
        throw new Error('File upload error');
      });

      stream.end(file.buffer);

      return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    } catch (error) {
      this.logger.error('Error uploading file:', error);
      throw new Error('Error uploading file');
    }
  }

  async deleteImage(file: string): Promise<boolean> {
    try {
      const bucket = admin.storage().bucket();

      const fileName = `images/${file}`;
      const fileUpload = bucket.file(fileName);

      const [exists] = await fileUpload.exists();

      if (exists) {
        await fileUpload.delete();
        this.logger.log(`File ${fileName} is Deleted.`);
      }
      return true;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }
}
