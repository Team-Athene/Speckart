import { Message } from './../../Models/message'
import { async } from '@angular/core/testing'
import { Injectable } from '@angular/core'
import { Socket } from 'ngx-socket-io'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs'
@Injectable( {
  providedIn: 'root'
} )
export class SocketService {
  private url = 'api/chat'
  private OnlineUsers$: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >( [] )
  constructor ( private http: HttpClient, private socket: Socket ) { }

  listMessages = async ( room ) => {
    return new Promise( async ( resolve, reject ) => {
      console.log( `Log: SocketService -> listMessages -> this.url + '/messages',`, this.url + '/messages' )
      try {
        this.http.get( this.url + '/messages', {
          params: {
            room
          },
          observe: 'response'
        } ).subscribe( ( res ) => {
          resolve( res.body )
        } )
      } catch ( error ) {
      }
    } )
  }
  listUsers = async ( room ) => {
    return new Promise( async ( resolve, reject ) => {
      try {
        this.http.get( this.url + '/users', {
          params: {
            room
          },
          observe: 'response'
        } ).subscribe( ( res ) => {
          resolve( res.body )
        } )
      } catch ( error ) {
      }
    } )
  }
  leave = async ( user ) => {
    return new Promise( async ( resolve, reject ) => {
      try {
        this.http.post( this.url + '/deleteUser', user ).subscribe( ( res ) => {
          resolve( res )
        } )
      } catch ( error ) {
      }
    } )
  }
  NewUser = async ( user ) => {
    return new Promise( async ( resolve, reject ) => {
      try {
        this.http.post( this.url + '/user', user ).subscribe( ( res ) => {
          resolve( res )
        } )
      } catch ( error ) {
      }
    } )
  }
  NewMessage = async ( message ) => {
    return new Promise( async ( resolve, reject ) => {
      try {
        this.http.post( this.url + '/message', message ).subscribe( ( res ) => {
          resolve( res )
        } )
      } catch ( error ) {
      }
    } )
  }
  // public sendMessage( message ) {
  //   this.socket.emit( 'new-message', message )
  // }
  public getMessages = () => {
    return Observable.create( ( observer ) => {
      this.socket.on( 'message', ( message ) => {
        observer.next( message )
      } )
    } )
  }
  // listMessages = async () => {
  //   return new Promise( async ( resolve, reject ) => {
  //     try {
  //       console.log( 'Log: SocketService -> listMessages -> this.url + ', this.url + '/messages' )
  //       resolve( this.http.get( this.url + '/messages' ).toPromise() )
  //     } catch ( error ) {
  //     }
  //   } )
  // }
  // listUsers = async () => {
  //   return new Promise( async ( resolve, reject ) => {
  //     try {
  //       resolve( this.http.get( this.url + '/users' ).toPromise() )
  //     } catch ( error ) {
  //     }
  //   } )
  // }
  // leave = async ( user ) => {
  //   return new Promise( async ( resolve, reject ) => {
  //     try {
  //       this.http.post( this.url + '/deleteUser', user ).subscribe( ( res ) => {
  //         resolve( res )
  //       } )
  //     } catch ( error ) {
  //     }
  //   } )
  // }
  // NewUser = async ( user ) => {
  //   return new Promise( async ( resolve, reject ) => {
  //     try {
  //       this.http.post( this.url + '/user', user ).subscribe( ( res ) => {
  //         resolve( res )
  //       } )
  //     } catch ( error ) {
  //     }
  //   } )
  // }
  // NewMessage = async ( message ) => {
  //   return new Promise( async ( resolve, reject ) => {
  //     try {
  //       this.http.post( this.url + '/message', message ).subscribe( ( res ) => {
  //         resolve( res )
  //       } )
  //     } catch ( error ) {
  //     }
  //   } )
  // }
  // public sendMessage( message ) {
  //   this.socket.emit( 'new-message', message )
  // }
  // public getMessages = () => {
  //   return Observable.create( ( observer ) => {
  //     this.socket.on( 'message', ( message ) => {
  //       observer.next( message )
  //     } )
  //   } )
  // }
}
