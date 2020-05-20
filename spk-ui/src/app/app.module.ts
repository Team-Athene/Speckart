import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HomeComponent } from './Components/home/home.component'
import { NavigationComponent } from './Components/navigation/navigation.component'
import { TokenMarketComponent } from './Components/token-market/token-market.component'
import { RegisterComponent } from './Components/register/register.component'
import { AdminComponent } from './Components/admin/admin.component'
import { UserComponent } from './Components/user/user.component'
import { AdminRouterComponent } from './Components/admin/admin-router/admin-router.component'
import { AddProductComponent } from './Components/admin/add-product/add-product.component'
import { ViewProductComponent } from './Components/admin/view-product/view-product.component'
import { OrderDetailsComponent } from './Components/admin/order-details/order-details.component'
import { UserRouterComponent } from './Components/user/user-router/user-router.component'
import { AccountSummeryComponent } from './Components/user/account-summery/account-summery.component'
import { ViewCartComponent } from './Components/user/view-cart/view-cart.component'
import { MarketRouterComponent } from './Components/token-market/market-router/market-router.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { ViewOrdersComponent } from './Components/admin/view-orders/view-orders.component'
import { ShopComponent } from './Components/user/shop/shop.component'
import { TokenMarketComponent_User } from './Components/user/token-market-user/token-market.component'
import { UserDetailsComponent } from './Components/user/user-details/user-details.component'
import { ChatRoomComponent } from './Components/user/chat-room/chat-room.component'
import { ChatRoomAdminComponent } from './Components/user/chat-room-admin/chat-room-admin.component'

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io'
// const config: SocketIoConfig = { url: 'api', options: {} }
@NgModule( {
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    TokenMarketComponent,
    TokenMarketComponent_User,
    RegisterComponent,
    AdminComponent,
    UserComponent,
    AdminRouterComponent,
    AddProductComponent,
    ViewProductComponent,
    OrderDetailsComponent,
    UserRouterComponent,
    AccountSummeryComponent,
    ViewCartComponent,
    MarketRouterComponent,
    ViewOrdersComponent,
    ShopComponent,
    UserDetailsComponent,
    ChatRoomComponent,
    ChatRoomAdminComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    // SocketIoModule.forRoot( config )
  ],
  providers: [],
  bootstrap: [ AppComponent ]
} )
export class AppModule { }
