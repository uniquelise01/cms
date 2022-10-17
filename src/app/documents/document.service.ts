import { Injectable, EventEmitter } from '@angular/core';
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";
import { Document } from "./document.model";

@Injectable({
    providedIn: 'root'
})

export class DocumentService {
    documents: Document[] = [];
    documentSelectedEvent = new EventEmitter<Document>();

    constructor() {
        this.documents = MOCKDOCUMENTS;
    }

    getDocuments(){
        return this.documents.slice();
    }

    getDocument(id: string){
        return this.documents.find((document) => document.id === id);
    }
}