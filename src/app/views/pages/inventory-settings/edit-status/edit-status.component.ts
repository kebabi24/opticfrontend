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
/// Angular slickgrid
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
} from "angular-slickgrid"

import { InventoryStatus, InventoryStatusService, CodeService } from "../../../../core/erp"


@Component({
  selector: 'kt-edit-status',
  templateUrl: './edit-status.component.html',
  styleUrls: ['./edit-status.component.scss']
})

export class EditStatusComponent implements OnInit {

  inventoryStatus: InventoryStatus
  statusForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  statusEdit: any
  title: String = 'Modifier Status Stock - '
  
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];

  transacts: []
  columnDefinitions4: Column[] = []
  gridOptions4: GridOption = {}
  gridObj4: any
  angularGrid4: AngularGridInstance
  
  row_number
  
    constructor(
      config: NgbDropdownConfig,
      private statusFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private inventoryStatusService: InventoryStatusService,
      private modalService: NgbModal,
      private codeService: CodeService
  ) {
    config.autoClose = true
  }


ngOnInit(): void {
  this.loading$ = this.loadingSubject.asObservable()
  this.loadingSubject.next(true)
  this.activatedRoute.params.subscribe((params) => {
      const id = params.id
      this.inventoryStatusService.getOne(id).subscribe((response: any)=>{
        this.statusEdit = response.data.inventoryStatus
        this.mvdataset = response.data.details
        this.initCode()
        this.loadingSubject.next(false)
        this.title = this.title + this.statusEdit.is_status
        console.log(this.mvdataset)
      
      })
  })
  this.initmvGrid()
}
// init code
initCode() {
  this.createForm()
  this.loadingSubject.next(false)
}
 //create form
 createForm() {
  this.loadingSubject.next(false)
  
  this.statusForm = this.statusFB.group({
      is_status: [this.statusEdit.is_status, Validators.required],
      is_desc: [ this.statusEdit.is_desc,  Validators.required ],
      is_avail: [this.statusEdit.is_avail],
      is_nettable: [this.statusEdit.is_nettable],
      is_overissue: [this.statusEdit.is_overissue],
      
  })
}

 //reste form
 reset() {
  this.inventoryStatus = new InventoryStatus()
  this.createForm()
  this.hasFormErrors = false
}
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.statusForm.controls
  /** check form */
  if (this.statusForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      return
  }

  // tslint:disable-next-line:prefer-const
  let address = this.prepareStatus()
  console.log(address)
  for (let data of this.mvdataset) {
    delete data.id;
    delete data.cmvid;
  }
  this.addStatus(address, this.mvdataset)
}
/**
* Returns object for saving
*/
prepareStatus(): InventoryStatus {
  const controls = this.statusForm.controls
  const _status = new InventoryStatus()
  _status.id = this.statusEdit.id
  _status.is_status = controls.is_status.value
  _status.is_desc = controls.is_desc.value
  _status.is_avail = controls.is_avail.value
  _status.is_nettable = controls.is_nettable.value
  _status.is_overissue = controls.is_overissue.value
  
  return _status
}
/**
* Add code
*
* @param _status: InventoryStatusModel
*/
addStatus(_status: InventoryStatus, details: any) {
  this.loadingSubject.next(true)
  this.inventoryStatusService.update({status:_status, details},this.statusEdit.id).subscribe(
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
        id: "isd_tr_type",
        name: "Mouvement Interdit",
        field: "isd_tr_type",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
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
        id: "isd__qadc01",
        name: "Description",
        field: "isd__qadc01",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        editor: {
          model: Editors.text,
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
      isd_tr_type: "",
      isd__qadc01: "",
      cmvid: "",
    };
    this.mvgridService.addItem(newItem, { position: "bottom" });
  }

  handleSelectedRowsChanged4(e, args) {
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        console.log(item);
        updateItem.isd_tr_type = item.code_value;
        updateItem.isd__qadc01 = item.code_cmmt;
        
        this.mvgridService.updateItem(updateItem);
      });
    }
  }
  angularGridReady4(angularGrid: AngularGridInstance) {
    this.angularGrid4 = angularGrid
    this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {}
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
            width: 80,
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
    this.codeService
        .getBy({ code_fldname: "tr_type" })
        .subscribe((response: any) => (this.transacts = response.data))
}
open4(content) {
   
    this.prepareGrid4()
    this.modalService.open(content, { size: "lg" })
}
onAlertClose($event) {
  this.hasFormErrors = false
}

}
