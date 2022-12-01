import { Component, ElementRef, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Contact } from 'src/app/contacts/contact.model';
import { ContactService } from 'src/app/contacts/contact.service';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  currentSender: Contact;
  @ViewChild('subject') subjectRef: ElementRef;
  @ViewChild('msgText') msgTextRef: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  constructor(private messageService: MessageService, private contactService: ContactService) { }

  ngOnInit(): void {
    this.contactService.getContact('101')
      .subscribe(
        response => {
          this.currentSender = response.contact;
        }
      )
  }

  onSendMessage() {
    const subject = this.subjectRef.nativeElement.value;
    const message = this.msgTextRef.nativeElement.value;
    const myMessage: Message = new Message('', '', subject, message, this.currentSender);
    this.messageService.addMessage(myMessage);
    this.onClear();
  }

  onClear() {
    this.subjectRef.nativeElement.value = '';
    this.msgTextRef.nativeElement.value = '';
  }

}
