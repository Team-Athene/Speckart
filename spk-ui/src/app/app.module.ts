import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HomeComponent } from './Components/home/home.component'
import { TokenMarketComponent } from './Components/token-market/token-market.component'
import { RegisterComponent } from './Components/register/register.component'
import { UserComponent } from './Components/user/user.component'
import { AddProductComponent } from './Components/seller/add-product/add-product.component'
import { ViewProductComponent } from './Components/seller/view-product/view-product.component'
import { UserRouterComponent } from './Components/user/user-router/user-router.component'
import { AccountSummeryComponent } from './Components/user/account-summery/account-summery.component'
import { ViewCartComponent } from './Components/user/view-cart/view-cart.component'
import { MarketRouterComponent } from './Components/token-market/market-router/market-router.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { ViewOrdersComponent } from './Components/seller/view-orders/view-orders.component'
import { ShopComponent } from './Components/user/shop/shop.component'
import { TokenMarketComponent_User } from './Components/user/token-market-user/token-market.component'
import { UserDetailsComponent } from './Components/user/user-details/user-details.component'
import { ChatRoomComponent } from './Components/user/chat-room/chat-room.component'

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io'
import { TokenMarketAdminComponent } from './Components/admin/token-market-admin/token-market-admin.component'
import { SellerDetailsComponent } from './Components/seller/seller-details/seller-details.component'
import { SellerComponent } from './Components/seller/seller.component'
import { SellerRouterComponent } from './Components/seller/seller-router/seller-router.component'
import { AdminComponent } from './Components/admin/admin.component'
import { AdminRouterComponent } from './Components/admin/admin-router/admin-router.component'
import { TokenMarketSellerComponent } from './Components/seller/token-market-seller/token-market-seller.component'
const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} }
@NgModule( {
  declarations: [
    AppComponent,
    HomeComponent,
    TokenMarketComponent,
    TokenMarketComponent_User,
    RegisterComponent,
    UserComponent,
    AddProductComponent,
    ViewProductComponent,
    UserRouterComponent,
    AccountSummeryComponent,
    ViewCartComponent,
    MarketRouterComponent,
    ViewOrdersComponent,
    ShopComponent,
    UserDetailsComponent,
    ChatRoomComponent,
    TokenMarketAdminComponent,
    SellerDetailsComponent,
    SellerComponent,
    SellerRouterComponent,
    AdminComponent,
    AdminRouterComponent,
    TokenMarketSellerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot( config )
  ],
  providers: [],
  bootstrap: [ AppComponent ]
} )
export class AppModule { }
