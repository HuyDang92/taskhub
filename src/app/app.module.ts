import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { HomeComponent } from "./home/home.component";
import { TeamComponent } from "./team/team.component";
import { ConfirmationDialogComponent } from "./confirmation-dialog/confirmation-dialog.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ComponentsModule,
        RouterModule,
        AppRoutingModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
    ],
    declarations: [AppComponent, AdminLayoutComponent, SignInComponent, HomeComponent, TeamComponent, ConfirmationDialogComponent],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
