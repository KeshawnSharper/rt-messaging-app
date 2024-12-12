import { Component } from '@angular/core';
import { Amplify } from 'aws-amplify';
import outputs from "../../../amplify_outputs.json";
import { AmplifyAuthenticatorModule, AuthenticatorService } from '@aws-amplify/ui-angular';
import { signInWithRedirect } from 'aws-amplify/auth';

// await signInWithRedirect({
//   provider: 'Google'
// });

Amplify.configure(outputs);


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [AmplifyAuthenticatorModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  title = 'amplify-angular-template';
  constructor(public authenticator: AuthenticatorService) {
    Amplify.configure(outputs);
  }
}
