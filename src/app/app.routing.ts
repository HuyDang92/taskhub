import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { HomeComponent } from "./home/home.component";
import { SignInComponent } from "./sign-in/sign-in.component";

// const userString = localStorage.getItem("user");
// const user = JSON.parse(userString);
// const nameRef = user.fullname.toLowerCase().replace(/\s/g, "");

const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
    },
    {
        path: "sign-in",
        component: SignInComponent,
    },
    {
        path: `client`,
        component: AdminLayoutComponent,
        children: [
            {
                path: "",
                loadChildren: () => import("./layouts/admin-layout/admin-layout.module").then((m) => m.AdminLayoutModule),
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes, {
            // useHash: true,
        }),
    ],
    exports: [],
})
export class AppRoutingModule {}
