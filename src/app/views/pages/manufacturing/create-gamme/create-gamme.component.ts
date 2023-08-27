import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  EditorValidator,
  EditorArgs,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

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
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";

import {WorkRouting, WorkRoutingService, WorkCenter, WorkCenterService } from "../../../../core/erp"

@Component({
  selector: 'kt-create-gamme',
  templateUrl: './create-gamme.component.html',
  styleUrls: ['./create-gamme.component.scss'],
  providers: [NgbDropdownConfig, NgbTabsetConfig],
})

export class CreateGammeComponent implements OnInit {

  workRouting: WorkRouting;
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  isExist = false 

  
  gammeForm: FormGroup;
  hasFormErrors: boolean = false;
  constructor(
    config: NgbDropdownConfig,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private gammeFB: FormBuilder,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private workcenterService: WorkCenterService,
    private workroutingService: WorkRoutingService
    ) { config.autoClose = true}
    
    
     
      
  
  
  ngOnInit() {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.createForm();
  }
  //create form
  createForm() {
    this.loadingSubject.next(false)
    this.workRouting = new WorkRouting()
    this.gammeForm = this.gammeFB.group({
      ro_routing: [this.workRouting.ro_routing, Validators.required],
      ro_op    : [this.workRouting.ro_op, Validators.required],

      ro_wkctr: [{value: this.workRouting.ro_wkctr,  disabled: !this.isExist }, Validators.required ],
      ro_mch: [{value: this.workRouting.ro_mch,  disabled: !this.isExist }, Validators.required],
      
      ro_desc: [{value: this.workRouting.ro_desc,  disabled: !this.isExist }, Validators.required ],
      ro_mch_op: [{value: this.workRouting.ro_mch_op,  disabled: !this.isExist }],
      ro_queue:  [{value: this.workRouting.ro_queue,  disabled: !this.isExist } ],
      ro_wait: [{value: this.workRouting.ro_wait,  disabled: !this.isExist } ],
      ro_tran_qty: [{value: this.workRouting.ro_tran_qty,  disabled: !this.isExist } ],
      ro_setup: [{value: this.workRouting.ro_setup,  disabled: !this.isExist } ],
      ro_setup_men: [{value: this.workRouting.ro_setup_men,  disabled: !this.isExist } ],
      ro_men_mch: [{value: this.workRouting.ro_men_mch,  disabled: !this.isExist } ],
   
      ro_run:  [{value: this.workRouting.ro_run,  disabled: !this.isExist } ],
      ro_move: [{value: this.workRouting.ro_move,  disabled: !this.isExist } ],
     
      ro_yield_pct: [{value: this.workRouting.ro_yield_pct,  disabled: !this.isExist } ],
      ro_milestone: [{value: this.workRouting.ro_milestone,  disabled: !this.isExist } ],
      ro_tool: [{value: this.workRouting.ro_tool,  disabled: !this.isExist } ],
      ro_vend: [{value: this.workRouting.ro_vend,  disabled: !this.isExist } ],
      ro_inv_value: [{value: this.workRouting.ro_inv_value,  disabled: !this.isExist } ],
      ro_sub_cost: [{value: this.workRouting.ro_sub_cost,  disabled: !this.isExist } ],

      ro_start:  [{value: this.workRouting.ro_start,  disabled: !this.isExist } ],
      ro_end: [{value: this.workRouting.ro_end,  disabled: !this.isExist } ],
     
    })
  }
  
    //reste form
    reset() {
      this.workRouting = new WorkRouting();
      this.createForm();
      this.hasFormErrors = false;
    }
    onChangeCode() {
      const controls = this.gammeForm.controls
      this.workroutingService
          .getBy({
              ro_routing: controls.ro_routing.value,
              ro_op: controls.ro_op.value,
          })
          .subscribe((response: any) => {
              if (response.data.length) {
                  this.isExist = true
                  console.log(response.data.length)
              } else {
                  
                  controls.ro_wkctr.enable()
                  controls.ro_mch.enable()
                  controls.ro_desc.enable()
                  controls.ro_mch_op.enable()
                  controls.ro_tran_qty.enable()
                  controls.ro_queue.enable()
                  controls.ro_wait.enable()
                  controls.ro_setup.enable()
                  controls.ro_run.enable()
                  controls.ro_move.enable()
                  controls.ro_start.enable()
                  controls.ro_end.enable()
                  controls.ro_yield_pct.enable()
                  controls.ro_milestone.enable()
                  controls.ro_setup_men.enable()
                  
                  controls.ro_men_mch.enable()
                  controls.ro_tool.enable()
                  controls.ro_vend.enable()
                  controls.ro_inv_value.enable()
                  controls.ro_sub_cost.enable()

            }
          })
      }
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.gammeForm.controls
  /** check form */
  if (this.gammeForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      return
  }

  // tslint:disable-next-line:prefer-const
  let address = this.prepareCode()
  this.addCode(address)
 
}
/**
* Returns object for saving
*/
prepareCode(): WorkRouting {
  const controls = this.gammeForm.controls
  const _workrouting = new WorkRouting()
  _workrouting.ro_routing = controls.ro_routing.value
  _workrouting.ro_op = controls.ro_op.value
  _workrouting.ro_desc = controls.ro_desc.value
  _workrouting.ro_wkctr = controls.ro_wkctr.value
  _workrouting.ro_mch = controls.ro_mch.value
  _workrouting.ro_queue = controls.ro_queue.value
  _workrouting.ro_wait = controls.ro_wait.value
  _workrouting.ro_mch_op = controls.ro_mch_op.value
  _workrouting.ro_setup_men = controls.ro_setup_men.value
  _workrouting.ro_men_mch = controls.ro_men_mch.value
  _workrouting.ro_tran_qty = controls.ro_tran_qty.value
  _workrouting.ro_setup = controls.ro_setup.value
  _workrouting.ro_run = controls.ro_run.value
  _workrouting.ro_move = controls.ro_move.value
  _workrouting.ro_yield_pct = controls.ro_yield_pct.value
  _workrouting.ro_milestone = controls.ro_milestone.value
  _workrouting.ro_tool = controls.ro_tool.value
  _workrouting.ro_vend = controls.ro_vend.value
  _workrouting.ro_inv_value = controls.ro_inv_value.value
  _workrouting.ro_sub_cost = controls.ro_sub_cost.value

  _workrouting.ro_start = controls.ro_start.value
    ? `${controls.ro_start.value.year}/${controls.ro_start.value.month}/${controls.ro_start.value.day}`
    : null

    _workrouting.ro_end = controls.ro_end.value
    ? `${controls.ro_end.value.year}/${controls.ro_end.value.month}/${controls.ro_end.value.day}`
    : null  

  return _workrouting
}

/**
* Add code
*
* @param _workrouting: CodeModel
*/
addCode(_workrouting: WorkRouting) {
  this.loadingSubject.next(true)
  this.workroutingService.add(_workrouting).subscribe(
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
          this.reset()
          this.router.navigateByUrl("/manufacturing/create-gamme")
          
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