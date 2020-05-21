import { SocketService } from './../../../Services/socket/socket.service'
import { Component, OnInit } from '@angular/core'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { Router } from '@angular/router'
import { Web3Model } from 'src/app/Models/web3.model'
import { Subscription } from 'rxjs'

@Component( {
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: [ './chat-room.component.scss' ]
} )
export class ChatRoomComponent implements OnInit {
  account: string
  spk: any
  users: Subscription
  constructor ( private web3service: Web3Service, private route: Router, private chat: SocketService ) { }

  ngOnInit() {
    // this.chat.listMessages()
    this.chat.getMessages()
      .subscribe( ( message: string ) => {
        console.log( 'Log: ChatRoomComponent -> ngOnInit -> message', message )
      } )
    this.chat.getUsers()
      .subscribe( ( userList: string ) => {
        console.log( 'Log: ChatRoomComponent -> ngOnInit -> userList', userList )
      } )

    this.chat.NewUser( { user: 'Dennis' } )
    this.chat.NewMessage( { user: 'Dennis', msg: 'hi there' } )
    // this.web3service.Web3Details$.subscribe( async ( data: Web3Model ) => {
    //   this.account = data.account
    //   this.spk = data.spk
    // } )
  }

  logOut = async () => {
    this.route.navigateByUrl( '/market' )
  }
}
