import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"rt-messaging-app-7835e","appId":"1:978391556380:web:844f9b2f28da3334f0dad9","storageBucket":"rt-messaging-app-7835e.firebasestorage.app","apiKey":"AIzaSyA3IFRo07T3wQxR3ReQPhvhDCovzNGKVAQ","authDomain":"rt-messaging-app-7835e.firebaseapp.com","messagingSenderId":"978391556380","measurementId":"G-RRG3596KTM"})), provideAuth(() => getAuth())]
};
