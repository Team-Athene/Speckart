import { async } from '@angular/core/testing'
import { SocketService } from './../../../Services/socket/socket.service'
import { Component, OnInit } from '@angular/core'
import { Web3Service } from 'src/app/Services/Web3/web3.service'
import { Router } from '@angular/router'
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
  users: Subscription
  msg: string
  usersList: string[] = []
  msgsList: any[] = []
  name: string
  newMsg: {}
  constructor ( private web3service: Web3Service, private route: Router, private chat: SocketService ) { }

  ngOnInit() {
    this.name = sessionStorage.getItem( 'name' )
    this.chatLoad()
    // this.chat.getUsers()
    //   .subscribe( ( userList: string ) => {
    //     console.log( 'Log: ChatRoomComponent -> ngOnInit -> userList', userList )
    //   } )
    // this.web3service.Web3Details$.subscribe( async ( data: Web3Model ) => {
    //   this.account = data.account
    //   this.spk = data.spk
    // } )
  }
  chatLoad = async () => {
    const newUser = await this.chat.NewUser( { user: this.name, room: 'sunglass' } )
    this.usersList = await this.chat.listUsers( 'sunglass' ) as []
    // const temp1 = await this.chat.listUsers( 'sunglass' ) as []
    // console.log( 'Log: ChatRoomComponent -> chatLoad -> temp1', temp1 )
    // console.log( 'Log: ChatRoomComponent -> ngOnInit -> this.chat.listUsers()', this.usersList )
    const temp = await this.chat.listMessages( 'sunglass' ) as any[]
    // console.log( 'Log: ChatRoomComponent -> chatLoad -> temp', temp )
    this.msgsList = temp.map( x => {
      let t = JSON.parse( x )
      return t
    } )
    await this.chat.getMessages()
      .subscribe( async ( message: string ) => {
        // console.log( 'Log: ChatRoomComponent -> chatLoad -> message', message )
        this.usersList = await this.chat.listUsers( 'sunglass' ) as []
        this.newMsg = message
        this.msgsList.push( this.newMsg )
        // console.log( 'Log: ChatRoomComponent -> chatLoad -> this.newMsg', this.newMsg )
      } )
  }
  loadChat = async () => {

  }
  createMsg = async () => {
    console.log( this.msg )
    this.chat.NewMessage( { user: this.name, msg: this.msg, room: 'sunglass' } )
    this.msg = ''
  }
  leaveRoom = async () => {
    console.log( 'Log: ChatRoomComponent -> leaveRoom -> this.name ', this.name )
    await this.chat.leave( { user: this.name, room: 'sunglass' } )
    await this.chat.getMessages()
      .subscribe( async ( message: string ) => {
        this.usersList = await this.chat.listUsers( 'sunglass' ) as []
        this.newMsg = message
        this.msgsList.push( this.newMsg )
        console.log( 'Log: ChatRoomComponent -> chatLoad -> this.newMsg', this.newMsg )
      } )
    this.route.navigateByUrl( '/seller' )
  }
}
