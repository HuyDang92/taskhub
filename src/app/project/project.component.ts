import { ConfirmationDialogComponent } from "./../confirmation-dialog/confirmation-dialog.component";
import { IProject } from "./../models/project";
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
@Component({
    selector: "app-project",
    templateUrl: "./project.component.html",
    styleUrls: ["./project.component.scss"],
})
export class ProjectComponent implements OnInit {
    projectsPersonal: IProject[] = [];
    // projectsTeam: IProject[] = [];
    users: any[] = [];

    isHiddenAction: boolean = true;
    selectedIndexAction: number = 0;

    constructor(private http: HttpClient, private dialog: MatDialog) {}

    ngOnInit(): void {
        const userString = localStorage.getItem("user");
        const user = JSON.parse(userString);
        this.http.get(`http://localhost:3000/api/boards/user/${user.id}`).subscribe((response: any[]) => {
            response.map((board) => {
                board.user.map((id: string) => {
                    this.http.get(`http://localhost:3000/api/users/idUser/${id}`).subscribe((data) => {
                        this.users.push(data);
                    });
                });
                this.projectsPersonal.push(board);
            });
        });
        console.log(this.users);
    }
    getUserById(userId: string) {
        if (!this.users || this.users.length === 0) {
            // Handle the case when the users array is empty or null
            return null;
        }

        const filteredUsers = this.users.filter((user) => user !== null);
        return filteredUsers.find((user) => user._id === userId);
    }

    toggleAction(index: number) {
        this.selectedIndexAction = index;
        this.isHiddenAction = !this.isHiddenAction;
    }

    deleteBoard(boardId: string) {
        console.log(boardId);

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: "300px",
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // User confirmed deletion
                this.http.delete(`http://localhost:3000/api/boards/${boardId}`).subscribe(
                    (response: any) => {
                        const personalIndex = this.projectsPersonal.findIndex((board) => board._id === boardId);
                        if (personalIndex !== -1) {
                            this.projectsPersonal.splice(personalIndex, 1);
                        }

                        // Delete board from projectsTeam array
                        // const teamIndex = this.projectsTeam.findIndex((board) => board._id === boardId);
                        // if (teamIndex !== -1) {
                        //     this.projectsTeam.splice(teamIndex, 1);
                        // }
                        this.isHiddenAction = !this.isHiddenAction;
                    },
                    (error) => {
                        console.log("Delete failed!");
                    }
                );
            }
        });
    }
}
