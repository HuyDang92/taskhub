import { IProject } from "./../../models/project";
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: "/project", title: "Dự án", icon: "dashboard", class: "" },
    { path: "/user-profile", title: "Tài khoản", icon: "person", class: "" },
    // { path: "/table-list", title: "Table List", icon: "content_paste", class: "" },
];

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
    // danh mục
    menuItems: any[];
    // Lữu trữ board
    projects: IProject[] = [];
    // Gán vào
    nameRef: string = "";
    boardId: string = "";
    email: string;
    // ẩn hiện box
    isDisplayedMem: boolean = true;
    isHidden: boolean = true;
    errMess: string = "";
    // Thông báo
    showNotification = false;
    notificationMessage = "";
    constructor(private http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef) {}
    ngOnInit() {
        // this.addMemberForm = new FormGroup({
        //     // type: new FormControl("personal"),
        //     title: new FormControl("", Validators.required),
        // });
        this.menuItems = ROUTES.filter((menuItem) => menuItem);
        this.activatedRoute.params.subscribe((val) => this.initSvg());
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.initSvg();
            }
        });
    }
    onSubmit() {
        // if (this.addMemberForm.valid) {
        // }
    }
    addMember(form: any) {
        const url = window.location.href;
        const segments = url.split("/");
        const boardID = segments[segments.length - 1];
        const email = form.value.email;
        this.http.get(`http://localhost:3000/api/users/${email}`).subscribe(
            (response: any) => {
                const user = response;
                if (user) {
                    const data = { userId: user._id };
                    this.http.put(`http://localhost:3000/api/boards/addMember/${boardID}`, data).subscribe((response: any) => {
                        this.showSuccessNotification("Đã thêm thành viên!");
                        this.isDisplayedMem = !this.isDisplayedMem;
                    });
                } else {
                    this.errMess = "Người dùng chưa đăng ký";
                }
            },
            (error) => {
                console.log("Lỗi");
            }
        );
    }
    ngOnChanges() {
        this.initSvg();
    }
    initSvg() {
        // Lấy id board url
        const url = window.location.href;
        const segments = url.split("/");
        if (segments.includes("dashboard")) {
            this.isHidden = false;
            const boardID = segments[segments.length - 1];
            this.boardId = boardID;
            // lấy id user
            const userString = localStorage.getItem("user");
            const user = JSON.parse(userString);
            this.http.get(`http://localhost:3000/api/boards/user/${user.id}`).subscribe((response: any[]) => {
                response.map((board) => {
                    this.projects.push(board);
                });
            });
            this.cdr.detectChanges();
        } else {
            this.isHidden = true;
            this.projects.splice(0, this.projects.length);
            this.cdr.detectChanges();
        }
    }
    toggleDisplayMem() {
        this.isDisplayedMem = !this.isDisplayedMem;
    }
    showSuccessNotification(message: string) {
        this.showNotification = true;
        this.notificationMessage = message;

        setTimeout(() => {
            this.hideSuccessNotification();
        }, 3000);
    }

    hideSuccessNotification() {
        this.showNotification = false;
        this.notificationMessage = "";
    }
}
