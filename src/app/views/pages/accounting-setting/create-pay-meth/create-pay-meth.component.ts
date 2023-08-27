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
import { PayMethService, PayMeth, CodeService } from "../../../../core/erp";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
@Component({
  selector: 'kt-create-pay-meth',
  templateUrl: './create-pay-meth.component.html',
  styleUrls: ['./create-pay-meth.component.scss']
})
export class CreatePayMethComponent implements OnInit {

  ctForm: FormGroup;
  row_number;

  isExist = false

  transacts: []
  columnDefinitions4: Column[] = []
  gridOptions4: GridOption = {}
  gridObj4: any
  angularGrid4: AngularGridInstance
  

  
  sc: [];

  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];
  payMeth: PayMeth;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;

  constructor(
    config: NgbDropdownConfig,
    private ctFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private payMethService: PayMethService,
    private codeService: CodeService
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
    this.reset();
    this.createForm();
    this.initmvGrid();
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.payMeth = new PayMeth();
    this.ctForm = this.ctFB.group({
      ct_code: [this.payMeth.ct_code, Validators.required],
      ct_desc: [{ value: this.payMeth.ct_desc, disabled: !this.isExist },  Validators.required],
     
    });
  }


  onChangeCode() {
    const controls = this.ctForm.controls
    this.payMethService
        .getBy({
              ct_code: controls.ct_code.value
        })
        .subscribe((response: any) => {
          console.log(response.data)
            if (response.data.inventoryStatus ) {
                this.isExist = true
                console.log(response.data.length)
              
            } else {
                controls.ct_desc.enable()
               
                
            }
     })
  }
  //reste form
  reset() {
    this.payMeth = new PayMeth();
    this.mvdataset = [];
    this.createForm();

    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.ctForm.controls;
    /** check form */
    if (this.ctForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    // tslint:disable-next-line:prefer-const
    let paymeth = this.preparepaymeth();
    for (let data of this.mvdataset) {
      delete data.id;
      delete data.cmvid;
    }
    this.addpaymeth(paymeth, this.mvdataset);
  }
  /**
   * Returns object for saving
   */
  preparepaymeth(): PayMeth {
    const controls = this.ctForm.controls;
    const _payMeth = new PayMeth();
    _payMeth.ct_code = controls.ct_code.value;
    _payMeth.ct_desc = controls.ct_desc.value;
  
    return _payMeth;
  }
  /**
   * Add code
   *
   * @param _paymeth: PayMethModel
   */
  addpaymeth(_paymeth: PayMeth, details: any) {
    this.loadingSubject.next(true);
    this.payMethService
      .add({ PayMeth: _paymeth, PayMethDetails: details })
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
          this.reset();
          this.router.navigateByUrl("/accounting-setting/create-pay-meth");
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
        id: "ctd_term",
        name: "Term",
        field: "ctd_term",
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
        id: "ctd_desc",
        name: "Description",
        field: "ctd_desc",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
     
      },
      {
        id: "ctd_due_day",
        name: "échéance",
        field: "ctd_due_day",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.integer,
        editor: {
          model: Editors.integer,
        },
      },
      {
        id: "ctd_pct",
        name: "% ",
        field: "ctd_pct",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
        editor: {
          model: Editors.float,
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
      ctd_term: "",
      ctd_desc: "",
      cmvid: "",
      ctd_due_day: 0
    };
    this.mvgridService.addItem(newItem, { position: "bottom" });
  }

  handleSelectedRowsChanged4(e, args) {
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        console.log(item);
        updateItem.ctd_term = item.code_value;
        updateItem.ctd_desc = item.code_cmmt;
        updateItem.ctd_due_day = item.dec01;
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
        {
          id: "dec01",
          name: "Jours",
          field: "dec01",
          sortable: true,
          width: 100,
          filterable: true,
          type: FieldType.float,
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
        .getBy({ code_fldname: "cm_cr_terms" })
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
