import { IProject } from "./../models/project";
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
@Component({
    selector: "app-user-profile",
    templateUrl: "./user-profile.component.html",
    styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
    projectsPersonal: IProject[] = [];
    infoForm!: FormGroup;
    changepassForm!: FormGroup;
    avt: string = "";
    fullname: string = "";
    totalBoard: number = 0;
    toggleChangeForm: boolean = false;
    errMesses: string = "";
    public userObj: any = {};
    // Thông báo
    showNotification = false;
    notificationMessage = "";
    constructor(private formInfo: FormBuilder, private formChangePass: FormBuilder, private http: HttpClient) {}

    ngOnInit() {
        const userString = localStorage.getItem("user");
        const user = JSON.parse(userString);

        this.infoForm = this.formInfo.group({
            email: [""],
            fullname: [""],
            phone: [""],
        });
        this.changepassForm = this.formChangePass.group({
            password: [""],
            newpassword: [""],
            repassword: [""],
        });
        this.http.get(`http://localhost:3000/api/users/${user.email}`).subscribe(
            (response: any) => {
                const user = response;
                this.infoForm.patchValue({
                    email: user.email,
                    fullname: user.fullname,
                    phone: user.phone,
                });
                this.fullname = user.fullname;
                this.avt = user.avatar;
            },
            (error) => {
                // Xử lý lỗi
            }
        );
        this.http.get(`http://localhost:3000/api/boards/user/${user.id}`).subscribe((response: any[]) => {
            response.map((board) => {
                this.projectsPersonal.push(board);
            });
            console.log(this.projectsPersonal);

            this.totalBoard = this.projectsPersonal.length;
        });
    }
    onSubmit() {
        const userString = localStorage.getItem("user");
        const user = JSON.parse(userString);
        if (!this.toggleChangeForm) {
            this.userObj = { ...this.infoForm.value, ...this.userObj };
            const userData = {
                fullname: this.userObj.fullname,
                phone: this.userObj.phone,
                avatar: this.userObj.avatar,
            };
            console.log(userData);

            this.http.put(`http://localhost:3000/api/users/${user.email}`, userData).subscribe(
                (response: any) => {
                    // Handle success
                    this.showSuccessNotification("Đã lưu thông tin!");
                    window.location.reload();
                },
                (error) => {
                    // Handle error
                }
            );
        } else {
            this.http.get(`http://localhost:3000/api/users/${user.email}`).subscribe(
                (response: any) => {
                    const user = response;
                    const password = this.changepassForm.value.password;
                    const newpassword = this.changepassForm.value.newpassword;
                    const repassword = this.changepassForm.value.repassword;
                    if (user.password != password) {
                        this.errMesses = "Mật khẩu không chính xác!";
                    } else if (newpassword != repassword) {
                        this.errMesses = "Mật khẩu xác nhận không chính xác!";
                    } else {
                        const userData = {
                            password: newpassword,
                        };
                        this.http.put(`http://localhost:3000/api/users/${user.email}`, userData).subscribe(
                            (response: any) => {
                                // Handle success
                                this.showSuccessNotification("Đổi thành công!");
                                window.location.reload();
                            },
                            (error) => {
                                // Handle error
                            }
                        );
                    }
                },
                (error) => {
                    // Xử lý lỗi
                }
            );
        }
    }

    onImageChange(event: any) {
        const fileName = event.files[0].name;
        this.avt = fileName;
        if (fileName) {
            const formData = new FormData();
            formData.append("avt", fileName);

            // Send the formData to the server using HTTP request (e.g., using Angular's HttpClient)
            this.http.post("http://localhost:3000/api/users/uploadAvt", formData).subscribe(
                (response) => {
                    // File upload successful
                    console.log("Upload thành công");
                },
                (error) => {
                    console.log("Upload thất bại");
                    // File upload error
                }
            );
        }
        this.userObj.avatar = fileName;
    }
    toggleChangePasswordForm() {
        this.toggleChangeForm = !this.toggleChangeForm;
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
