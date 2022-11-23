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
            .get("http://localhost:3000/documents")
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
            .put('http://localhost:3000/documents', documents, {
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
        if (!document) {
            return;
        }
    
        const pos = this.documents.findIndex(d => d.id === document.id);
    
        if (pos < 0) {
          return;
        }
    
        this.http.delete('http://localhost:3000/documents/' + document.id)
            .subscribe(
                (response: Response) => {
                this.documents.splice(pos, 1);
                this.sortAndSend();
                }
            );
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

    addDocument(document: Document) {
        if (!document) {
            return;
        }
    
        document.id = '';
    
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
    
        this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
          document,
          { headers: headers })
            .subscribe(
                (responseData) => {
                    this.documents.push(responseData.document);
                    this.sortAndSend();
                }
            );
    }

    updateDocument(originalDocument: Document, newDocument: Document) {
        if (!originalDocument || !newDocument) {
            return;
        }
    
        const pos = this.documents.findIndex(d => d.id === originalDocument.id);
    
        if (pos < 0) {
            return;
        }
    
        newDocument.id = originalDocument.id;
        newDocument._id = originalDocument._id;
    
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
    
        // update database
        this.http.put('http://localhost:3000/documents/' + originalDocument.id,
            newDocument, { headers: headers })
            .subscribe(
                (response: Response) => {
                this.documents[pos] = newDocument;
                this.sortAndSend();
                }
            );
    }
}