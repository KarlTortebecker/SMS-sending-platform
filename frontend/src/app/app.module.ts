import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuardService} from './auth/services/auth-guard.service';
import { AuthService} from './auth/services/auth.service';
import { IndexComponent } from './index/index.component';
import { NavIndexComponent } from './nav-index/nav-index.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './menu/menu.component';
import { ConversationsComponent } from './conversations/conversations.component';
import { ConversationsListComponent } from './conversations-list/conversations-list.component';
import { SingleConversationComponent } from './single-conversation/single-conversation.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    NavIndexComponent,
    NotFoundComponent,
    MenuComponent,
    ConversationsListComponent,
    SingleConversationComponent,
    ConversationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [AuthGuardService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
