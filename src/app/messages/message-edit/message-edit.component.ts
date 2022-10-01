import { Component, ElementRef, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';

import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  currentSender = 'Elise';
  @ViewChild('subject') subjectRef: ElementRef;
  @ViewChild('msgText') msgTextRef: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  constructor() { }

  ngOnInit(): void {
  }

  onSendMessage() {
    const subject = this.subjectRef.nativeElement.value;
    console.log(subject);
    const message = this.msgTextRef.nativeElement.value;
    console.log(message);
    const myMessage = new Message('1', subject, message, this.currentSender);
    this.addMessageEvent.emit(myMessage);
    this.onClear();
  }

  onClear() {
    this.subjectRef.nativeElement.value = '';
    this.msgTextRef.nativeElement.value = '';
  }

}
