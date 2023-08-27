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
import { AuthService } from "../../../../core/auth"

@Component({
  selector: 'kt-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

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
    users: any;
    message: string;
    usrd_pwd_new: String;
    usrd_pwd_before: string;
    constructor(
        config: NgbDropdownConfig,
        private userFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private auth: AuthService,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private userService: UsersService,
        private modalService: NgbModal
    ) {
        config.autoClose = true
    
    }
    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.createForm()
        this.user =  JSON.parse(localStorage.getItem('user'))



        this.activatedRoute.params.subscribe((params) => {
          const id = params.id;
          if (id) {
            const controls = this.userForm.controls;
    
            this.userService.getOne(id).subscribe(
              (res: any) => {
                console.log("aa", res.data);
               this.users = res.data;
                
                controls.usrd_code.setValue(this.users.usrd_code);
                controls.usrd_name.setValue(this.users.usrd_name);
                controls.usrd_user_name.setValue(this.users.usrd_user_name);
                controls.usrd_profile.setValue(this.users.usrd_profile);
                
              },
              (error) => {
                this.message = ` ce numero ${id} n'existe pas`;
                this.hasFormErrors = true;
              },
              () => {}
            );
          }
        });


    }

    onChangeCode() {
      const controls = this.userForm.controls
      
          
      this.userService.getBy({usrd_user_name: controls.usrd_user_name.value }).subscribe(
        (res: any) => {
          console.log("aa", res.data);
         this.users = res.data;
         
              console.log(this.users)
              if (res.data) {

                      const authData = {
                        userName: controls.usrd_user_name.value ,
                        password: controls.usrd_pwd_before.value,
                    }
                    console.log(authData.userName)
                this.auth
                  .login(authData.userName, authData.password)

                  .subscribe(
                      (resuser: any) => {
            
                        console.log( authData.password)
                        console.log(resuser)
                      
                        
                          controls.usrd_pwd.enable()
                          controls.usrd_pwd_new.enable()

                      

                          this.isExist = true
                    
                        
                    }, 

                    (err) =>
                       alert  ("Ancien Mot de Passe Erronee") 
                    ),
                  
                        this.loadingSubject.next(false)
        
                   //   controls.usrd_pwd.disable()
                   //   controls.usrd_pwd_new.disable()

                  }
                
              })
    }
    //create form
    createForm() {
        this.loadingSubject.next(false)

        this.user = new User()
        this.userForm = this.userFB.group({
            usrd_code: [{value: this.user.usrd_code, disabled: true}],
            usrd_name: [{value: this.user.usrd_name, disabled: true}],
            usrd_user_name: [{value: this.user.usrd_user_name, disabled: true}],
            usrd_profile: [{value: this.user.usrd_profile, disabled: true}],
            usrd_pwd: [{value: "", disabled: !this.isExist}],
            usrd_pwd_before: [this.usrd_pwd_before, Validators.required],
            usrd_pwd_new: [{value: "", disabled: !this.isExist}],
    
        })
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

            this.message = "Modifiez quelques éléments et réessayez de soumettre.";
            this.hasFormErrors = true;
      
            return
        }

        if (controls.usrd_pwd.value  !== controls.usrd_pwd_new.value) {
          alert  ("Mot de passe saisi n'est pas egale au nouveau mot de passe veuillez resaisir") 
          this.message = "Mot de passe erronee";
          this.hasFormErrors = true;
    
          return
         

        }

        // tslint:disable-next-line:prefer-const
        const id =  this.user.id
    
        let address = this.prepareUser()
        this.addUser(id, address)
    }
    /**
     * Returns object for saving
     */
    prepareUser(): User {
        const controls = this.userForm.controls
        const _user = new User()
        _user.usrd_pwd =   controls.usrd_pwd.value
        return _user
    }
    /**
     * Add user
     
     * @param _user: UserModel
     */
    addUser(id ,_user: User) {
        this.loadingSubject.next(true)
        this.userService.update(id,_user).subscribe(
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
