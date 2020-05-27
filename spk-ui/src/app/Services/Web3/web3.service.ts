/** @format */

import { Injectable } from '@angular/core'
import { BehaviorSubject, interval, Subscription } from 'rxjs'
import { Web3Model } from '../../Models/web3.model'
import { ethers } from 'ethers'

declare let require: any

const Web3 = require( 'web3' )
let SPKJSON, TOKENJSON, DISPUTEJSON
declare let window: any
declare let ethereum: any
declare let web3: any

// angular service to login with metamask
@Injectable( {
  providedIn: 'root'
} )
export class Web3Service {
  constructor() { }

  public Web3Details$: BehaviorSubject<Web3Model> = new BehaviorSubject<
    Web3Model
  >( {
    account: null,
    network: null,
    spk: null,
    token: null,
    dispute: null
  } )
  private RefreshedAccount = interval( 1000 )
  public AccountSubscription: Subscription
  public async web3login() {
    SPKJSON = require( '../../../../build/SpecKart.json' )
    TOKENJSON = require( '../../../../build/SpecToken.json' )
    DISPUTEJSON = require( '../../../../build/DisputeContract.json' )
    return new Promise( async ( resolve, reject ) => {
      // check dapp browser
      if ( window.ethereum || window.web3 ) {
        // Modern dapp browsers...
        if ( window.ethereum ) {
          window.web3 = new Web3( ethereum )
          try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
          } catch ( error ) {
            // User denied account access...
            reject( error )
          }
        } else {
          window.web3 = new Web3( web3.currentProvider )
        }
        // check contract deployed on this network
        const Net = await this.GetNetwork()
        if ( typeof SPKJSON.networks[ Net ] === 'undefined' ) {
          reject( 'Contract Not Deployed on Network with Id:' + Net )
        }

        if ( typeof TOKENJSON.networks[ Net ] === 'undefined' ) {
          reject( 'TOKEN Contract Not Deployed on Network with Id:' + Net )
        }
        if ( typeof DISPUTEJSON.networks[ Net ] === 'undefined' ) {
          reject( 'DISPUTE Contract Not Deployed on Network with Id:' + Net )
        }
        // observe changes on  account and network
        this.AccountSubscription = this.RefreshedAccount.subscribe( async () => {
          let Account = await this.GetAccount()
          const Network = await this.GetNetwork()
          if (
            this.Web3Details$.value.network !== Network ||
            this.Web3Details$.value.account !== Account
          ) {
            const spkInstance = new window.web3.eth.Contract(
              SPKJSON.abi,
              SPKJSON.networks[ Network ].address
            )
            const tokenInstance = new window.web3.eth.Contract(
              TOKENJSON.abi,
              TOKENJSON.networks[ Network ].address
            )
            const disputeInstance = new window.web3.eth.Contract(
              DISPUTEJSON.abi,
              DISPUTEJSON.networks[ Network ].address
            )
            this.Web3Details$.next( {
              account: Account,
              network: Network,
              spk: spkInstance.methods,
              token: tokenInstance.methods,
              dispute: disputeInstance.methods
            } )
          }
          localStorage.setItem( 'isLogged', 'true' )
          if ( Account == null ) {
            await this.web3logout()
            Account = null
            reject( 'Something Went Wrong' )
          }
          resolve( 'Logged In' )
        } )
      } else {
        reject(
          'Non-Ethereum browser detected. You should consider trying MetaMask!'
        )
      }
    } )
  }
  // logout function
  public async web3logout() {
    this.AccountSubscription.unsubscribe()
    this.Web3Details$.next( {
      account: null,
      network: null,
      spk: null,
      token: null,
      dispute: null
    } )
    localStorage.setItem( 'isLogged', 'false' )
    localStorage.clear()
  }
  private async GetAccount(): Promise<string> {
    return new Promise( ( resolve, reject ) => {
      web3.eth.getAccounts( ( err, accs ) => {
        if ( err != null ) {
          resolve( null )
        }
        // Get the initial account balance so it can be displayed.
        if ( accs.length === 0 ) {
          resolve( null )
        } else {
          resolve( accs[ 0 ] )
        }
      } )
    } )
  }
  private GetNetwork(): Promise<string> {
    return new Promise( ( resolve, reject ) => {
      window.web3.eth.net.getId( ( err, netId ) => {
        if ( err ) {
          reject( 'Something Went Wrong, while getting network ID ' )
        }
        resolve( netId )
      } )
    } )
  }
  public async toBytes( input: string ): Promise<string>  {
    const output = await ethers.utils.formatBytes32String(input)
    return output
  }
  public async fromBytes( input: string ): Promise<string>  {
    return new Promise( async ( resolve, reject ) => {
      const output = await ethers.utils.parseBytes32String(input)
      resolve(output)
    } )
  }
}
