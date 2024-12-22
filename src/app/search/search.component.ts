import { Component,  OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchService } from '../search.service';
import { FormsModule } from '@angular/forms';
import { text } from 'express';

@Component({
  selector: 'search-root',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class SearchComponent{
  private messageSubscription: Subscription;
  messages: any[] = [];
  newMessage: string = '';
  selectedMessage:any = {}
  beforeUpdate= ""

  constructor(private socketService: SearchService) {
                         
    this.messageSubscription = this.socketService
      .on('message')
      .subscribe((data:any) => {
        if (data.function === "add")
        {this.messages.push(data.message);}
        if (data.function === "delete"){
          console.log(data.message)
          this.messages = this.messages.filter(mess => mess.id !== data.message.id)
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
    // axios.get("http://127.0.0.1:8000/messages/")
    // .then(res => {
    //   console.log(res)
    // })
    fetch('http://127.0.0.1:8000/messages/')
  .then(response => response.json())
  .then(data => this.messages = data)
  .catch(error => console.error('Error:', error));
    console.log("hello")

} 
selectMessage(message:any){
  console.log(message)
  this.beforeUpdate = message
  this.selectedMessage = {id:message.id,text:message.text}
}

  sendMessage() {
    let body = {text:this.newMessage,sender_email:"awskeshawn@gmail.com",receiver_email:"ksharper@studentmba.org"}
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

}
