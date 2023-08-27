import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"

// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Editor,
    Editors,
    FieldType,
    OnEventArgs,
    AngularGridInstance,
} from "angular-slickgrid"
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
// Layout
import {
    SubheaderService,
    LayoutConfigService,
} from "../../../../core/_base/layout"
// CRUD
import {
    LayoutUtilsService,
    TypesUtilsService,
    MessageType,
} from "../../../../core/_base/crud"
import { MatDialog } from "@angular/material/dialog"

import { User, UsersService } from "../../../../core/erp"
import { MenuConfig } from '../../../../core/_config/menu.config'
import {
    NgbModal,
    NgbActiveModal,
    ModalDismissReasons,
    NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap"

@Component({
    selector: "kt-create-user",
    templateUrl: "./create-user.component.html",
    styleUrls: ["./create-user.component.scss"],
})
export class CreateUserComponent implements OnInit {
    user: User
    userForm: FormGroup
    hasFormErrors = false
    isExist = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    profiles: []
    columnDefinitions: Column[] = []
    gridOptions: GridOption = {}
    gridObj: any
    angularGrid: AngularGridInstance
    selectedTitle: any
    message: any
    constructor(
        config: NgbDropdownConfig,
        private userFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private userService: UsersService,
        private modalService: NgbModal
    ) {
        config.autoClose = true
        console.log(new MenuConfig().defaults)
    }
    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.createForm()
    }

    //create form
    createForm() {
        this.loadingSubject.next(false)

        this.user = new User()
        this.userForm = this.userFB.group({
           // usrd_code: [this.user.usrd_code, Validators.required],
            usrd_name: [{value: this.user.usrd_name, disabled: !this.isExist}, Validators.required],
            usrd_user_name: [this.user.usrd_user_name , Validators.required],
            usrd_pwd: [{value: this.user.usrd_pwd, disabled: true}, Validators.required],
            usrd_pwd_new: [{value: "", disabled: true}],
            usrd_email: [{value: this.user.usrd_email, disabled: !this.isExist}],
            usrd_phone: [{value: this.user.usrd_phone, disabled: !this.isExist}],
            usrd_profile: [{value: this.user.usrd_profile, disabled: !this.isExist}, Validators.required],
            usrd_active: [{value: this.user.usrd_active, disabled: !this.isExist}, Validators.required],

        })
    }

    onChangeCode() {
        const controls = this.userForm.controls
        
        this.userService.getByOne({usrd_code: controls.usrd_code.value }).subscribe(
            (res: any) => {
              console.log("aa", res.data);
           
              if (res.data) {
                this.isExist = true

              } else { 
            
                
            controls.usrd_name.enable()
            controls.usrd_user_name.enable()
            
            controls.usrd_email.enable()
            controls.usrd_phone.enable()
            controls.usrd_profile.enable()
            controls.usrd_active.enable()
           
              }
                   
        })

    }
    onChangeUser() {
        const controls = this.userForm.controls
        
        this.userService.getByOne({usrd_user_name: controls.usrd_user_name.value }).subscribe(
            (res: any) => {
              console.log("aa", res.data);
           
              if (res.data) {
        alert("Cet Utilisateur exist déja")
        controls.usrd_user_name.setValue(null) 
        document.getElementById("user").focus(); 

              } else { 
            
                controls.usrd_name.enable()
                controls.usrd_user_name.enable()        
                controls.usrd_email.enable()
                controls.usrd_phone.enable()
                controls.usrd_profile.enable()
                controls.usrd_active.enable()
                controls.usrd_pwd.enable()
                controls.usrd_pwd_new.enable()
           
           
              }
                   
        })

    }

    prepareGrid() {
        this.columnDefinitions = [
            {
                id: "id",
                name: "id",
                field: "id",
                sortable: true,
                minWidth: 80,
                maxWidth: 80,
            },
            {
                id: "usrg_code",
                name: "code profil",
                field: "usrg_code",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "usrg_description",
                name: "description",
                field: "usrg_description",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
        ]

        this.gridOptions = {
            enableSorting: true,
            enableCellNavigation: true,
            enableExcelCopyBuffer: true,
            enableFiltering: true,
            autoEdit: false,
            autoHeight: false,
            frozenColumn: 0,
            frozenBottom: true,
            enableRowSelection: true,
            enableCheckboxSelector: true,
            checkboxSelector: {
                // optionally change the column index position of the icon (defaults to 0)
                // columnIndexPosition: 1,

                // remove the unnecessary "Select All" checkbox in header when in single selection mode
                hideSelectAllCheckbox: true,

                // you can override the logic for showing (or not) the expand icon
                // for example, display the expand icon only on every 2nd row
                // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
            },
            multiSelect: false,
            rowSelectionOptions: {
                // True (Single Selection), False (Multiple Selections)
                selectActiveRow: true,
            },
        }

        // fill the dataset with your data
        this.userService
            .getAllProfiles()
            .subscribe((response: any) => (this.profiles = response.data))
    }
    open(content) {
        this.prepareGrid()
        this.modalService.open(content, { size: "lg" })
    }
    //reste form
    reset() {
        this.user = new User()
        this.createForm()
        this.hasFormErrors = false
    }
    // save data
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.userForm.controls
        /** check form */
        if (this.userForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )

            this.hasFormErrors = true
            return
        }
        if (controls.usrd_pwd.value  !== controls.usrd_pwd_new.value) {
            alert  ("Mot de passe saisi n'est pas egale au nouveau mot de passe veuillez resaisir") 
            this.message = "Mot de passe erronee";
            this.hasFormErrors = true;
      
            return
           
  
          }

        // tslint:disable-next-line:prefer-const
        let address = this.prepareUser()
        this.addUser(address)
    }
    /**
     * Returns object for saving
     */
    prepareUser(): User {
        const controls = this.userForm.controls
        const _user = new User()
        _user.usrd_code =  controls.usrd_user_name.value
        _user.usrd_name = controls.usrd_name.value
        _user.usrd_user_name = controls.usrd_user_name.value
        _user.usrd_pwd = controls.usrd_pwd.value
        _user.usrd_email = controls.usrd_email.value
        _user.usrd_phone = controls.usrd_phone.value
        _user.usrd_profile = controls.usrd_profile.value
        _user.usrd_active = controls.usrd_active.value

        return _user
    }
    /**
     * Add user
     *
     * @param _user: UserModel
     */
    addUser(_user: User) {
        this.loadingSubject.next(true)
        this.userService.addUser(_user).subscribe(
            (reponse) => console.log("response", Response),
            (error) => {
                this.layoutUtilsService.showActionNotification(
                    "Erreur verifier les informations",
                    MessageType.Create,
                    10000,
                    true,
                    true
                )
                this.loadingSubject.next(false)
            },
            () => {
                this.layoutUtilsService.showActionNotification(
                    "Ajout avec succès",
                    MessageType.Create,
                    10000,
                    true,
                    true
                )
                this.loadingSubject.next(false)
                this.router.navigateByUrl("/user-mstr/users-list")
            }
        )
    }

    /**
     * Go back to the list
     *
     */
    goBack() {
        this.loadingSubject.next(false)
        const url = `/user-mstr/users-list`
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
    }
    handleSelectedRowsChanged(e, args) {
        const controls = this.userForm.controls
        if (Array.isArray(args.rows) && this.gridObj) {
            args.rows.map((idx) => {
                const item = this.gridObj.getDataItem(idx)
                controls.usrd_profile.setValue(item.usrg_code || "")
            })
        }
    }
    angularGridReady(angularGrid: AngularGridInstance) {
        this.angularGrid = angularGrid
        this.gridObj = (angularGrid && angularGrid.slickGrid) || {}
    }
}
