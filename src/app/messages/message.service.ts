import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();
  maxMessageId: number;

  constructor(private http: HttpClient) {}

  getMessages() {
    this.http
      .get("http://localhost:3000/messages")
      .subscribe(
        (messages: Message[]) => {
            this.messages = messages;
            this.maxMessageId = this.getMaxId();
            this.messages.sort((a, b) => a.id > b.id ? 1 : b.id > a.id ? -1 : 0);
            this.messageChangedEvent.next(this.messages.slice());
        },
        (error: any) => {
            console.log(error);
        }
      );
    this.storeMessages();
  }

  storeMessages() {
    let messages = JSON.stringify(this.messages);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http
        .put('http://localhost:3000/messages', messages, {
            headers: headers,
        })     
        .subscribe(() => {
          this.messageChangedEvent.next(this.messages.slice());
        })   
  }

  getMessage(id: string): Message {
    return this.messages.find((message) => message.id === id);
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    message.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.post<{ message: string, messages: Message }>('http://localhost:3000/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.messages.push(responseData.messages);
          this.sortAndSend();
        }
      );
  }

  getMaxId(): number {
    let maxId = 0;

    this.messages.forEach(message => {
        const currentId = parseInt(message.id);
        if (currentId > maxId){
            maxId = currentId;
        }
    })
    return maxId;
  }
}
