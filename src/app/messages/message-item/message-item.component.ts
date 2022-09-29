import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cms-message-item',
  template: `
    <p>
      message-item works!
    </p>
  `,
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
