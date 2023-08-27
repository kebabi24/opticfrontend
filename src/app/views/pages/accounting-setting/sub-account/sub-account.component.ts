// Angular
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
import { SubaccountService, Subaccount, AccountService } from "../../../../core/erp";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
@Component({
    selector: "kt-sub-account",
    templateUrl: "./sub-account.component.html",
    styleUrls: ["./sub-account.component.scss"],
    providers: [NgbDropdownConfig, NgbTabsetConfig],
})
export class SubAccountComponent implements OnInit {
    subForm: FormGroup;
  row_number;

  isExist = false

  accounts: []
  columnDefinitions4: Column[] = []
  gridOptions4: GridOption = {}
  gridObj4: any
  angularGrid4: AngularGridInstance
  
  columnDefinitions5: Column[] = []
  gridOptions5: GridOption = {}
  gridObj5: any
  angularGrid5: AngularGridInstance
  
  
  sc: [];

  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];
  sub: Subaccount;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;

  constructor(
    config: NgbDropdownConfig,
    private subFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private subaccountService: SubaccountService,
    private accountService: AccountService
  ) {
    config.autoClose = true;
  }

  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.createForm();
    this.initmvGrid();
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.sub = new Subaccount();
    this.subForm = this.subFB.group({
      sb_sub: [this.sub.sb_sub, Validators.required],
      sb_desc: [{ value: this.sub.sb_desc, disabled: !this.isExist },  Validators.required],
      sb_active: [{ value: this.sub.sb_active, disabled: !this.isExist }],
    });
  }


  onChangeCode() {
    const controls = this.subForm.controls
    this.subaccountService
        .getBy({
              sb_sub: controls.sb_sub.value
        })
        .subscribe((response: any) => {
          console.log(response.data)
            if (response.data.inventoryStatus ) {
                this.isExist = true
                console.log(response.data.length)
              
            } else {
                controls.sb_desc.enable()
                controls.sb_active.enable()
            }
     })
  }
  //reste form
  reset() {
    this.sub = new Subaccount();
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.subForm.controls;
    /** check form */
    if (this.subForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    // tslint:disable-next-line:prefer-const
    let sub = this.preparesub();
    for (let data of this.mvdataset) {
      delete data.id;
      delete data.cmvid;
    }
    this.addsub(sub, this.mvdataset);
  }
  /**
   * Returns object for saving
   */
  preparesub(): Subaccount {
    const controls = this.subForm.controls;
    const _sub = new Subaccount();
    _sub.sb_sub = controls.sb_sub.value;
    _sub.sb_desc = controls.sb_desc.value;
    _sub.sb_active = controls.sb_active.value;
    return _sub;
  }
  /**
   * Add code
   *
   * @param _sub: InventoryStatusModel
   */
  addsub(_sub: Subaccount, details: any) {
    this.loadingSubject.next(true);
    this.subaccountService
      .add({ subaccount: _sub, Details: details })
      .subscribe(
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
            "Ajout avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.loadingSubject.next(false);
          this.router.navigateByUrl("/accounting-settings/list-sub");
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
        id: "sbd_line",
        name: "Ligne",
        field: "sbd_line",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.integer,
        editor: {
          model: Editors.integer,
        },
      },
      {
        id: "sbd_acc_beg",
        name: "Compte Début",
        field: "sbd_acc_beg",
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
        id: "sbd_acc_end",
        name: "Compte Fin",
        field: "sbd_acc_end",
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

    this.mvdataset = [];
  }
  addNewItem() {
    const newId = this.mvdataset.length+1;

    const newItem = {
      id: newId,
      sbd_line : newId,
      sbd_acc_beg: "",
      sbd_acc_end: "",
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
        updateItem.sbd_acc_beg = item.ac_code;
        
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
        updateItem.sbd_acc_end = item.ac_code;
        
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
}
