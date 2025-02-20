import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  static getFromSessionStorage(key: string) {
    const encodedData = sessionStorage.getItem(key);
    if (encodedData) {
      const decodedData = StorageService.getDecodedText(encodedData);
      if (decodedData) {
        const data = JSON.parse(decodedData);
        return data;
      }
    }
    return null;
  }

  static setToSessionStorage(key: string, value: any) {
    if (key && value) {
      //encodes to a base-64
      const data = JSON.stringify(value);
      if (data) {
        const encodedData = StorageService.getEncodedText(data);
        if (encodedData) {
          sessionStorage.setItem(key, encodedData);
        }
      }
    }
  }

  // to remove value from session storage
  static removeFromSessionStorage(key: string) {
    if (key) {
      // Remove value from session storage
      sessionStorage.removeItem(key);
    }
  }

  // clear value from session storage
  static clearAllSessionStorage() {
      // Clear all data
      sessionStorage.clear();
  }
  
  //to encode str
  static getEncodedText(str: string) {
    if (str) {
      return btoa(str);
    }
    return null;
  }

  //to decode str
  static getDecodedText(str: string) {
    if (str) {
      return atob(str);
    }
    return null;
  }
}
