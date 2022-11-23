import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})

export class ContactService {
    contacts: Contact[] = [];
    contactSelectedEvent = new EventEmitter<Contact>();
    contactChangedEvent = new EventEmitter<Contact[]>();
    contactListChangedEvent = new Subject<Contact[]>();
    maxContactId: number;

    constructor(private http: HttpClient){
        this.maxContactId = this.getMaxId();
    }

    getContacts() {
        this.http
            .get<Contact[]>("http://localhost:3000/contacts")
            .subscribe(
                (contacts: Contact[]) => {
                   this.contacts = contacts;
                   this.maxContactId = this.getMaxId();
                   this.contacts.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0);
                   this.contactListChangedEvent.next(this.contacts.slice());
                },
                (error: any) => {
                   console.log(error);
                }
            );
    }

    storeContacts() {
        let contacts = JSON.stringify(this.contacts);
        const headers = new HttpHeaders({'Content-Type': 'application/json'});

        this.http
            .put('http://localhost:3000/contacts', contacts, {
                headers: headers,
            })
            .subscribe(() => {
                this.contactListChangedEvent.next(this.contacts.slice());
            }
            )
            
    }

    getContact(id: string): Contact {
        return this.contacts.find((contact) => contact.id === id);
    }

    deleteContact(contact: Contact) {

        if (!contact) {
          return;
        }
    
        const pos = this.contacts.findIndex(d => d.id === contact.id);
    
        if (pos < 0) {
          return;
        }
    
        // delete from database
        this.http.delete('http://localhost:3000/contacts/' + contact.id)
          .subscribe(
            (response: Response) => {
              this.contacts.splice(pos, 1);
              this.sortAndSend();
            }
          );
    }

    getMaxId(): number {
        let maxId = 0;
    
        this.contacts.forEach(contact => {
            const currentId = parseInt(contact.id);
            if (currentId > maxId){
                maxId = currentId;
            }
        })
        return maxId;
    }

    addContact(contact: Contact) {
        if (!contact) {
          return;
        }
    
        contact.id = '';
    
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
    
        this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
          contact,
          { headers: headers })
          .subscribe(
            (responseData) => {
              // add new document to documents
              this.contacts.push(responseData.contact);
              this.sortAndSend();
            }
          );
    }

    updateContact(originalContact: Contact, newContact: Contact) {
        if (!originalContact || !newContact) {
          return;
        }
    
        const pos = this.contacts.findIndex(d => d.id === originalContact.id);
    
        if (pos < 0) {
          return;
        }
    
        newContact.id = originalContact.id;
        newContact._id = originalContact._id;
    
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
    
        // update database
        this.http.put('http://localhost:3000/contacts/' + originalContact.id,
          newContact, { headers: headers })
          .subscribe(
            (response: Response) => {
              this.contacts[pos] = newContact;
              this.sortAndSend();
            }
          );
      }
}