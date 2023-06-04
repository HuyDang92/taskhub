import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { DashboardComponent } from "../../dashboard/dashboard.component";
import { UserProfileComponent } from "../../user-profile/user-profile.component";
import { TableListComponent } from "../../table-list/table-list.component";
import { ProjectComponent } from "app/project/project.component";
import { TeamComponent } from "app/team/team.component";

export const AdminLayoutRoutes: Routes = [
    { path: "", redirectTo: "project", pathMatch: "full" },
    { path: "project", component: ProjectComponent },
    { path: "dashboard/:idboard", component: DashboardComponent },
    { path: "user-profile", component: UserProfileComponent },
    { path: "table-list", component: TableListComponent },
    { path: "teams", component: TeamComponent },
];
@NgModule({
    imports: [RouterModule.forChild(AdminLayoutRoutes)],
    exports: [RouterModule],
})
export class AdminLayoutRoutingModule {}
