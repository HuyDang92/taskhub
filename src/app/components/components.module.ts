import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
    declarations: [NavbarComponent, SidebarComponent],
    exports: [NavbarComponent, SidebarComponent],
})
export class ComponentsModule {}
