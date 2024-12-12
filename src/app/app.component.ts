import { Component,NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { TodosComponent } from './todos/todos.component';
// import { Amplify } from 'aws-amplify';
// import outputs from '../../amplify_outputs.json';
// import { AmplifyAuthenticatorModule, AuthenticatorService } from '@aws-amplify/ui-angular';
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";

// Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet,NavbarComponent, FooterComponent],})

  
export class AppComponent {
}
  

