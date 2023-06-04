import { Component, OnInit, ElementRef } from "@angular/core";
import { ROUTES } from "../sidebar/sidebar.component";
import { Location, LocationStrategy, PathLocationStrategy } from "@angular/common";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
    addProjectForm!: FormGroup;
    isDisplayed: boolean = true;
    private listTitles: any[];
    location: Location;
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;

    constructor(location: Location, private element: ElementRef, private router: Router, private http: HttpClient) {
        this.location = location;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        this.addProjectForm = new FormGroup({
            // type: new FormControl("personal"),
            title: new FormControl("", Validators.required),
        });
        this.listTitles = ROUTES.filter((listTitle) => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName("navbar-toggler")[0];
        this.router.events.subscribe((event) => {
            this.sidebarClose();
            var $layer: any = document.getElementsByClassName("close-layer")[0];
            if ($layer) {
                $layer.remove();
                this.mobile_menu_visible = 0;
            }
        });
    }
    onSubmit() {
        const userString = localStorage.getItem("user");
        const user = JSON.parse(userString);
        if (this.addProjectForm.valid) {
            const boardData = {
                user: user.id,
                title: this.addProjectForm.value.title,
                // type: this.addProjectForm.value.type,
            };
            this.http.post("http://localhost:3000/api/boards/add", boardData).subscribe(
                (response: any) => {
                    this.isDisplayed = true;
                    const newBoardId = response.boardId; // Assuming the server response contains the newly created board's _id in the 'data' property
                    this.router.navigate(["/client/dashboard", newBoardId]);
                    this.addProjectForm.reset();
                },
                (error) => {
                    console.log("Thêm thất bại!");
                }
            );
        }
    }
    // Trong component
    toggleDisplay() {
        this.isDisplayed = !this.isDisplayed;
    }
    signOut() {
        localStorage.removeItem("user");
        window.location.reload();
    }

    // =================================================================
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName("body")[0];
        setTimeout(function () {
            toggleButton.classList.add("toggled");
        }, 500);

        body.classList.add("nav-open");

        this.sidebarVisible = true;
    }
    sidebarClose() {
        const body = document.getElementsByTagName("body")[0];
        this.toggleButton.classList.remove("toggled");
        this.sidebarVisible = false;
        body.classList.remove("nav-open");
    }
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName("navbar-toggler")[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName("body")[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove("nav-open");
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function () {
                $toggle.classList.remove("toggled");
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function () {
                $toggle.classList.add("toggled");
            }, 430);

            var $layer = document.createElement("div");
            $layer.setAttribute("class", "close-layer");

            if (body.querySelectorAll(".main-panel")) {
                document.getElementsByClassName("main-panel")[0].appendChild($layer);
            } else if (body.classList.contains("off-canvas-sidebar")) {
                document.getElementsByClassName("wrapper-full-page")[0].appendChild($layer);
            }

            setTimeout(function () {
                $layer.classList.add("visible");
            }, 100);

            $layer.onclick = function () {
                //asign a function
                body.classList.remove("nav-open");
                this.mobile_menu_visible = 0;
                $layer.classList.remove("visible");
                setTimeout(function () {
                    $layer.remove();
                    $toggle.classList.remove("toggled");
                }, 400);
            }.bind(this);

            body.classList.add("nav-open");
            this.mobile_menu_visible = 1;
        }
    }

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === "#") {
            titlee = titlee.slice(1);
        }

        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === titlee) {
                return this.listTitles[item].title;
            }
        }
        return "Dự án";
    }
}
