import {Component, EventEmitter, input, InputSignal, Output, output, signal} from '@angular/core';
import {ChatResponse} from '../../services/models/chat-response';
import {DatePipe} from '@angular/common';
import {UserResponse} from '../../services/models/user-response';
import {UserService} from '../../services/services/user.service';

@Component({
  selector: 'app-chat-list',
  imports: [
    DatePipe
  ],
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.scss'
})
export class ChatList {

  chats: InputSignal<ChatResponse[]> = input<ChatResponse[]>([]);
  searchNewContact = false;
  contacts: Array<UserResponse> = [];
  chatSelected = output<ChatResponse>();

  constructor(
    private userService: UserService
  ) {
  }


  searchContact(){
    this.userService.getAllUsers().subscribe({
      next:(users)=>{
        this.contacts = users;
        this.searchNewContact = true;
      }
    });
  }

  chatClicked(chat: ChatResponse) {
    this.chatSelected.emit(chat);
  }

  wrapMessage(lastMessage: string | undefined):string {
    if(lastMessage && lastMessage.length <= 20){
      return lastMessage;
    }
    // @ts-ignore
    return lastMessage.substring(0, 17) + "...";
  }

  selectContact(contact: UserResponse) {

  }
}
