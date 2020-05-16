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
}
