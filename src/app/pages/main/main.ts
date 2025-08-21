import {Component, OnInit} from '@angular/core';
import {ChatResponse} from '../../services/models/chat-response';
import {ChatService} from '../../services/services/chat.service';
import {ChatList} from '../../components/chat-list/chat-list';
import {KeycloakService} from '../../utils/keycloak/keycloak';
import {MessageService} from '../../services/services/message.service';
import {MessageResponse} from '../../services/models/message-response';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [
    ChatList,
    DatePipe
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main implements OnInit{

  chats: Array<ChatResponse> = [];
  selectedChat: ChatResponse = {};
  chatMessages: MessageResponse[] = [];


  constructor(
    private chatService: ChatService,
    private keyCloakService: KeycloakService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getAllChats();
  }

  private getAllChats(){
    this.chatService.getChatsByReceiverId().subscribe({
      next: (res) => {
        this.chats = res;
      }
    })
  }

  logout() {
    this.keyCloakService.logout();
  }

  userProfile() {
    this.keyCloakService.accountManagment();
  }

  chatSelected(chatResponse: ChatResponse) {
    this.selectedChat = chatResponse;
    this.getAllChatsMessages(chatResponse.id as string);
    this.setMessagesToSeen();
    this.selectedChat.unreadMessages = 0;
  }

  private getAllChatsMessages(chatId: string){
    this.messageService.findChatMessages({
      'chat-id': chatId
    }).subscribe({
      next:(messages) => {
        this.chatMessages=messages;
      }
    })
  }

  private setMessagesToSeen() {

  }

  isSelfMessage(message: MessageResponse) {
    return message.senderId = this.keyCloakService.userId;
  }
}
