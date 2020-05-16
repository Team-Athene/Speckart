
import { Injectable } from '@angular/core'
import { Cart } from 'src/app/Models/spk.model'
@Injectable( {
  providedIn: 'root'
} )
export class CartService {
  constructor () { }
  calculateCart = async ( index, num ) => {
    const items: Cart = JSON.parse( sessionStorage.getItem( 'cart' ) )
    items.cartTotal = 0
    items.productData[ index ].itemCount = items.productData[ index ].itemCount + num
    items.productData[ index ].itemTotal = items.productData[ index ].itemPrice * items.productData[ index ].itemCount
    if ( items.productData[ index ].itemCount === 0 ) {
      delete items.productData[ index ]
      const newProductData = items.productData.filter( ( d ) => {
        if ( d ) {
          return d
        }
      } )
      items.productData = newProductData
    }
    items.productData.forEach( ( item ) => {
      items.cartTotal = items.cartTotal + item.itemTotal
    } )
    sessionStorage.setItem( 'cart', JSON.stringify( items ) )
  }
}
