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

import { WorkCenter, WorkCenterService , CodeService} from "../../../../core/erp"

@Component({
  selector: 'kt-create-work-center',
  templateUrl: './create-work-center.component.html',
  styleUrls: ['./create-work-center.component.scss'],
  providers: [NgbDropdownConfig, NgbTabsetConfig],
})

export class CreateWorkCenterComponent implements OnInit {

workcenter : WorkCenter;


wcForm: FormGroup;
hasFormErrors = false;
loadingSubject = new BehaviorSubject<boolean>(true)
loading$: Observable<boolean>
isExist = false 


data: [];
columnDefinitions3: Column[] = [];
gridOptions3: GridOption = {};
gridObj3: any;
angularGrid3: AngularGridInstance;
selectedField = "";
fieldcode = "";
msg: String;
error = false;


constructor(
  config: NgbDropdownConfig,
  private wcFB: FormBuilder,
  private activatedRoute: ActivatedRoute,
  private router: Router,
  private codeService: CodeService,
  private modalService: NgbModal,
  public  dialog: MatDialog,
  private layoutUtilsService: LayoutUtilsService,
  private workcenterService: WorkCenterService
) { config.autoClose = true}


 
ngOnInit(): void {
  this.loading$ = this.loadingSubject.asObservable()
  this.loadingSubject.next(false)
  this.createForm();
}
//create form
createForm() {
  this.loadingSubject.next(false);
  this.workcenter = new WorkCenter()
  this.wcForm = this.wcFB.group({
    wc_wkctr: [this.workcenter.wc_wkctr, Validators.required],
    wc_mch: [this.workcenter.wc_mch, Validators.required],
    wc_desc: [{value: this.workcenter.wc_desc,  disabled: !this.isExist }, Validators.required ],
    wc_dept: [{value: this.workcenter.wc_dept,  disabled: !this.isExist }, Validators.required ],
    wc_queue:  [{value: this.workcenter.wc_queue,  disabled: !this.isExist } ],
    wc_wait: [{value: this.workcenter.wc_wait,  disabled: !this.isExist } ],
    wc_mch_op: [{value: this.workcenter.wc_mch_op,  disabled: !this.isExist } ],
    wc_setup_men: [{value: this.workcenter.wc_setup_men,  disabled: !this.isExist } ],
    wc_men_mch: [{value: this.workcenter.wc_men_mch,  disabled: !this.isExist } ],
    wc_mch_wkctr: [{value: this.workcenter.wc_mch_wkctr,  disabled: !this.isExist } ],
    wc_mch_bdn:  [{value: this.workcenter.wc_mch_bdn,  disabled: !this.isExist } ],
    wc_setup_rte: [{value: this.workcenter.wc_setup_rte,  disabled: !this.isExist } ],
    wc_lbr_rate: [{value: this.workcenter.wc_lbr_rate,  disabled: !this.isExist } ],
    wc_bdn_rate: [{value: this.workcenter.wc_bdn_rate,  disabled: !this.isExist } ],
    wc_bdn_pct: [{value: this.workcenter.wc_bdn_pct,  disabled: !this.isExist } ]
    
  })

}
  //reste form
  reset() {
    this.workcenter = new WorkCenter();
    this.createForm();
    this.hasFormErrors = false;
  }
onChangeCode() {
  const controls = this.wcForm.controls
  this.workcenterService
      .getBy({
          wc_wkctr: controls.wc_wkctr.value,
          wc_mch: controls.wc_mch.value,
      })
      .subscribe((response: any) => {
          if (response.data.length) {
              this.isExist = true
              console.log(response.data.length)
          } else {
              controls.wc_desc.enable()
              controls.wc_dept.enable()
              controls.wc_queue.enable()
              controls.wc_wait.enable()
              controls.wc_mch_op.enable()
              controls.wc_setup_men.enable()
              controls.wc_men_mch.enable()
              controls.wc_mch_wkctr.enable()
              controls.wc_mch_bdn.enable()
              controls.wc_setup_rte.enable()
              controls.wc_lbr_rate.enable()
              controls.wc_bdn_rate.enable()
              controls.wc_bdn_pct.enable()
          }
      })
  }

// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.wcForm.controls
  /** check form */
  if (this.wcForm.invalid) {
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
prepareCode(): WorkCenter {
  const controls = this.wcForm.controls
  const _workcenter = new WorkCenter()
  _workcenter.wc_wkctr = controls.wc_wkctr.value
  _workcenter.wc_mch = controls.wc_mch.value
 
  _workcenter.wc_desc = controls.wc_desc.value
  _workcenter.wc_dept = controls.wc_dept.value
  _workcenter.wc_queue = controls.wc_queue.value
  _workcenter.wc_wait = controls.wc_wait.value
  _workcenter.wc_mch_op = controls.wc_mch_op.value
  _workcenter.wc_setup_men = controls.wc_setup_men.value
  _workcenter.wc_men_mch = controls.wc_men_mch.value
  _workcenter.wc_mch_bdn = controls.wc_mch_bdn.value
  _workcenter.wc_setup_rte = controls.wc_setup_rte.value
  _workcenter.wc_lbr_rate = controls.wc_lbr_rate.value
  _workcenter.wc_bdn_rate = controls.wc_bdn_rate.value
  _workcenter.wc_bdn_pct = controls.wc_bdn_pct.value

  return _workcenter
}

/**
* Add code
*
* @param _workcenter: WorkCenterModel
*/
addCode(_workcenter: WorkCenter) {
  this.loadingSubject.next(true)
  this.workcenterService.add(_workcenter).subscribe(
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
          // this.router.navigateByUrl("/code-mstr/codes-list")
          this.reset()
      }
  )
}

/**
* Go back to the list
*
*/
goBack() {
  this.loadingSubject.next(false)
  const url = `/code-mstr/codes-list`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}







handleSelectedRowsChanged3(e, args) {
  const controls = this.wcForm.controls;

  if (Array.isArray(args.rows) && this.gridObj3) {
    args.rows.map((idx) => {
      const item = this.gridObj3.getDataItem(idx);
      // TODO : HERE itterate on selected field and change the value of the selected field
      switch (this.selectedField) {
        case "wc_dept": {
          controls.wc_dept.setValue(item.code_value || "");
          break;
        }
        default:
          break;
      }
    });
  }
}

angularGridReady3(angularGrid: AngularGridInstance) {
  this.angularGrid3 = angularGrid;
  this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGrid3() {
  this.columnDefinitions3 = [
    {
      id: "id",
      field: "id",
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,

      minWidth: 50,
      maxWidth: 50,
    },
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "code_fldname",
      name: "Champs",
      field: "code_fldname",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "code_value",
      name: "Code",
      field: "code_value",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "code_cmmt",
      name: "Description",
      field: "code_cmmt",
      sortable: true,
      width: 200,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptions3 = {
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
    checkboxSelector: {},
    multiSelect: false,
    rowSelectionOptions: {
      selectActiveRow: true,
    },
  };

  // fill the dataset with your data
  this.codeService
    .getBy({ code_fldname: this.selectedField })
    .subscribe((response: any) => (this.data = response.data));
}
open3(content, field) {
  this.selectedField = field;
  this.prepareGrid3();
  this.modalService.open(content, { size: "lg" });
}

changeCode(field) {
  const controls = this.wcForm.controls; // chof le champs hada wesh men form rah

  let obj = {};
  if (field == "wc_dept") {
    this.msg = " Dept ";
    const code_value = controls.wc_dept.value;
    obj = {
      code_value,
      code_fldname: field,
    };
  }
  this.codeService.getBy(obj).subscribe(
    (res: any) => {
      const { data } = res;
      const message = "Ce code" + this.msg + " n'existe pas!";


      if (!data.length) {
        this.layoutUtilsService.showActionNotification(
          message,
          MessageType.Create,
          10000,
          true,
          true
        );
        controls.wc_dept.setValue(null);
            document.getElementById("dept").focus();
        this.error = true;
      } else {
        this.error = false;
      }
    },
    (error) => console.log(error)
  );
  
}

}