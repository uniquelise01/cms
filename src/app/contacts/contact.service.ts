import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})

export class ContactService {
    contacts: Contact[] = [];
    contactSelectedEvent = new EventEmitter<Contact>();
    contactChangedEvent = new EventEmitter<Contact[]>();
    contactListChangedEvent = new Subject<Contact[]>();
    maxContactId: number;

    constructor(){
        this.contacts = MOCKCONTACTS;
        this.maxContactId = this.getMaxId();
    }

    getContacts(): Contact[] {
        return this.contacts
            .sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
            .slice();
    }

    getContact(id: string): Contact {
        return this.contacts.find((contact) => contact.id === id);
    }

    deleteContact(contact: Contact) {
        if (!contact){
            return;
        }
        const pos = this.contacts.indexOf(contact);
        if (pos < 0){
            return;
        }
        this.contacts.splice(pos, 1);
        this.contactChangedEvent.emit(this.contacts.slice());
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

    addContact(newContact: Contact){
        if(!newContact){
            return;
        }
        
        this.maxContactId++;
        newContact.id = String(this.maxContactId);
        this.contacts.push(newContact);
        let contactsListClone = this.contacts.slice();
        this.contactListChangedEvent.next(contactsListClone);
    }

    updateContact(originalContact: Contact, newContact: Contact) {
        if (!originalContact || !newContact){
            return;
        }
    
        const pos = this.contacts.indexOf(originalContact);
        if (pos < 0){
            return;
        }
    
        newContact.id = originalContact.id;
        this.contacts[pos] = newContact;
        let contactsListClone = this.contacts.slice();
        this.contactListChangedEvent.next(contactsListClone);
    }
}