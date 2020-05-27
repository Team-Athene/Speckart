import { SocketService } from './../../../Services/socket/socket.service'
import { Component, OnInit } from '@angular/core'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router'
import { Web3Model } from 'src/app/Models/web3.model'
import { Subscription } from 'rxjs'
import { NgForm } from '@angular/forms'

@Component( {
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: [ './chat-room.component.scss' ]
} )
export class ChatRoomComponent implements OnInit {
  account: string
  spk: any
  state: any
  users: Subscription
  msg: string
  usersList: string[] = []
  msgsList: any[] = []
  name: string
  newMsg: {}
  room: string
  constructor ( private web3service: Web3Service, private activeRoute: ActivatedRoute, private route: Router, private chat: SocketService ) { }

  ngOnInit() {
    this.activeRoute.queryParams
      .subscribe( params => {
        this.room = params.room
      } )

    console.log( 'Log: ChatRoomComponent -> ngOnInit -> this.room', this.room )
    this.name = sessionStorage.getItem( 'name' )
    this.chatLoad()
  }
  chatLoad = async () => {
    const newUser = await this.chat.NewUser( { user: this.name, room: this.room } )
    this.usersList = await this.chat.listUsers( this.room ) as []
    const temp = await this.chat.listMessages( this.room ) as any[]
    this.msgsList = temp.map( x => {
      let t = JSON.parse( x )
      if ( t.room === this.room ) {
        console.log( 'Log: ChatRoomComponent -> chatLoad -> t', t )
        return t
      }
    } )
    await this.chat.getMessages()
      .subscribe( async ( message: string ) => {
        this.usersList = await this.chat.listUsers( this.room ) as []
        this.newMsg = message
        this.msgsList.push( this.newMsg )
      } )
  }
  loadChat = async () => {

  }
  createMsg = async () => {
    console.log( this.msg )
    this.chat.NewMessage( { user: this.name, msg: this.msg, room: this.room } )
    this.msg = ''
  }
  leaveRoom = async () => {
    console.log( 'Log: ChatRoomComponent -> leaveRoom -> this.name ', this.name )
    await this.chat.leave( { user: this.name, room: this.room } )
    await this.chat.getMessages()
      .subscribe( async ( message: string ) => {
        this.usersList = await this.chat.listUsers( this.room ) as []
        this.newMsg = message
        this.msgsList.push( this.newMsg )
        console.log( 'Log: ChatRoomComponent -> chatLoad -> this.newMsg', this.newMsg )
      } )
    this.route.navigateByUrl( '/seller' )
  }
}
