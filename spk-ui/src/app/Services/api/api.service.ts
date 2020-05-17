import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable( {
  providedIn: 'root'
} )
export class ApiService {
  private adminUrl = 'api/admin'
  private userUrl = 'api/user'
  constructor ( private http: HttpClient ) { }

  addProducts = async ( product: FormData ) => {
    return new Promise( async ( resolve, reject ) => {
      try {
        this.http.post( this.adminUrl + '/add', product ).subscribe( ( res ) => {
          resolve( res )
        } )
      } catch ( error ) {
      }
    } )
  }
  viewProducts = async ( id ) => {
    return new Promise( async ( resolve, reject ) => {
      try {
        resolve( await this.http.get( this.userUrl + `/view/${id}` ).toPromise() )
      } catch ( error ) {
      }
    } )
  }
  recentView = async ( rData ) => {
    return new Promise( async ( resolve, reject ) => {
      try {
        console.log("TCL: ApiService -> recentView -> rData", rData)
        this.http.post( this.userUrl + '/recentView', rData).subscribe( ( res ) => {
          resolve( res )
        } )
      } catch ( error ) {
      }
    } )
  }
  getRecentView = async ( address ) => {
    return new Promise( async ( resolve, reject ) => {
      try {
        resolve( await this.http.get( this.userUrl + `/getRecentView/${address}` ).toPromise() )
      } catch ( error ) {
      }
    } )
  }
  addCart = async ( data ) => {
    return new Promise( async ( resolve, reject ) => {
      try {
        this.http.post( this.userUrl + '/addCart', data).subscribe( ( res ) => {
          resolve( res )
        } )
      } catch ( error ) {
      }
    } )
  }
  getCart = async ( address ) => {
    return new Promise( async ( resolve, reject ) => {
      try {
        resolve( await this.http.get( this.userUrl + `/getCart/${address}` ).toPromise() )
      } catch ( error ) {
      }
    } )
  }
}
