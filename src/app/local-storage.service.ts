import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storageChangeSubject = new Subject<StorageEvent>();
  storageChange$ = this.storageChangeSubject.asObservable();
  constructor() {
    window.addEventListener('storage', (event: StorageEvent) => {
      this.storageChangeSubject.next(event);
    });
  }
}
