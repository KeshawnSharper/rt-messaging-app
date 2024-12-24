import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule} from '@angular/router';
import { LocalStorageService } from '../local-storage.service';
import {getAuth} from "firebase/auth"

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  image:any= localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || '{}').photoURL : "../../assets/9334228.jpg"
  checkUser= signal(localStorage.getItem("user"))
  constructor(private localStorageService: LocalStorageService,private router: Router) {}

  ngOnInit() {
    this.localStorageService.storageChange$.subscribe((event: StorageEvent) => {
        // Do something when 'yourKey' changes in localStorage
        console.log(localStorage.getItem("user"))
        this.image = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || '{}').photoURL : "../../assets/9334228.jpg"
      
    });
  }
  logout(){
    localStorage.clear()
    this.router.navigate(['/auth']);
  }

}
