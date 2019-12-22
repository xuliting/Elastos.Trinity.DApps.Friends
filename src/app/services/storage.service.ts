import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {
  }

  public setDID(value: any) {
    return this.storage.set("dids", JSON.stringify(value)).then((data) => {
      console.log('Stored DID', data)
    });
  }

  public getDID(): Promise<any> {
    return this.storage.get("dids").then((data) => {
      console.log(data)
      return JSON.parse(data);
    });
  }
}
