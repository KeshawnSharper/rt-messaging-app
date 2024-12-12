import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchService } from '../search.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'search-root',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class SearchComponent{
  private messageSubscription: Subscription;
  messages: string[] = [];
  newMessage: string = '';

  constructor(private socketService: SearchService) {
    this.messageSubscription = this.socketService
      .on('message')
      .subscribe((data) => {
        this.messages.push(data.text);
      });
  }

  sendMessage() {
    console.log(this.newMessage)
    this.socketService.emit('message', { text: this.newMessage });
    this.newMessage = '';
  }

}
