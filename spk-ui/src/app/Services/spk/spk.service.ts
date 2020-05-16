import { Injectable } from '@angular/core'
declare let web3: any
@Injectable( {
  providedIn: 'root'
} )
export class SpkService {
  constructor () { }
  toWei = ( ether: any ) => {
    return web3.utils.toWei( String( ether ), 'ether' )
  }
  toEther = ( wei: any ) => {
    return web3.utils.fromWei( String( wei ), 'ether' )
  }
  getBalance = async ( account: any ) => {
    const a = this.toEther( await web3.eth.getBalance( account ) )
    return a
  }
}
