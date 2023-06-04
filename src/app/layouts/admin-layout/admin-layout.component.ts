import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import PerfectScrollbar from "perfect-scrollbar";

@Component({
    selector: "app-admin-layout",
    templateUrl: "./admin-layout.component.html",
    styleUrls: ["./admin-layout.component.scss"],
})
export class AdminLayoutComponent implements OnInit {
    constructor(public location: Location, private router: Router) {}
    ngOnInit(): void {
        const userString = localStorage.getItem("user");
        const user = JSON.parse(userString);
        if (!userString) {
            this.router.navigate(["/"]);
        } else {
            const nameRef = user.fullname.toLowerCase().replace(/\s/g, "");
        }
    }

    ngAfterViewInit() {
        this.runOnRouteChange();
    }
    isMaps(path) {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        titlee = titlee.slice(1);
        if (path == titlee) {
            return false;
        } else {
            return true;
        }
    }
    runOnRouteChange(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemMainPanel = <HTMLElement>document.querySelector(".main-panel");
            const ps = new PerfectScrollbar(elemMainPanel);
            ps.update();
        }
    }
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf("MAC") >= 0 || navigator.platform.toUpperCase().indexOf("IPAD") >= 0) {
            bool = true;
        }
        return bool;
    }
}
