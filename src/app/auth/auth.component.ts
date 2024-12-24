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
  ngOnInit() { 
    if (localStorage.getItem("user")){
      this.router.navigate(['/search']);
    }
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
saveUser(body:any){

  fetch('http://127.0.0.1:8000/users/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    this.router.navigate(['/search']);

  })
  .catch(error => {
    // Handle errors
    console.error('There was a problem with the fetch operation:', error);
  })
}
   loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider).then((data) => {
      console.log(data.user)
        localStorage.setItem("user",JSON.stringify(data.user))
        console.log(data.user)
        this.router.navigate(['/search']);
        window.location.reload()
      })


  }

  register = () => {
    let email:string = this.form.value.email || ""
    let password:string = this.form.value.password || ""
    console.log(email,password)
    createUserWithEmailAndPassword(this.auth,email,password)
    .then((data:any) => {
      localStorage.setItem("user",JSON.stringify(data.user))
      this.saveUser({
        "display_name":data.user.displayName || data.user.email,
        "email":data.user.email,
        "image":data.user.photoURL || ""
    })
      console.log(data.user)
      
    })
    .catch(err => {
      console.log(err.code)
      this.error = this.makeFirebaseErrorString(err.code)
    })
  }

 registerWithGoogle = () => {
  const provider = new GoogleAuthProvider()
  signInWithPopup(this.auth,provider).then((data:any) => {
    console.log(data.user)
      localStorage.setItem("user",JSON.stringify(data.user))
    //   this.saveUser({
    //     "display_name":data.user.displayName || data.user.email,
    //     "email":data.user.email,
    //     "image":data.user.photoURL || ""
    // })
      
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
        this.registerWithGoogle()
      }
      else{
        this.loginWithGoogle()
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
