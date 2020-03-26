import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {
  }

  public setDIDs(value: any) {
    return this.storage.set("dids", JSON.stringify(value)).then((data) => {
      // console.log('Stored DID', data)
    });
  }

  public setFriends(value: any) {
    return this.storage.set("friends", JSON.stringify(value)).then((data) => {
      // console.log('Stored Friends', data)
    });
  }

  public getDIDs(): Promise<any> {
    return this.storage.get("dids").then((data) => {
      // console.log(data)
      return JSON.parse(data);
    });
  }

  public getFriends(): Promise<any> {
    return this.storage.get("friends").then((data) => {
      // console.log(data)
      return JSON.parse(data);
    });
  }
}
