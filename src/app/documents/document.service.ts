import { Injectable, EventEmitter } from '@angular/core';
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";
import { Document } from "./document.model";
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class DocumentService {
    documents: Document[] = [];
    documentSelectedEvent = new EventEmitter<Document>();
    documentChangedEvent = new EventEmitter<Document[]>();
    documentListChangedEvent = new Subject<Document[]>();
    maxDocumentId: number;

    constructor() {
        this.documents = MOCKDOCUMENTS;
        this.maxDocumentId = this.getMaxId();
    }

    getDocuments(){
        return this.documents.slice();
    }

    getDocument(id: string){
        return this.documents.find((document) => document.id === id);
    }

    deleteDocument(document: Document) {
        if (!document){
            return;
        }
        const pos = this.documents.indexOf(document);
        if (pos < 0){
            return;
        }
        this.documents.splice(pos, 1);
        this.documentChangedEvent.emit(this.documents.slice());
    }

    getMaxId(): number {
        let maxId = 0;
    
        this.documents.forEach(document => {
            const currentId = parseInt(document.id);
            if (currentId > maxId){
                maxId = currentId;
            }
        })
        return maxId;
    }

    addDocument(newDocument: Document){
        if(!newDocument){
            return;
        }
        
        this.maxDocumentId++;
        newDocument.id = String(this.maxDocumentId);
        this.documents.push(newDocument);
        let documentsListClone = this.documents.slice();
        this.documentListChangedEvent.next(documentsListClone);
    }

    updateDocument(originalDocument: Document, newDocument: Document) {
        if (!originalDocument || !newDocument){
            return;
        }
    
        const pos = this.documents.indexOf(originalDocument);
        if (pos < 0){
            return;
        }
    
        newDocument.id = originalDocument.id;
        this.documents[pos] = newDocument;
        let documentsListClone = this.documents.slice();
        this.documentListChangedEvent.next(documentsListClone);
    }
}