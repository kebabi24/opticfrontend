// Angular
import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
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

import { Entity, EntityService, Accountdefault, AccountdefaultService, AccountService, DeviseService } from "../../../../core/erp"

@Component({
  selector: 'kt-create-entity',
  templateUrl: './create-entity.component.html',
  styleUrls: ['./create-entity.component.scss']
})
export class CreateEntityComponent implements OnInit {
  entity: Entity
  accountdefault: Accountdefault
  entityForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  error = false
  field = ""

    data: []
    columnDefinitions3: Column[] = []
    gridOptions3: GridOption = {}
    gridObj3: any
    angularGrid3: AngularGridInstance
    selectedField = ""
   


  cfdebit: String
  scfdebit: String
  ccfdebit: String

  
  
  cfcredit: String
  scfcredit: String
  ccfcredit: String


  ccdebit: String
  sccdebit: String
  cccdebit: String

  
  cccredit: String
  scccredit: String
  ccccredit: String

  cimdebit: String
  scimdebit: String
  ccimdebit: String

  
  cimcredit: String
  scimcredit: String
  ccimcredit: String

  csdebit: String
  scsdebit: String
  ccsdebit: String

  
  cscredit: String
  scscredit: String
  ccscredit: String



  devises: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

  constructor(
      config: NgbDropdownConfig,
      private entityFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private modalService: NgbModal,
      private entityService: EntityService,
      private accountdefaultService: AccountdefaultService,
      private deviseService: DeviseService,
      private accountService: AccountService
  ) {
      config.autoClose = true
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.createForm()
}
//create form
createForm() {
  this.loadingSubject.next(false)

  this.entity = new Entity()
  this.accountdefault = new Accountdefault()
  this.entityForm = this.entityFB.group({
      en_entity: [this.entity.en_entity, Validators.required],
      en_name: [
          { value: this.entity.en_name, disabled: !this.isExist },
          Validators.required,
      ],
      en_primary: [{ value: this.entity.en_primary, disabled: !this.isExist }],
      en_curr: [{ value: this.entity.en_curr, disabled: !this.isExist }],
      en_adj_bs: [{ value: this.entity.en_adj_bs, disabled: !this.isExist }],
      en_next_prot: [{ value: this.entity.en_next_prot, disabled: !this.isExist }],
      en_page_num: [{ value: this.entity.en_page_num, disabled: !this.isExist }],
      en_addr: [{ value: this.entity.en_addr, disabled: !this.isExist }],
      en_consolidation: [{ value: this.entity.en_consolidation, disabled: !this.isExist }],
      en_type: [{ value: this.entity.en_type, disabled: !this.isExist }],
      cfdebit: [{ value: this.cfdebit, disabled: !this.isExist }],
      scfdebit: [{ value: this.scfdebit, disabled: !this.isExist }],
      ccfdebit: [{ value: this.ccfdebit, disabled: !this.isExist }],
      cfcredit: [{ value: this.cfcredit, disabled: !this.isExist }],
      scfcredit: [{ value: this.scfcredit, disabled: !this.isExist }],
      ccfcredit: [{ value: this.ccfcredit, disabled: !this.isExist }],

      ccdebit: [{ value: this.ccdebit, disabled: !this.isExist }],
      sccdebit: [{ value: this.sccdebit, disabled: !this.isExist }],
      cccdebit: [{ value: this.cccdebit, disabled: !this.isExist }],
      cccredit: [{ value: this.cccredit, disabled: !this.isExist }],
      scccredit: [{ value: this.scccredit, disabled: !this.isExist }],
      ccccredit: [{ value: this.ccccredit, disabled: !this.isExist }],

      cimdebit: [{ value: this.ccimdebit, disabled: !this.isExist }],
      scimdebit: [{ value: this.scimdebit, disabled: !this.isExist }],
      ccimdebit: [{ value: this.ccimdebit, disabled: !this.isExist }],
      cimcredit: [{ value: this.cimcredit, disabled: !this.isExist }],
      scimcredit: [{ value: this.scimcredit, disabled: !this.isExist }],
      ccimcredit: [{ value: this.ccimcredit, disabled: !this.isExist }],

      csdebit: [{ value: this.csdebit, disabled: !this.isExist }],
      scsdebit: [{ value: this.scsdebit, disabled: !this.isExist }],
      ccsdebit: [{ value: this.ccsdebit, disabled: !this.isExist }],
      cscredit: [{ value: this.cscredit, disabled: !this.isExist }],
      scscredit: [{ value: this.scscredit, disabled: !this.isExist }],
      ccscredit: [{ value: this.ccscredit, disabled: !this.isExist }],


  })
}

onChangeCode() {
  const controls = this.entityForm.controls
  this.entityService
      .getBy({
            en_entity: controls.en_entity.value,
      })
      .subscribe((response: any) => {
          if (response.data.length) {
              this.isExist = true
              console.log(response.data.length)
          } else {
              controls.en_name.enable()
              controls.en_primary.enable()
              controls.en_curr.enable()
              controls.en_next_prot.enable()
              controls.en_adj_bs.enable()
              controls.en_page_num.enable()
              controls.en_addr.enable()
              controls.en_consolidation.enable()
              controls.en_type.enable()
              controls.cfdebit.enable()
              controls.scfdebit.enable()
              controls.ccfdebit.enable()
              controls.cfcredit.enable()
              controls.scfcredit.enable()
              controls.ccfcredit.enable()

              controls.ccdebit.enable()
              controls.sccdebit.enable()
              controls.cccdebit.enable()
              controls.cccredit.enable()
              controls.scccredit.enable()
              controls.ccccredit.enable()

              
              controls.cimdebit.enable()
              controls.scimdebit.enable()
              controls.ccimdebit.enable()
              controls.cimcredit.enable()
              controls.scimcredit.enable()
              controls.ccimcredit.enable()

              controls.csdebit.enable()
              controls.scsdebit.enable()
              controls.ccsdebit.enable()
              controls.cscredit.enable()
              controls.scscredit.enable()
              controls.ccscredit.enable()


          }
   })
}
//reste form
reset() {
  this.entity = new Entity()
  this.createForm()
  this.hasFormErrors = false
}
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.entityForm.controls
  /** check form */
  if (this.entityForm.invalid) {
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
    prepareCode(): Entity {
      const controls = this.entityForm.controls
      const _entity = new Entity()
      _entity.en_entity = controls.en_entity.value
      _entity.en_name = controls.en_name.value
      _entity.en_primary = controls.en_primary.value
      _entity.en_curr = controls.en_curr.value
      _entity.en_next_prot = controls.en_next_prot.value
      _entity.en_adj_bs = controls.en_adj_bs.value
      _entity.en_page_num = controls.en_page_num.value
      _entity.en_addr = controls.en_addr.value
      _entity.en_consolidation = controls.en_consolidation.value
      _entity.en_type = controls.en_type.value

      return _entity
  }
/**
     * Add code
     *
     * @param _entity: EntityModel
     */
    addCode(_entity: Entity) {
      const controls = this.entityForm.controls
      this.loadingSubject.next(true)
      this.entityService.add(_entity).subscribe(
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
              let accountfd = this.prepareAccount("AP","DR",controls.cfdebit.value,controls.scfdebit.value,controls.ccfdebit.value)
              this.addAccount(accountfd)
              let accountfc = this.prepareAccount("AP","CR",controls.cfcredit.value,controls.scfcredit.value,controls.ccfcredit.value)
              this.addAccount(accountfc)
              let accountcd = this.prepareAccount("AR","DR",controls.ccdebit.value,controls.sccdebit.value,controls.cccdebit.value)
              this.addAccount(accountcd)
              let accountcc = this.prepareAccount("AR","CR",controls.cccredit.value,controls.scccredit.value,controls.ccccredit.value)
              this.addAccount(accountcc)
 
              let accountcimd = this.prepareAccount("FA","DR",controls.cimdebit.value,controls.scimdebit.value,controls.ccimdebit.value)
              this.addAccount(accountcimd)
              let accountcimc = this.prepareAccount("FA","CR",controls.cimcredit.value,controls.scimcredit.value,controls.ccimcredit.value)
              this.addAccount(accountcimc)
 
              let accountsd = this.prepareAccount("IC","DR",controls.csdebit.value,controls.scsdebit.value,controls.ccsdebit.value)
              this.addAccount(accountsd)
              let accountsc = this.prepareAccount("IC","CR",controls.cscredit.value,controls.scscredit.value,controls.ccscredit.value)
              this.addAccount(accountsc)

              this.router.navigateByUrl("/accounting-setting/entity-list")
          }
      )
  }


  prepareAccount(fieldmod,fielddc,fieldacc,fieldsub,fieldcc): Accountdefault {
    const controls = this.entityForm.controls
    const _accountdefault = new Accountdefault()
    _accountdefault.acdf_module = fieldmod
    _accountdefault.acdf_key1 = controls.en_entity.value
    _accountdefault.acdf_type = "ICO_ACCT"
    _accountdefault.acdf_key2 = fielddc
    _accountdefault.acdf_acct = fieldacc
    _accountdefault.acdf_sub  = fieldsub
    _accountdefault.acdf_cc   = fieldcc

   
    return _accountdefault
}
/**
   * Add code
   *
   * @param _accountdefault: AccountdefaultModel
   */
  addAccount(_accountdefault: Accountdefault) {
    this.loadingSubject.next(true)
    this.accountdefaultService.add(_accountdefault).subscribe(
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
           // this.loadingSubject.next(false)
           // this.router.navigateByUrl("/accounting-setting/entity-list")
        }
    )
}

 /**
     * Go back to the list
     *
     */
    goBack() {
      this.loadingSubject.next(false)
      const url = `/accounting-setting/entity-list`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }

  changeAcct (field){

    const controls = this.entityForm.controls 
    let ac_code : any
    if (field=="cfdebit") {
       ac_code  = controls.cfdebit.value
    
    }
    if (field=="cfcredit"){

        ac_code  = controls.cfcredit.value

    }

    if (field=="ccdebit") {
       ac_code  = controls.ccdebit.value
    }    
    
    if (field=="cccredit"){

        ac_code  = controls.cccredit.value

    }
    if (field=="cimdebit") {
       ac_code  = controls.cimdebit.value

    }
    if (field=="cimcredit"){

      ac_code  = controls.cimcredit.value

    }
    if (field=="csdebit") {
       ac_code  = controls.csdebit.value

    }
    if (field=="cscredit"){

     ac_code  = controls.cscredit.value

    }



  this.accountService.getBy({ac_code}).subscribe((res:any)=>{
      const {data} = res
      console.log(res)
      if (!data){ this.layoutUtilsService.showActionNotification(
          "ce compte n'existe pas!",
          MessageType.Create,
          10000,
          true,
          true
      )
      this.error = true}
      else {
          this.error = false
      }


  },error=>console.log(error))
}



  changeCurr(){
    const controls = this.entityForm.controls // chof le champs hada wesh men form rah
    const cu_curr  = controls.en_curr.value
    this.deviseService.getBy({cu_curr}).subscribe((res:any)=>{
        const {data} = res
        console.log(res)
        if (!data){ this.layoutUtilsService.showActionNotification(
            "cette devise n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
        )
    this.error = true}
        else {
            this.error = false
        }


    },error=>console.log(error))
}

  handleSelectedRowsChanged2(e, args) {
    const controls = this.entityForm.controls;
    if (Array.isArray(args.rows) && this.gridObj2) {
      args.rows.map((idx) => {
        const item = this.gridObj2.getDataItem(idx);
        controls.en_curr.setValue(item.cu_curr || "");
      });
    }
  }

  angularGridReady2(angularGrid: AngularGridInstance) {
    this.angularGrid2 = angularGrid;
    this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid2() {
    this.columnDefinitions2 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "cu_curr",
        name: "code",
        field: "cu_curr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "cu_desc",
        name: "Designation",
        field: "cu_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "cu_rnd_mthd",
        name: "Methode Arrondi",
        field: "cu_rnd_mthd",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "cu_active",
        name: "Actif",
        field: "cu_active",
        sortable: true,
        filterable: true,
        type: FieldType.boolean,
      },
      {
        id: "cu_iso_curr",
        name: "Devise Iso",
        field: "cu_iso_curr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptions2 = {
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
    };

    // fill the dataset with your data
    this.deviseService
      .getAll()
      .subscribe((response: any) => (this.devises = response.data));
  }
  open2(content) {
    this.prepareGrid2();
    this.modalService.open(content, { size: "lg" });
  }


  handleSelectedRowsChanged3(e, args) {
    const controls = this.entityForm.controls
    

    if (Array.isArray(args.rows) && this.gridObj3) {
        args.rows.map((idx) => {
            const item = this.gridObj3.getDataItem(idx)
            // TODO : HERE itterate on selected field and change the value of the selected field
            switch (this.selectedField) {
              case "cfdebit": {
                  controls.cfdebit.setValue(item.ac_code || "")
                  break
              }    
              case "cfcredit": {
                  controls.cfcredit.setValue(item.ac_code || "")
                  break
              }
              case "ccdebit": {
                controls.ccdebit.setValue(item.ac_code || "")
                break
              }
              case "cccredit": {
                controls.cccredit.setValue(item.ac_code || "")
                break
              }
              case "cimdebit": {
                controls.cimdebit.setValue(item.ac_code || "")
                break
              }
              case "cimcredit": {
                controls.cimcredit.setValue(item.ac_code || "")
                break
              }
              case "csdebit": {
                controls.csdebit.setValue(item.ac_code || "")
                break
              }
              case "cscredit": {
                controls.cscredit.setValue(item.ac_code || "")
                break
              }



                default:
                    break
            }
        })
    }
}
  angularGridReady3(angularGrid: AngularGridInstance) {
    this.angularGrid3 = angularGrid
    this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {}
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
            id: "ac_code",
            name: "Compte",
            field: "ac_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "ac_desc",
            name: "Designation",
            field: "ac_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "ac_type",
            name: "Type",
            field: "ac_type",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "ac_curr",
          name: "Devise",
          field: "ac_curr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "ac_stat_acc",
          name: "Compte Statique",
          field: "ac_stat_acc",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },

    ]

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
        checkboxSelector: {
        },
        multiSelect: false,
        rowSelectionOptions: {
            selectActiveRow: true,
        },
    }

    // fill the dataset with your data
    this.accountService
        .getAll()
        .subscribe((response: any) => (this.data = response.data))
}
open3(content, field) {
    this.selectedField = field
    this.prepareGrid3()
    this.modalService.open(content, { size: "lg" })
}

}
