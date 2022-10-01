import { Component, OnInit } from '@angular/core';

import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message('1', 'Math', 'Hello!', 'Fred'),
    new Message('2', 'English', 'Howdy!', 'George'),
    new Message('3', 'Science', 'Bonjour!', 'Weasley')
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}
