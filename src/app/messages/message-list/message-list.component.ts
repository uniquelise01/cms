import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cms-message-list',
  template: `
    <p>
      message-list works!
    </p>
  `,
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
