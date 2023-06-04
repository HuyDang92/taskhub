import { IList } from "./../models/list";
import { Component, OnInit, ElementRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { MatDialog } from "@angular/material/dialog";
import { Column } from "./../models/column.model";
import { Board } from "./../models/board.model";
import { ITask } from "app/models/task";
import { ConfirmationDialogComponent } from "app/confirmation-dialog/confirmation-dialog.component";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
    // form group
    addTaskForm!: FormGroup;
    addListForm!: FormGroup;
    editTaskForm!: FormGroup;

    // call api
    lists: IList[] = [];
    tasks: ITask[] = [];
    titleTask: any[] = [];
    idList: string = "";
    // render colum
    board: Board = new Board("Board", []);

    // togggle button form
    isHidden: boolean = true;
    selectedColumnIndex: number = 0;
    isAdd: boolean = false;

    // toggle form add list
    isHiddenList: boolean = true;
    isAddList: boolean = false;

    // togggle action list
    isHiddenAction: boolean = true;
    selectedIndexAction: number = 0;

    // togggle action task
    selectedIndexActionTask: number[] = [];

    // togggle status task
    selectedIndexActionStatus: number[] = [];

    // togggle status task
    selectedIndexActionEditTask: number[] = [];

    // togggle status task
    selectedIndexActionDateTask: number[] = [];

    // value form
    listId: string = "";
    dateStartValue: string;
    dateEndValue: string;

    constructor(private http: HttpClient, private dialog: MatDialog) {}

    ngOnInit() {
        const url = window.location.href;
        const segments = url.split("/");
        const boardID = segments[segments.length - 1];
        // call api all task belong to boardID
        this.http.get(`http://localhost:3000/api/tasks/board/${boardID}`).subscribe((response: any[]) => {
            response.map((task) => {
                const listObj = Object(task.list);
                const listId = listObj._id;
                const taskId = task._id;
                const taskTitle = task.title;
                const taskStatus = task.status;
                const taskDateStart = task.dateStart;
                const taskDateEnd = task.dateEnd;
                const taskObject = {
                    listId: listId,
                    id: taskId,
                    taskTitle: taskTitle,
                    status: taskStatus,
                    dateStart: taskDateStart,
                    dateEnd: taskDateEnd,
                };
                // Push the taskObject into this.tasks
                this.tasks.push(taskObject);
            });
            // call api all lists belong to boardID
            this.http.get(`http://localhost:3000/api/lists/${boardID}`).subscribe((response: any[]) => {
                response.map((board) => {
                    this.lists.push(board);
                });
                // filter task into list
                this.lists.forEach((list) => {
                    const boardTitle = list.title;
                    const listId = list._id;
                    const listTasks = this.tasks.filter((task) => task.listId === listId).map((task) => task);
                    const column = new Column(listId, boardTitle, listTasks);
                    this.board.columns.push(column);
                });
            });
        });
        // form add list
        this.addListForm = new FormGroup({
            titleList: new FormControl("", Validators.required),
        });
        // form add task
        this.addTaskForm = new FormGroup({
            listId: new FormControl(""),
            title: new FormControl("", Validators.required),
        });
    }
    onSubmit() {
        const url = window.location.href;
        const segments = url.split("/");
        const boardID = segments[segments.length - 1];

        // form task valid add task into this.task
        if (this.addTaskForm.valid) {
            const taskData = {
                board: boardID,
                list: this.listId,
                title: this.addTaskForm.value.title,
            };
            this.http.post("http://localhost:3000/api/tasks/add", taskData).subscribe(
                (response: any) => {
                    const newTask = response.data;
                    this.board.columns.forEach((column) => {
                        if (column.id === newTask.list) {
                            const addTask = {
                                id: newTask._id,
                                listId: newTask.list,
                                taskTitle: newTask.title,
                                status: "",
                                dateStart: "",
                                dateEnd: "",
                            };
                            column.tasks.push(addTask);
                        }
                    });

                    // Update this.tasks with all tasks from all columns
                    const columnWithNewTask = this.board.columns.find((column) => column.id === newTask.list);
                    this.tasks = columnWithNewTask ? columnWithNewTask.tasks : [];
                    this.addTaskForm.reset();
                },
                (error) => {
                    console.log("Thêm thất bại!");
                }
            );
        }
        // form list valid call api add list into this.board
        if (this.addListForm.valid) {
            const listData = {
                board: boardID,
                title: this.addListForm.value.titleList,
            };
            this.http.post("http://localhost:3000/api/lists/add", listData).subscribe(
                (response: any) => {
                    const newList = response.data;
                    const column = new Column(newList._id, newList.title, []);
                    this.board.columns.push(column);
                    this.addListForm.reset();
                    this.isHiddenList = !this.isHiddenList;
                    this.isAddList = !this.isAddList;
                },
                (error) => {
                    console.log("Thêm thất bại!");
                }
            );
        }
    }

    getIdTask(id: string) {
        this.idList = id;
    }
    drop(event: CdkDragDrop<string[]>, listId: string) {
        const taskData = {
            list: listId,
        };
        this.http.put(`http://localhost:3000/api/tasks/${this.idList}`, taskData).subscribe(
            (response: any) => {
                console.log("Thay đổi thành công");
            },
            (error) => {
                console.log("Thay đổi thất bại!");
            }
        );
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }
    }
    dateFormTask(form: any) {
        const taskId = form.value.id;
        const dateStart = `${this.reformatDate(this.dateStartValue)}`;
        const dateEnd = `${this.reformatDate(this.dateEndValue)}`;
        const data = { dateStart: dateStart ? `Từ ${dateStart}` : "", dateEnd: dateEnd ? `đến ${dateEnd}` : "" };
        this.http.put(`http://localhost:3000/api/tasks/${taskId}`, data).subscribe(
            (response: any) => {
                // Tìm phần tử trong mảng tasks có id tương ứng với idTask
                const task = this.tasks.find((item) => item.id === taskId);
                if (task) {
                    task.dateStart = `Từ ${dateStart}`;
                    task.dateEnd = `đến ${dateEnd}`;
                }
            },
            (error) => {
                console.log("Thêm thất bại!");
            }
        );
    }
    reformatDate(date: string): string {
        if (date) {
            const [year, month, day] = date.split("-");
            return `${day} tháng ${month}`;
        } else {
            return "";
        }
    }
    editFormTask(form: any) {
        const taskId = form.value.id;
        const taskTitle = form.value.taskTitle;
        const data = { title: taskTitle };
        this.http.put(`http://localhost:3000/api/tasks/${taskId}`, data).subscribe(
            (response: any) => {
                // Tìm phần tử trong mảng tasks có id tương ứng với idTask
                // const task = this.tasks.find((item) => item.id === taskId);
                // if (task) {
                //     task.taskTitle = taskTitle;
                // }
            },
            (error) => {
                console.log("Thêm thất bại!");
            }
        );
    }
    addStatus(idTask: string, status: string) {
        const statusData = { status: status };
        this.http.put(`http://localhost:3000/api/tasks/${idTask}`, statusData).subscribe(
            (response: any) => {
                // Tìm phần tử trong mảng tasks có id tương ứng với idTask
                const task = this.tasks.find((item) => item.id === idTask);
                if (task) {
                    task.status = status; // Cập nhật thuộc tính status của phần tử
                }
            },
            (error) => {
                console.log("Thêm thất bại!");
            }
        );
    }
    deleteTask(columnIndex: number, taskId: string) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: "300px",
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // User confirmed deletion
                this.http.delete(`http://localhost:3000/api/tasks/${taskId}`).subscribe(
                    (response: any) => {
                        this.board.columns.forEach((column) => {
                            const taskIndex = column.tasks.findIndex((task) => task.id === taskId);
                            if (taskIndex !== -1) {
                                column.tasks.splice(taskIndex, 1);
                                this.selectedIndexActionTask[columnIndex] = -1;
                            }
                        });
                    },
                    (error) => {
                        console.log("Xóa thất bại!");
                    }
                );
            }
        });
    }
    deleteList(listId) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: "300px",
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // User confirmed deletion
                this.http.delete(`http://localhost:3000/api/lists/${listId}`).subscribe(
                    (response: any) => {
                        const listIndex = this.board.columns.findIndex((list) => list.id === listId);
                        if (listIndex !== -1) {
                            this.board.columns.splice(listIndex, 1);
                        }
                    },
                    (error) => {
                        console.log("Delete failed!");
                    }
                );
            }
        });
    }
    toggleForm(index: number, listId: string) {
        this.selectedColumnIndex = index;
        this.isHidden = !this.isHidden;
        this.isAdd = !this.isAdd;
        this.listId = listId;
    }
    toggleFormList() {
        this.isHiddenList = !this.isHiddenList;
        this.isAddList = !this.isAddList;
    }
    toggleAction(index: number) {
        this.selectedIndexAction = index;
        this.isHiddenAction = !this.isHiddenAction;
    }
    toggleActionTask(columnIndex: number, taskIndex: number) {
        this.selectedIndexActionTask[columnIndex] = taskIndex;
    }
    toggleActionStatus(columnIndex: number, taskIndex: number) {
        this.selectedIndexActionStatus[columnIndex] = taskIndex;
    }
    toggleActionEditTask(columnIndex: number, taskIndex: number) {
        this.selectedIndexActionEditTask[columnIndex] = taskIndex;
    }
    toggleActionDateTask(columnIndex: number, taskIndex: number) {
        this.selectedIndexActionDateTask[columnIndex] = taskIndex;
    }
}
