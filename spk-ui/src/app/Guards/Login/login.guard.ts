import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { Web3Model } from 'src/app/Models/web3.model'
import { Web3Service } from 'src/app/Services/Web3/web3.service'

@Injectable( {
  providedIn: 'root'
} )
export class LoginGuard implements CanActivate {
  constructor ( private web3Service: Web3Service, private route: Router ) { }
  async canActivate(): Promise<boolean> {
    if ( typeof this.web3Service.AccountSubscription !== 'undefined' ) {
      if ( this.web3Service.AccountSubscription.closed ) {
        localStorage.setItem( 'isLogged', 'false' )
        await this.web3Service.web3login()
      }
    } else {
      localStorage.setItem( 'isLogged', 'false' )
      await this.web3Service.web3login()
    }
    if ( localStorage.getItem( 'isLogged' ) ) {
      return true
    } else {
      this.route.navigateByUrl( '/' )
    }
  }
}
