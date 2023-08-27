import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
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
  FieldType,
  Formatters,
  OnEventArgs,
} from "angular-slickgrid";
import { BehaviorSubject, Observable } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { CostcenterService, Costcenter, SubaccountService, AccountService } from "../../../../core/erp";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";

@Component({
  selector: 'kt-edit-cc',
  templateUrl: './edit-cc.component.html',
  styleUrls: ['./edit-cc.component.scss']
})
export class EditCcComponent implements OnInit {

  
  cc: Costcenter
  ccForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  ccEdit: any
  title: String = 'Modifier Centre de Coût - '
  
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];

  accounts: []
  columnDefinitions4: Column[] = []
  gridOptions4: GridOption = {}
  gridObj4: any
  angularGrid4: AngularGridInstance
  columnDefinitions5: Column[] = []
  gridOptions5: GridOption = {}
  gridObj5: any
  angularGrid5: AngularGridInstance
  
  subs: []
    columnDefinitions6: Column[] = []
    gridOptions6: GridOption = {}
    gridObj6: any
    angularGrid6: AngularGridInstance
    columnDefinitions7: Column[] = []
    gridOptions7: GridOption = {}
    gridObj7: any
    angularGrid7: AngularGridInstance
    
    sc: [];
  
    // grid options
    
    subangularGrid: AngularGridInstance;
  subgrid: any;
  subgridService: GridService;
  subdataView: any;
  subcolumnDefinitions: Column[];
  subgridOptions: GridOption;
  subdataset: any[];

  row_number
  
    constructor(
      config: NgbDropdownConfig,
      private ccFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private subaccountService: SubaccountService,
      private modalService: NgbModal,
      private accountService: AccountService,
      private costcenterService: CostcenterService,

  ) {
    config.autoClose = true
  }


ngOnInit(): void {
  this.loading$ = this.loadingSubject.asObservable()
  this.loadingSubject.next(true)
  this.activatedRoute.params.subscribe((params) => {
      const id = params.id
      this.costcenterService.getOne(id).subscribe((response: any)=>{
        console.log(response.data)
        this.ccEdit = response.data.cc
        this.mvdataset = response.data.accdetails
        this.subdataset = response.data.subdetails
        this.initCode()
        this.loadingSubject.next(false)
        this.title = this.title + this.ccEdit.cc_ctr
        console.log(this.mvdataset)
      
      })
  })
  this.initmvGrid()
  this.initsubGrid()
}
// init code
initCode() {
  this.createForm()
  this.loadingSubject.next(false)
}
 //create form
 createForm() {
  this.loadingSubject.next(false)
  
  this.ccForm = this.ccFB.group({
      cc_ctr: [{value:this.ccEdit.cc_cc, disabled: true}],
      cc_desc: [ this.ccEdit.cc_desc,  Validators.required ],
      cc_active: [this.ccEdit.cc_active],
     
      
  })
}

 //reste form
 reset() {
  this.cc = new Costcenter()
  this.createForm()
  this.hasFormErrors = false
}
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.ccForm.controls
  /** check form */
  if (this.ccForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      return
  }

  // tslint:disable-next-line:prefer-const
  let cc = this.prepareCc()
  console.log(cc)
  for (let data of this.mvdataset) {
    delete data.id;
    delete data.cmvid;
  }
  for (let data of this.subdataset) {
    delete data.id;
    delete data.cmvid;
  }
  this.addCc(cc, this.mvdataset, this.subdataset)
}
/**
* Returns object for saving
*/
prepareCc(): Costcenter {
  const controls = this.ccForm.controls
  const _cc = new Costcenter()
  _cc.id = this.ccEdit.id
  _cc.cc_ctr = controls.cc_ctr.value
  _cc.cc_desc = controls.cc_desc.value
  _cc.cc_active = controls.cc_active.value
  
  return _cc
}
/**
* Add code
*
* @param _cc: InventoryStatusModel
*/
addCc(_cc: Costcenter, accdetails: any, subdetails:any) {
  this.loadingSubject.next(true)
  this.costcenterService.update({cc:_cc, accdetails, subdetails},this.ccEdit.id).subscribe(
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
          this.router.navigateByUrl("inventory-settings/list-status")
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

  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  subGridReady(angularGrid: AngularGridInstance) {
    this.subangularGrid = angularGrid;
    this.subdataView = angularGrid.dataView;
    this.subgrid = angularGrid.slickGrid;
    this.subgridService = angularGrid.gridService;
  }

  initmvGrid() {
    this.mvcolumnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.mvangularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      },
      {
        id: "ccd1_line",
        name: "Ligne",
        field: "ccd1_line",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.integer,
        editor: {
          model: Editors.integer,
        },
      },
      {
        id: "ccd1_acc_beg",
        name: "Compte Début",
        field: "ccd1_acc_beg",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvid",
        field: "cmvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.row_number = args.row;
          let element: HTMLElement = document.getElementById(
            "openItemsGrid"
          ) as HTMLElement;
          element.click();
        },
      },
      {
        id: "ccd1_acc_end",
        name: "Compte Fin",
        field: "ccd1_acc_end",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvid",
        field: "cmvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.row_number = args.row;
          let element: HTMLElement = document.getElementById(
            "openItems2Grid"
          ) as HTMLElement;
          element.click();
        },
      },
      
    ];

    this.mvgridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
    };

  
  }
  addNewItem() {
    const newId = this.mvdataset.length+1;

    const newItem = {
      id: newId,
      ccd1_line : newId,
      ccd1_acc_beg: "",
      ccd1_acc_end: "",
      cmvid: "",
    };
    this.mvgridService.addItem(newItem, { position: "bottom" });
  }

  addNewItemsub() {
    const newId = this.subdataset.length+1;

    const newItem = {
      id: newId,
      ccd2_line : newId,
      ccd2_sub_beg: "",
      ccd2_sub_end: "",
      cmvid: "",
    };
    this.subgridService.addItem(newItem, { position: "bottom" });
  }

  initsubGrid() {
    this.subcolumnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.subangularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      },
      {
        id: "ccd2_line",
        name: "Ligne",
        field: "ccd2_line",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.integer,
        editor: {
          model: Editors.integer,
        },
      },
      {
        id: "ccd2_sub_beg",
        name: "Sous ompte Début",
        field: "ccd2_sub_beg",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvid",
        field: "cmvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.row_number = args.row;
          let element: HTMLElement = document.getElementById(
            "openItemssubGrid"
          ) as HTMLElement;
          element.click();
        },
      },
      {
        id: "ccd2_sub_end",
        name: "Sous Compte Fin",
        field: "ccd2_sub_end",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvid",
        field: "cmvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.row_number = args.row;
          let element: HTMLElement = document.getElementById(
            "openItemssub2Grid"
          ) as HTMLElement;
          element.click();
        },
      },
      
    ];

    this.subgridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
    };

    
  }
  




handleSelectedRowsChanged4(e, args) {
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObj4) {
    args.rows.map((idx) => {
      const item = this.gridObj4.getDataItem(idx);
      console.log(item);
      updateItem.ccd1_acc_beg = item.ac_code;
      
      this.mvgridService.updateItem(updateItem);
    });
  }
}
handleSelectedRowsChanged5(e, args) {
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObj4) {
    args.rows.map((idx) => {
      const item = this.gridObj4.getDataItem(idx);
      console.log(item);
      updateItem.ccd1_acc_end = item.ac_code;
      
      this.mvgridService.updateItem(updateItem);
    });
  }
}
angularGridReady4(angularGrid: AngularGridInstance) {
  this.angularGrid4 = angularGrid
  this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {}
}
angularGridReady5(angularGrid: AngularGridInstance) {
  this.angularGrid5 = angularGrid
  this.gridObj5 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid4() {
  this.columnDefinitions4 = [
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
          name: "Description",
          field: "ac_desc",
          sortable: true,
          width: 80,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "ac_active",
          name: "Active",
          field: "ac_active",
          sortable: true,
          width: 200,
          filterable: true,
          type: FieldType.string,
      },
  ]

  this.gridOptions4 = {
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
      .subscribe((response: any) => (this.accounts = response.data))
}
open4(content) {
 
  this.prepareGrid4()
  this.modalService.open(content, { size: "lg" })
}

prepareGrid5() {
  this.columnDefinitions5 = [
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
          name: "Description",
          field: "ac_desc",
          sortable: true,
          width: 80,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "ac_active",
          name: "Active",
          field: "ac_active",
          sortable: true,
          width: 200,
          filterable: true,
          type: FieldType.string,
      },
  ]

  this.gridOptions5 = {
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
      .subscribe((response: any) => (this.accounts = response.data))
}
open5(content) {
 
  this.prepareGrid5()
  this.modalService.open(content, { size: "lg" })
}
onAlertClose($event) {
this.hasFormErrors = false
}






handleSelectedRowsChanged6(e, args) {
let updateItem = this.subgridService.getDataItemByRowIndex(this.row_number);
if (Array.isArray(args.rows) && this.gridObj6) {
  args.rows.map((idx) => {
    const item = this.gridObj6.getDataItem(idx);
    console.log(item);
    updateItem.ccd2_sub_beg = item.sb_sub;
    
    this.subgridService.updateItem(updateItem);
  });
}
}
handleSelectedRowsChanged7(e, args) {
let updateItem = this.subgridService.getDataItemByRowIndex(this.row_number);
if (Array.isArray(args.rows) && this.gridObj7) {
  args.rows.map((idx) => {
    const item = this.gridObj7.getDataItem(idx);
    console.log(item);
    updateItem.ccd2_sub_end = item.sb_sub;
    
    this.subgridService.updateItem(updateItem);
  });
}
}
angularGridReady6(angularGrid: AngularGridInstance) {
this.angularGrid6 = angularGrid
this.gridObj6 = (angularGrid && angularGrid.slickGrid) || {}
}
angularGridReady7(angularGrid: AngularGridInstance) {
this.angularGrid7 = angularGrid
this.gridObj7 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid6() {
this.columnDefinitions6 = [
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
        id: "sb_sub",
        name: "Sous Compte",
        field: "sb_sub",
        sortable: true,
        filterable: true,
        type: FieldType.string,
    },
    {
        id: "sb_desc",
        name: "Description",
        field: "sb_desc",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
    },
    {
        id: "sb_active",
        name: "Active",
        field: "sb_active",
        sortable: true,
        width: 200,
        filterable: true,
        type: FieldType.string,
    },
]

this.gridOptions6 = {
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
this.subaccountService
    .getAll()
    .subscribe((response: any) => (this.subs = response.data))
}
open6(content) {

this.prepareGrid6()
this.modalService.open(content, { size: "lg" })
}

prepareGrid7() {
this.columnDefinitions7 = [
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
        id: "sb_sub",
        name: "Sous Compte",
        field: "sb_sub",
        sortable: true,
        filterable: true,
        type: FieldType.string,
    },
    {
        id: "sb_desc",
        name: "Description",
        field: "sb_desc",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
    },
    {
        id: "sb_active",
        name: "Active",
        field: "sb_active",
        sortable: true,
        width: 200,
        filterable: true,
        type: FieldType.string,
    },
]

this.gridOptions7 = {
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
this.subaccountService
    .getAll()
    .subscribe((response: any) => (this.subs = response.data))
}
open7(content) {

this.prepareGrid7()
this.modalService.open(content, { size: "lg" })
}
}
