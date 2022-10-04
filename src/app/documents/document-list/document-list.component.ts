import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  
  documents: Document[] = [
    new Document('1', 'Math 101 Study Guide', 'Study Guide for Math 101 Exam 3', 'math101-study-guide.pdf', null),
    new Document('2', 'Psych 111 Ch. 1 Outline', 'Outline for Psych 111 Chapter 1 of H&O Personality Textbook', 'psych111-outline.pdf', null),
    new Document('3', 'WDD430 Practice Angular', 'WDD430 description for angular practice', 'angular-practice.html', null),
    new Document('4', 'COMM130 Module 4 Process Book', 'Module 4 Process book for shapes project', 'M04-process-book.pdf', null),
    new Document('5', 'BYU-I Unofficial Transcript', 'Unofficial transcript for Elise, 2022', 'unofficial-transcript.pdf', null)
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

}
