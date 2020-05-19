
import { Injectable } from '@angular/core'
import { Cart } from 'src/app/Models/spk.model'
import { ApiService } from '../api/api.service'
@Injectable( {
  providedIn: 'root'
} )
export class CartService {
  constructor (private api: ApiService) { }
  calculateCart = async ( index, num, address ) => {
    const cartApiPre: any = await this.api.getCart( address )
    const cartApi: any = cartApiPre.cart
    const items: Cart = JSON.parse( cartApi )
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
    await this.api.addCart({cart: JSON.stringify(items), address: address})
    // sessionStorage.setItem( 'cart', JSON.stringify( items ) )
  }
}
