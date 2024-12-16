import { Component,inject} from '@angular/core';
import {getAuth,signInWithPopup,signInWithEmailAndPassword,GoogleAuthProvider,createUserWithEmailAndPassword} from "firebase/auth"
import { Auth } from '@angular/fire/auth';
import {FormGroup, FormControl} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  title = 'amplify-angular-template';
  auth = inject(Auth);
  component = "Register"
  error = ""
  form = new FormGroup({
    email: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
  });
  constructor(private router: Router) {
    // Amplify.configure(outputs);
  }

  makeFirebaseErrorString = (string:string) => {
    let newString = string
    newString = newString.slice(5).replace(/[\W_]+/g," ")
    let result = newString[0].toUpperCase()
    for (let i = 1; i < newString.length;i++){
            result += newString[i-1] === " " ? newString[i].toUpperCase() : newString[i]
    }
    return result
}
   loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider).then((data) => {
      console.log(data.user)
        localStorage.setItem("user",JSON.stringify(data.user))
        console.log(data.user)
        this.router.navigate(['/search']);
      })


  }

  register = () => {
    let email:string = this.form.value.email || ""
    let password:string = this.form.value.password || ""
    console.log(email,password)
    createUserWithEmailAndPassword(this.auth,email,password)
    .then((data:any) => {
      localStorage.setItem("user",JSON.stringify(data.user))
      console.log(data.user)
      this.router.navigate(['/search']);
    })
    .catch(err => {
      console.log(err.code)
      this.error = this.makeFirebaseErrorString(err.code)
    })
  }

 registerWithGoogle = () => {
  const provider = new GoogleAuthProvider()
  signInWithPopup(this.auth,provider).then((data) => {
    console.log(data.user)
      localStorage.setItem("user",JSON.stringify(data.user))
      this.router.navigate(['/search']);
      
    })
    .catch(err => {
      console.log(err)
      this.error = this.makeFirebaseErrorString(err.code)
    })
  }
  onSubmit(){
    if (this.component === "Register"){
      this.register()
    }
    else{
      this.login()
    }
  }

  onGoogleSubmit = () => {
      if (this.component === "Register"){
        this.loginWithGoogle()
      }
      else{
        this.registerWithGoogle()
      }
    
  }

  login = () => {
    console.log(this.form)
    let email:string = this.form.value.email || ""
    let password:string = this.form.value.password || ""
    console.log(email,password)
    signInWithEmailAndPassword(this.auth,email,password)
    .then((data) => {
      localStorage.setItem("user",JSON.stringify(data.user))
      console.log(data.user)
      this.router.navigate(['/search']);
    })
    .catch(err => {
      this.error = this.makeFirebaseErrorString(err.code)
      console.log(err.code)
    })
  }

  changeComponent = () => {
    if (this.component === "Register"){
      this.component = "Login"
      this.error = ""
    }
    else{
      this.component = "Register"
      this.error = ""
    }
  }

  

}
