import { Component,  OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchService } from '../search.service';
import { FormsModule } from '@angular/forms';
import { text } from 'express';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'search-root',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  standalone: true,
  imports: [FormsModule,CommonModule],
})
export class SearchComponent{
  private messageSubscription: Subscription;
  messages: any[] = [];
  newMessage: string = '';
  selectedMessage:any = {}
  beforeUpdate= ""
  lastMessagesObj : any=  {}
  user:any= JSON.parse(localStorage.getItem("user") || '{}') 
  lastMessageObjKeys :any[] = []
  selectedMessages: any[] = []
  users: any[] = []
  selectedReceiever:string = ""

  constructor(private socketService: SearchService,private router: Router) {
                         
    this.messageSubscription = this.socketService
      .on('message')
      .subscribe((data:any) => {
        if (data.function === "add")
        {this.messages.push(data.message)
          let oppEmail = data.message.sender_email !== this.user.email ? data.message.sender_email : data.message.receiver_email
          this.lastMessagesObj[oppEmail] = {id:data.message.id,email:oppEmail,date_sent:data.message.date_sent,text:data.message.text}
          this.lastMessageObjKeys = Object.keys(this.lastMessagesObj)
          this.selectUserMessages(this.selectedReceiever)
          this.loadUsers()
          ;}
        if (data.function === "delete"){
          this.messages = this.messages.filter(mess => mess.id !== data.message.id)
          this.lastMessagesObj = this.getLastMessages(this.messages)
          this.lastMessageObjKeys = Object.keys(this.lastMessagesObj)
        }
        if (data.function === "edit"){
          console.log(this.selectedMessage)
          let newMap = this.messages.map((message) => {
            if (message.id === this.selectedMessage.id){
              return {...message,text:this.selectedMessage.text}
            }
            return message
        });
        console.log(newMap)
          this.messages = newMap
        }

      });
  }

  ngOnInit() { 
    if (!localStorage.getItem("user")){
      this.router.navigate(['/auth']);
    }
    else{
  fetch(`http://127.0.0.1:8000/messages/${this.user.email}`)
  .then(response => response.json())
  .then(data => {
    this.messages = data
    this.loadUsers(data)

  })
  .catch(error => console.error('Error:', error));
    console.log("hello")

} 
  }
loadUsers(messages:any=null){
  messages = this.messages.length > 0 ? this.messages : messages
  console.log("kelly",messages)
  fetch(`http://127.0.0.1:8000/users/`)
  .then(response => response.json())
  .then((data:any[]) => {
    this.users = data  
    if (this.user.email){
      console.log(data)
      if (!data.filter(user => user.email === this.user.email)[0]){
        this.saveUser({
          "display_name":this.user.displayName || this.user.email,
          "email":this.user.email,
          "image":this.user.photoURL || ""
      })
      }
    }
    this.getLastMessages(data,messages)
  })
  .catch(error => console.error('Error:', error))
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
    console.log("saved",data)

  })
  .catch(error => {
    // Handle errors
    console.error('There was a problem with the fetch operation:', error);
  })
}
getLastMessages(users:any[]=[],messages:any[]=[]){
  users = this.users.length > 0 ? this.users : users
  messages = this.messages.length > 0 ? this.messages : messages
  console.log("users",users,"messages",messages)
  let obj:any = {}
  let dummy:any = {}
  users.map(user => {
    dummy[user.email] = {email:user.email,date_sent:"(No Messages Yet)",text:"(No Messages Yet)",image:user.image,display_name:user.display_name}
  })
  console.log(dummy)
  messages.map(mess => {
    let oppEmail = mess.sender_email !== this.user.email ? mess.sender_email : mess.receiver_email

    console.log(oppEmail,this.user.email)
      // check if 3rd party's last message is in the object
      if (obj.hasOwnProperty(oppEmail)){
        console.log(obj[oppEmail].id,mess.id)
        // check the last message sent
        if (obj[oppEmail].id < mess.id){
          obj[oppEmail] = {id:mess.id,email:oppEmail,date_sent:mess.date_sent,text:mess.text,image:dummy[oppEmail] ? dummy[oppEmail].image : "https://ptetutorials.com/images/user-profile.png",display_name:dummy[oppEmail] ? dummy[oppEmail].display_name : oppEmail}
        }

      }
      else{
        obj[oppEmail] = {id:mess.id,email:oppEmail,date_sent:mess.date_sent,text:mess.text,image:dummy[oppEmail] ? dummy[oppEmail].image : "https://ptetutorials.com/images/user-profile.png",display_name:dummy[oppEmail] ? dummy[oppEmail].display_name : oppEmail}
      }
    })
    
    console.log("filtered",users.filter(user => user.email in obj === false && user.email !== this.user.email))
    
    users.filter(user => user.email in obj === false && user.email !== this.user.email).map(user => {
      obj[user.email] = {id:user.id,email:user.email,date_sent:"(No Messages Yet)",text:"(No Messages Yet)",image:user.image,display_name:user.display_name}
    })
    console.log("obj",obj)
    this.lastMessageObjKeys = Object.keys(obj)
    console.log(Object.keys(obj)[0])
    let receiver = this.selectedReceiever !== "" ? this.selectedReceiever: Object.keys(obj)[0]
    this.selectUserMessages(receiver)

    this.lastMessagesObj =obj
}
selectMessage(message:any){
  console.log(this.lastMessagesObj)
  this.beforeUpdate = message
  this.selectedMessage = {id:message.id,text:message.text}
}

  sendMessage() {
    console.log(this.selectedReceiever)
    let body = {text:this.newMessage,sender_email:this.user.email,receiver_email:this.selectedReceiever}
    console.log(this.newMessage)
    fetch('http://127.0.0.1:8000/messages/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => {
      this.socketService.emit('message', {message:data,function:"add"});
      this.newMessage = '';
    })
    .catch(error => {
      // Handle errors
      console.error('There was a problem with the fetch operation:', error);
    });
   
  }

  deleteMessage(message:any) {
    console.log(this.newMessage)
    fetch('http://127.0.0.1:8000/messages/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })
    .then(data => {
      this.socketService.emit('message', {message:message,function:"delete"});
    })
    .catch(error => {
      // Handle errors
      console.error('There was a problem with the fetch operation:', error);
    });
   
  }

  updateMessage() {
    console.log(this.newMessage)
    fetch('http://127.0.0.1:8000/messages/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.selectedMessage)
    })
    .then(data => {
      this.socketService.emit('message', {message:this.selectMessage,function:"edit"});
    })
    .catch(error => {
      // Handle errors
      console.error('There was a problem with the fetch operation:', error);
    });
   
  }

  dontUpdateMessage() {
    this.selectedMessage = this.beforeUpdate
    console.log(this.selectedMessage)
  
   
  }
convertDate(d:Date){
  let date = new Date(d)
  return `${date.toLocaleDateString('en-US', { weekday: 'long' }).substring(0,3)}, ${date.toLocaleDateString('en-US', { month: 'long' }).substring(0,3)} ${date.getDate()} ${date.getFullYear()  !== new Date().getFullYear() ? date.getFullYear() : "" } ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric'})}`
}

  selectUserMessages(key:any,users:any[]=[]){
    console.log(key)
    users = this.users.length > 0 ? this.users : users
    this.selectedReceiever = key
    let dummy:any = {}
    users.map(user => {
      dummy[user.email] = {email:user.email,date_sent:"(No Messages Yet)",text:"(No Messages Yet)",image:user.image,display_name:user.display_name}
    })
    let filteredList = this.messages.filter(mess => (
      mess.sender_email === key || mess.receiver_email === key
    ))
    this.selectedMessages = filteredList.sort((a:any,b:any) => a.id - b.id ).map(msg => msg = {...msg,date_sent: this.convertDate(msg.date_sent),image:key in dummy ? dummy[key].image : "https://ptetutorials.com/images/user-profile.png"})

  }

}
