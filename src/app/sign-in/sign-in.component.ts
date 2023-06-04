import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators, AbstractControl } from "@angular/forms";
@Component({
    selector: "app-sign-in",
    templateUrl: "./sign-in.component.html",
    styleUrls: ["./sign-in.component.scss"],
})
export class SignInComponent implements OnInit {
    isRightPanelActive: boolean = false;
    signinForm!: FormGroup;
    signupForm!: FormGroup;
    errMessageSignin: string = "";
    errMessageSignup: string = "";

    constructor(private router: Router, private http: HttpClient) {}

    ngOnInit(): void {
        const userString = localStorage.getItem("user");
        if (userString) {
            this.router.navigate(["/client"]);
        }
        this.signinForm = new FormGroup({
            email: new FormControl("", Validators.required),
            password: new FormControl("", Validators.required),
        });
        this.signupForm = new FormGroup({
            fullname: new FormControl("", Validators.required),
            email: new FormControl("", Validators.required),
            password: new FormControl("", Validators.required),
            repassword: new FormControl("", [Validators.required]),
        });
    }

    onSubmit(): void {
        if (this.signinForm.valid) {
            const email = this.signinForm.value.email;
            const password = this.signinForm.value.password;

            this.http.get("http://localhost:3000/api/users/getAll").subscribe(
                (response: any) => {
                    const users = response;
                    const user = users.find((user: any) => user.email === email && user.password === password);
                    if (user) {
                        // localStorage.setItem("user", email);
                        const userSession = {
                            id: user._id,
                            email: user.email,
                            fullname: user.fullname,
                        };
                        localStorage.setItem("user", JSON.stringify(userSession));
                        this.router.navigate(["/client"]);
                    } else {
                        this.errMessageSignin = "Email hoặc mật khẩu không đúng";
                    }
                },
                (error) => {
                    // Xử lý lỗi
                }
            );
        }
        if (this.signupForm.valid) {
            const userData = {
                fullname: this.signupForm.value.fullname,
                email: this.signupForm.value.email,
                password: this.signupForm.value.password,
                repassword: this.signupForm.value.repassword,
            };
            if (userData.password != userData.repassword) {
                this.errMessageSignup = "Mật khẩu xác nhận không đúng";
            } else {
                this.http.get("http://localhost:3000/api/users/getAll").subscribe(
                    (response: any) => {
                        const users = response;
                        const user = users.find((user: any) => user.email === userData.email);
                        if (user) {
                            this.errMessageSignup = "Email đã tồn tại";
                            console.log(this.errMessageSignup);
                        } else {
                            this.http.post("http://localhost:3000/api/users/add", userData).subscribe(
                                (response: any) => {
                                    const data = response.data;
                                    const userSession = {
                                        id: data._id,
                                        email: userData.email,
                                        fullname: userData.fullname,
                                    };

                                    localStorage.setItem("user", JSON.stringify(userSession));
                                    this.router.navigate(["/client"]);
                                },
                                (error) => {
                                    this.errMessageSignup = "Đăng ký không thành công. Vui lòng thử lại.";
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
    }

    onRegisterClick() {
        this.isRightPanelActive = true;
    }
    onLoginClick() {
        this.isRightPanelActive = false;
    }
}
