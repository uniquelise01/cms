import { Injectable, EventEmitter } from '@angular/core';
import { Document } from "./document.model";
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class DocumentService {
    documents: Document[] = [];
    documentSelectedEvent = new EventEmitter<Document>();
    documentChangedEvent = new EventEmitter<Document[]>();
    documentListChangedEvent = new Subject<Document[]>();
    maxDocumentId: number;

    constructor(private http: HttpClient) {}

    getDocuments() {
        this.http
            .get("https://cms-wdd430-c5950-default-rtdb.firebaseio.com/documents.json")
            .subscribe(
                (documents: Document[]) => {
                   this.documents = documents;
                   this.maxDocumentId = this.getMaxId();
                   this.documents.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0);
                   this.documentListChangedEvent.next(this.documents.slice());
                },
                (error: any) => {
                   console.log(error);
                }
            );
    }

    storeDocuments() {
        let documents = JSON.stringify(this.documents);
        const headers = new HttpHeaders({'Content-Type': 'application/json'});

        this.http
            .put('https://cms-wdd430-c5950-default-rtdb.firebaseio.com/documents.json', documents, {
                headers: headers,
            })
            .subscribe(() => {
                this.documentListChangedEvent.next(this.documents.slice());
            }
            )
            
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

        this.storeDocuments();
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

        this.storeDocuments();
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

        this.storeDocuments();
    }
}