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
import { Entity, EntityService, Accountdefault, AccountdefaultService, AccountService, DeviseService } from "../../../../core/erp"


@Component({
  selector: 'kt-edit-entity',
  templateUrl: './edit-entity.component.html',
  styleUrls: ['./edit-entity.component.scss']
})
export class EditEntityComponent implements OnInit {

  entity: Entity
  entityForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  entityEdit: any
  title: String = 'Modifier Entitee - '

  fdebitEdit: any
  fcreditEdit: any

  cdebitEdit: any
  ccreditEdit: any

  idebitEdit: any
  icreditEdit: any

  sdebitEdit: any
  screditEdit: any

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
    this.loadingSubject.next(true)
    this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.entityService.getOne(id).subscribe((response: any)=>{
          this.entityEdit = response.data
              
        
            this.accountdefaultService.getBy({acdf_key1: this.entityEdit.en_entity, acdf_module: "AP", acdf_key2: "DR" }).subscribe((response: any)=>{
            this.fdebitEdit = response.data    
             
              this.accountdefaultService.getBy({acdf_key1: this.entityEdit.en_entity, acdf_module: 'AP', acdf_key2: 'CR' }).subscribe((response: any)=>{
                this.fcreditEdit = response.data         
 
                this.accountdefaultService.getBy({acdf_key1: this.entityEdit.en_entity, acdf_module: 'AR', acdf_key2: 'DR' }).subscribe((response: any)=>{
                  this.cdebitEdit = response.data         
                  this.accountdefaultService.getBy({acdf_key1: this.entityEdit.en_entity, acdf_module: 'AR', acdf_key2: 'CR' }).subscribe((response: any)=>{
                    this.ccreditEdit = response.data         
 
                    this.accountdefaultService.getBy({acdf_key1: this.entityEdit.en_entity, acdf_module: 'FA', acdf_key2: 'DR' }).subscribe((response: any)=>{
                      this.idebitEdit = response.data         
                      this.accountdefaultService.getBy({acdf_key1: this.entityEdit.en_entity, acdf_module: 'FA', acdf_key2: 'CR' }).subscribe((response: any)=>{
                        this.icreditEdit = response.data         
                        this.accountdefaultService.getBy({acdf_key1: this.entityEdit.en_entity, acdf_module: 'IC', acdf_key2: 'DR' }).subscribe((response: any)=>{
                          this.sdebitEdit = response.data         
 
                          this.accountdefaultService.getBy({acdf_key1: this.entityEdit.en_entity, acdf_module: 'IC', acdf_key2: 'CR' }).subscribe((response: any)=>{
                            this.screditEdit = response.data         
          
                            this.initCode()
                            this.loadingSubject.next(false)
                            this.title = this.title + this.entityEdit.en_entity
                 
                          })
                        })
                      })
                    })
                  })
                })
              })        
           })
            
        })
           
    })
  }

  // init code
  initCode() {
    this.createForm()
    this.loadingSubject.next(false)
  }
  
  createForm() {
   // const controls = this.entityForm.controls

    this.loadingSubject.next(false)
      
        
      this.entityForm = this.entityFB.group({

        en_entity: [this.entityEdit.en_entity, Validators.required],
        en_name: [this.entityEdit.en_name, Validators.required],
        en_primary: [this.entityEdit.en_primary],
        en_curr: [this.entityEdit.en_curr],
        en_adj_bs: [this.entityEdit.en_adj_bs],
        en_next_prot: [this.entityEdit.en_next_prot],
        en_page_num: [this.entityEdit.en_page_num],
        en_addr: [this.entityEdit.en_addr],
        en_consolidation: [this.entityEdit.en_consolidation],
        en_type: [this.entityEdit.en_type],
        cfdebit: [this.fdebitEdit.acdf_acct],
        scfdebit: [this.fdebitEdit.acdf_sub],
        ccfdebit: [this.fdebitEdit.acdf_cc],
     
      cfcredit: [this.fcreditEdit.acdf_acct],
      scfcredit: [this.fcreditEdit.acdf_sub],
      ccfcredit: [this.fcreditEdit.acdf_cc],

      ccdebit: [this.cdebitEdit.acdf_acct],
      sccdebit: [this.cdebitEdit.acdf_sub],
      cccdebit: [this.cdebitEdit.acdf_cc],
      cccredit: [this.ccreditEdit.acdf_acct],
      scccredit: [this.ccreditEdit.acdf_sub],
      ccccredit: [this.ccreditEdit.acdf_cc],

      cimdebit: [this.idebitEdit.acdf_acct],
      scimdebit: [this.idebitEdit.acdf_sub],
      ccimdebit: [this.idebitEdit.acdf_cc],
      cimcredit: [this.icreditEdit.acdf_acct],
      scimcredit: [this.icreditEdit.acdf_sub],
      ccimcredit: [this.icreditEdit.acdf_cc],

      csdebit: [this.sdebitEdit.acdf_acct],
      scsdebit: [this.sdebitEdit.acdf_sub],
      ccsdebit: [this.sdebitEdit.acdf_cc],
      cscredit: [this.screditEdit.acdf_acct],
      scscredit: [this.screditEdit.acdf_sub],
      ccscredit: [this.screditEdit.acdf_cc],



      })
     
    // controls.en_entity.setValue(this.entityEdit.en_entity || "")
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
    let address = this.prepareEntity()
    this.addentity(address)
          
  }
  /**
* Returns object for saving
*/

prepareEntity(): Entity {
  const controls = this.entityForm.controls
  const _entity = new Entity()
    _entity.id = this.entityEdit.id
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
addentity(_entity: Entity) {
  const controls = this.entityForm.controls
 
  this.loadingSubject.next(true)
  this.entityService.update(this.entityEdit.id, _entity).subscribe(
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
          
          
          let accountfd = this.prepareAccount(this.fdebitEdit.id,"AP","DR",controls.cfdebit.value,controls.scfdebit.value,controls.ccfdebit.value)
          this.addAccount(this.fdebitEdit.id,accountfd)
   
          let accountfc = this.prepareAccount(this.fcreditEdit.id,"AP","CR",controls.cfcredit.value,controls.scfcredit.value,controls.ccfcredit.value)
          this.addAccount(this.fcreditEdit.id,accountfc)
          let accountcd = this.prepareAccount(this.cdebitEdit.id,"AR","DR",controls.ccdebit.value,controls.sccdebit.value,controls.cccdebit.value)
          this.addAccount(this.cdebitEdit.id,accountcd)
          let accountcc = this.prepareAccount(this.ccreditEdit.id,"AR","CR",controls.cccredit.value,controls.scccredit.value,controls.ccccredit.value)
          this.addAccount(this.ccreditEdit.id,accountcc)

          let accountcimd = this.prepareAccount(this.idebitEdit.id,"FA","DR",controls.cimdebit.value,controls.scimdebit.value,controls.ccimdebit.value)
          this.addAccount(this.idebitEdit.id,accountcimd)
          let accountcimc = this.prepareAccount(this.icreditEdit.id,"FA","CR",controls.cimcredit.value,controls.scimcredit.value,controls.ccimcredit.value)
          this.addAccount(this.icreditEdit.id,accountcimc)

          let accountsd = this.prepareAccount(this.sdebitEdit.id,"IC","DR",controls.csdebit.value,controls.scsdebit.value,controls.ccsdebit.value)
          this.addAccount(this.sdebitEdit.id,accountsd)
          let accountsc = this.prepareAccount(this.screditEdit.id,"IC","CR",controls.cscredit.value,controls.scscredit.value,controls.ccscredit.value)
          this.addAccount(this.screditEdit.id,accountsc)











          this.loadingSubject.next(false)
          this.router.navigateByUrl("/entity/list-entity")
      }
  )
}



prepareAccount(fieldid,fieldmod,fielddc,fieldacc,fieldsub,fieldcc): Accountdefault {
  const controls = this.entityForm.controls
  const _accountdefault = new Accountdefault()
  _accountdefault.id = fieldid
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

addAccount(fieldid,_accountdefault: Accountdefault) {
  this.loadingSubject.next(true)
  this.accountdefaultService.update(fieldid,_accountdefault).subscribe(
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
         // this.router.navigateByUrl("/accounting-setting/entity-list")
      }
  )
}



goBack() {
  this.loadingSubject.next(false)
  const url = `/`
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
