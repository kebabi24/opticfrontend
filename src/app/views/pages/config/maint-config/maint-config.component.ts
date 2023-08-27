import { Component, OnInit } from "@angular/core"
import {
  NgbDropdownConfig,
  NgbTabChangeEvent,
  NgbTabsetConfig,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap"
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
// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  FieldType, GridService
} from "angular-slickgrid"

import { Config, ConfigService} from "../../../../core/erp"

@Component({
  selector: 'kt-maint-config',
  templateUrl: './maint-config.component.html',
  styleUrls: ['./maint-config.component.scss']
})
export class MaintConfigComponent implements OnInit {

  conf: any
  config: Config
  cfgForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  isExist = false
  pm_module = false
  pay_multiple = false  

  error = false;

  constructor(
      configs: NgbDropdownConfig,
      private cfgFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private modalService: NgbModal,
      private configService: ConfigService
  ) {
      configs.autoClose = true
      
    
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(true)
    
          this.createForm()
          this.loadingSubject.next(false)
    
    
    
  }
  //create form
  createForm() {
    this.loadingSubject.next(false)
    console.log(this.pm_module)
    this.cfgForm = this.cfgFB.group({
      
        cfg_pm_module: [this.pm_module],
        cfg_pay_multiple: [this.pay_multiple],
       
    })
    let id = 1
        this.configService.getOne(id).subscribe((response: any)=>{
          console.log(response.data)
          this.conf = response.data
          if (this.conf == null) {
           
            this.pm_module = false
            this.pay_multiple = false
          }
          else {
        //    console.log(this.conf.cfg_pm_module)
            this.pm_module = this.conf.cfg_pm_module
            this.pay_multiple = this.conf.cfg_pay_multiple

            
          }
         
    
        
     
      const controls = this.cfgForm.controls
      console.log("jjjjjj")
      console.log(this.pay_multiple)
      controls.cfg_pm_module.setValue(this.pm_module);
      controls.cfg_pay_multiple.setValue(this.pay_multiple);
    })
  }

  
  //reste form
  reset() {
      this.config = new Config()
      this.createForm()
      this.hasFormErrors = false
  }
  // save data
  onSubmit() {
      this.hasFormErrors = false
      
      /** check form */
     
      // tslint:disable-next-line:prefer-const
      let config = this.prepareConfig()
     // console.log("here", config)
      this.addConfig(config)
  }
  /**
   * Returns object for saving
   */
  prepareConfig(): Config {
      
      const controls = this.cfgForm.controls
      const _config = new Config()
      console.log(controls.cfg_pm_module.value)
      _config.cfg_pm_module = controls.cfg_pm_module.value
      _config.cfg_pay_multiple = controls.cfg_pay_multiple.value
      console.log(controls.cfg_pm_module.value)
      //console.log("hnahnahna",_config)
      return _config
  }
  /**
   * Add code
   *
   * @param _code: CodeModel
   */
  addConfig(_config: Config) {
      this.loadingSubject.next(true)
      this.configService.update(1, _config).subscribe(
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
                "Modification avec succès",
                MessageType.Create,
                10000,
                true,
                true
            )
            this.loadingSubject.next(false)
            this.router.navigateByUrl("/config/maint-config")
        }
    )
  }
  /**
   * Go back to the list
   *
   */
  goBack() {
      this.loadingSubject.next(false)
      const url = `/`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
  



  


}

