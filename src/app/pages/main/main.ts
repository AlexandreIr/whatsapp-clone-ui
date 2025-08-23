import {Component, OnInit} from '@angular/core';
import {ChatResponse} from '../../services/models/chat-response';
import {ChatService} from '../../services/services/chat.service';
import {ChatList} from '../../components/chat-list/chat-list';
import {KeycloakService} from '../../utils/keycloak/keycloak';
import {MessageService} from '../../services/services/message.service';
import {MessageResponse} from '../../services/models/message-response';
import {DatePipe} from '@angular/common';
import {uploadMediaMessage} from '../../services/fn/message/upload-media-message';
import {PickerComponent} from '@ctrl/ngx-emoji-mart';
import {FormsModule} from '@angular/forms';
import {EmojiData} from '@ctrl/ngx-emoji-mart/ngx-emoji';
import {MessageRequest} from '../../services/models/message-request';

@Component({
  selector: 'app-main',
  imports: [
    ChatList,
    DatePipe,
    PickerComponent,
    FormsModule
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main implements OnInit{

  chats: Array<ChatResponse> = [];
  selectedChat: ChatResponse = {};
  chatMessages: MessageResponse[] = [];
  showEmojis: boolean = false;
  inputFile: any;
  messageContent: any = "";


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
    this.messageService.setMessagesToSeen({
      'chat-id': this.selectedChat.id as string
    }).subscribe({
      next: () => {}
    });
  }

  isSelfMessage(message: MessageResponse) {
    return message.senderId = this.keyCloakService.userId;
  }



  uploadMedia(target: EventTarget | null) {

  }

  onSelectEmojis(selectedEmoji: any) {
    const emoji: EmojiData = selectedEmoji.emoji;
    this.messageContent += emoji.native;
  }

  keyDown(event: KeyboardEvent) {
    if(event.key === 'Enter'){
      this.sendMessage();
    }
  }

  protected readonly onclick = onclick;

  onClick() {
    this.setMessagesToSeen();
  }

  sendMessage() {
    if(this.messageContent){
      const messageRequest: MessageRequest = {
        chatId: this.selectedChat.id,
        senderId: this.getSenderId(),
        receiverId: this.getReceiverId(),
        content: this.messageContent,
        type: "TEXT"
      };
      this.messageService.saveMessage({
        body: messageRequest
      }).subscribe({
        next:()=>{
          const message: MessageResponse = {
            senderId: this.getSenderId(),
            receiverId: this.getReceiverId(),
            content: this.messageContent,
            type: "TEXT",
            state: "SENT",
            createdAt: new Date().toString()
          };
          this.selectedChat.lastMessage = this.messageContent;
          this.chatMessages.push(message);
          this.messageContent = "";
          this.showEmojis = false;
        }
      })
    }
  }

  private getSenderId(): string {
    if(this.selectedChat.senderId === this.keyCloakService.userId){
      return this.selectedChat.senderId as string;
    }
    return this.selectedChat.receiverId as string;
  }

  private getReceiverId(): string{
    if(this.selectedChat.senderId === this.keyCloakService.userId){
      return this.selectedChat.receiverId as string;
    }
    return this.selectedChat.receiverId as string;
  }
}
