import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
} from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuConfig } from "../../../../core/_config/menu.config";

// Layout
import {
  SubheaderService,
  LayoutConfigService,
} from "../../../../core/_base/layout";
// CRUD
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";
import {
  IActionMapping,
  ITreeOptions,
  TREE_ACTIONS,
} from "@circlon/angular-tree-component";

import { Profile, UsersService } from "../../../../core/erp";

const actionMapping: IActionMapping = {
  mouse: {
    click: (tree, node, $event) => {
      console.log(node);
      $event.shiftKey
        ? TREE_ACTIONS.TOGGLE_ACTIVE_MULTI(tree, node, $event)
        : TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
    },
  },
};
@Component({
  selector: "kt-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"],
})
export class EditProfileComponent implements OnInit {
  profile: Profile;
  profileForm: FormGroup;
  hasFormErrors = false;
  isExist = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  selectedMenus = [];
  nodes = [];
  prf: any;

  options: ITreeOptions = {
    useCheckbox: true,
    actionMapping,
  };
  roles = null
  id
  constructor(
    config: NgbDropdownConfig,
    private profileFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private profileService: UsersService
  ) {
    config.autoClose = true;
    this.createForm();
    this.activatedRoute.params.subscribe((params) => {
      this.id = params.id;
      if (this.id) {
        const controls = this.profileForm.controls;
        const menus = new MenuConfig().defaults;
        menus.aside.items.map(obj=>{
          if(obj.title){
              const node : any = {}
              node.name = obj.title
              node.children = []
              if(obj.submenu){
                  obj.submenu.map(value=>{
                      let item :any
                      item = {name: value.title,checked:true,children:[]}
                      if(value.submenu) {
                          value.submenu.map(v=>{
                              item.children.push({name: v.title, checked:true})
                          })
                      }
                      node.children.push(item)
                  })

              }
              
              
              
              this.nodes.push(node)
          }
      })
        this.profileService.getProfile(this.id).subscribe(
          (res: any) => {
            console.log("aa", res.data);
            this.prf = res.data
            controls.usrg_code.setValue(this.prf.usrg_code)
            controls.usrg_description.setValue(this.prf.usrg_description)
            const d1 = new Date(this.prf.usrg_val_st_date)
            d1.setDate(d1.getDate() )
            const d2 = new Date(this.prf.usrg_val_en_date)
            d2.setDate(d2.getDate() )
            controls.usrg_val_st_date.setValue({year: d1.getFullYear, month: d1.getMonth()+1, day: d1.getDate()})
            controls.usrg_val_en_date.setValue({year: d2.getFullYear, month: d2.getMonth()+1, day: d2.getDate()})
            this.roles = JSON.parse(res.data.usrg_menus)
            const menus = new MenuConfig().defaults;
           this.selectedMenus = this.roles
            
            // controls.usrd_code.setValue(this.users.usrd_code);
            // controls.usrd_name.setValue(this.users.usrd_name);
            // controls.usrd_user_name.setValue(this.users.usrd_user_name);
            // controls.usrd_profile.setValue(this.users.usrd_profile);
            
          },
          (error) => {
            this.hasFormErrors = true;
          },
          () => {}
        );
      }
    });    
    
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    
  }
  onInitTree(event){
    // while (this.roles == null){
    //   console.log('aaa')
    // }
    event.treeModel.nodes.map(node=>{
      if(this.roles.filter(elem=>elem==node.name)[0]){
        const node_ = event.treeModel.getNodeById(node.id)
        node_.setIsSelected(true)
      }
      node.children.map(node=>{
        if(this.roles.filter(elem=>elem==node.name)[0]){
          const node_ = event.treeModel.getNodeById(node.id)
          node_.setIsSelected(true)
        }
  
      })

    })
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);

    this.profile = new Profile();
    this.profileForm = this.profileFB.group({
      usrg_code: [this.profile.usrg_code, Validators.required],
      usrg_description: [this.profile.usrg_description, Validators.required],
      usrg_val_st_date: [this.profile.usrg_val_st_date],
      usrg_val_en_date: [this.profile.usrg_val_en_date],
    });
  }

  //reste form
  reset() {
    this.profile = new Profile();
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    console.log('aaa')

    this.hasFormErrors = false;
    const controls = this.profileForm.controls;
    /** check form */
   

    // tslint:disable-next-line:prefer-const
    let profile = this.prepareProfile();
    this.addProfile(profile);
  }
  /**
   * Returns object for saving
   */
  prepareProfile(): Profile {
    console.log('aaa')

    const controls = this.profileForm.controls;
    const _profile = new Profile();
    _profile.usrg_code = controls.usrg_code.value;
    _profile.usrg_description = controls.usrg_description.value;
    _profile.usrg_val_st_date = controls.usrg_val_st_date.value
      ? `${controls.usrg_val_st_date.value.year}/${controls.usrg_val_st_date.value.month}/${controls.usrg_val_st_date.value.day}`
      : null;
    _profile.usrg_val_en_date = controls.usrg_val_en_date.value
      ? `${controls.usrg_val_en_date.value.year}/${controls.usrg_val_en_date.value.month}/${controls.usrg_val_en_date.value.day}`
      : null;
    console.log(this.selectedMenus)
    _profile.usrg_menus = JSON.stringify(this.selectedMenus);

    return _profile;
  }
  /**
   * Add profile
   *
   * @param _profile: ProfileModel
   */
  addProfile(_profile: Profile) {
    this.loadingSubject.next(true);
    this.profileService.updateProfile(_profile, this.id).subscribe(
      (reponse) => console.log("response", Response),
      (error) => {
        this.layoutUtilsService.showActionNotification(
          "Erreur verifier les informations",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification(
          "modifié avec succès",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.loadingSubject.next(false);
        this.router.navigateByUrl("/");
      }
    );
  }

  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  onSelect(event) {
    const {
      node: { data: name },
    } = event;
    if (!this.selectedMenus.includes(name.name)) this.selectedMenus.push(name.name);
     if (!this.selectedMenus.includes(event.node.parent.data.name))
       this.selectedMenus.push(event.node.parent.data.name);
  }
  onDeselect(event) {
    const {
      node: { data: name },
    } = event;
    const index = this.selectedMenus.indexOf(name.name);
    this.selectedMenus.splice(index, 1);
  }



 
}
