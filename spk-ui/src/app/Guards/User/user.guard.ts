import { Injectable } from '@angular/core'
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { Web3Model } from 'src/app/Models/web3.model'
import { Web3Service } from 'src/app/Services/Web3/web3.service'

@Injectable( {
  providedIn: 'root'
} )
export class UserGuard implements CanActivate, CanActivateChild, CanLoad {
  private web3var: Web3Model
  constructor ( private web3Service: Web3Service, private route: Router ) { }
  async canActivate( next: ActivatedRouteSnapshot ): Promise<boolean> {
    if ( typeof this.web3Service.AccountSubscription !== 'undefined' ) {
      if ( this.web3Service.AccountSubscription.closed ) {
        localStorage.setItem( 'isLogged', 'false' )
        await this.web3Service.web3login()
      }
    } else {
      localStorage.setItem( 'isLogged', 'false' )
      await this.web3Service.web3login()
    }
    this.web3var = await this.web3Service.Web3Details$.value
    const userType: any = await this.web3var.spk.checkUser().call( {
      from: this.web3var.account
    } )
    console.log( 'TCL: UserGuard -> constructor -> userType', userType )
    if ( userType === '1' ) {
      localStorage.clear()
      return true
    } else {
      localStorage.clear()
      alert( 'Sorry !!! You are Not a User' )
      this.route.navigateByUrl( '/' )
    }
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true
  }
  canLoad(
    route: Route,
    segments: UrlSegment[] ): Observable<boolean> | Promise<boolean> | boolean {
    return true
  }
}
