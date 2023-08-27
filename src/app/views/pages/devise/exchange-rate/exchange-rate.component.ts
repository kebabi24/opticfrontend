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
import {
  PurchaseOrderService,
  RequisitionService,
  SequenceService,
  ProviderService,
  UsersService,
  ItemService,
  PurchaseOrder,
  VendorProposalService,
  TaxeService,
  DeviseService,
  VendorProposal,
  printBc,
} from "../../../../core/erp";
import { add } from 'lodash';
@Component({
  selector: "kt-exchange-rate",
  templateUrl: "./exchange-rate.component.html",
  styleUrls: ["./exchange-rate.component.scss"],
})
export class ExchangeRateComponent implements OnInit {
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  form: FormGroup;

  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>


  devises: [];
  columnDefinitionscurr: Column[] = [];
  gridOptionscurr: GridOption = {};
  gridObjcurr: any;
  angularGridcurr: AngularGridInstance;

  ex_curr1;
  ex_curr2;
  constructor(
    private reqFB: FormBuilder,
    private modalService: NgbModal,
    private deviseService: DeviseService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private layoutUtilsService: LayoutUtilsService
  ) {
    this.initGrid();
    this.createForm();
  }
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  initGrid() {
    this.columnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.angularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      },

      {
        id: "exr_start_date",
        name: "Debut",
        field: "exr_start_date",
        selectable: true,
        formatter: Formatters.dateIso,
        type: FieldType.dateIso,
        editor: {
          model: Editors.date,
        },
      },

      {
        id: "exr_end_date",
        name: "Date Fin",
        field: "exr_end_date",
        formatter: Formatters.dateIso ,
        type: FieldType.dateIso,
        editor: {
          model: Editors.date,
        },
        selectable: true,
      },

      {
        id: "exr_rate",
        name: "Unite Devise 1",
        field: "exr_rate",
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
        formatter: Formatters.decimal,
        selectable: true,
      },
      {
        id: "exr_rate2",
        name: "Unite devise 2",
        field: "exr_rate2",
        selectable: true,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
        formatter: Formatters.decimal,
      },
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      formatterOptions: {
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,

        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,

        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: " ", // can be any of ',' | '_' | ' ' | ''
      },
    };

    this.dataset = [];
  }

  addNewItem() {
    this.gridService.addItem(
      {
        id: this.dataset.length + 1,
        exr_start_date: null,
        exr_end_date: null,
        exr_rate: null,
        exr_rate2: null,
        is_new: true,
      },
      { position: "bottom" }
    );
  }

  ngOnInit(): void {
    
  }

  goBack() {
    this.loadingSubject.next(false)
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  reset() {
    this.form = this.reqFB.group({
      ex_curr1: [""],
      ex_curr2: [""],
    }); }

  createForm() {
    this.form = this.reqFB.group({
      ex_curr1: [""],
      ex_curr2: [""],
    });
  }
  handleSelectedRowsChangedcurr(e, args) {
    const controls = this.form.controls;
    if (Array.isArray(args.rows) && this.gridObjcurr) {
      args.rows.map((idx) => {
        const item = this.gridObjcurr.getDataItem(idx);
        console.log(this.ex_curr1);
        if (this.ex_curr1 == true)
          controls.ex_curr1.setValue(item.cu_curr || "");
        if (this.ex_curr2 == true) {
          controls.ex_curr2.setValue(item.cu_curr || "");
          this.deviseService
            .getByExr({
              exr_curr1: controls.ex_curr1.value,
              exr_curr2: controls.ex_curr2.value,
            })
            .subscribe((res: any) => (this.dataset = res.data));
        }
      });
    }
  }

  angularGridReadycurr(angularGrid: AngularGridInstance) {
    this.angularGridcurr = angularGrid;
    this.gridObjcurr = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridcurr() {
    this.columnDefinitionscurr = [
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

    this.gridOptionscurr = {
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
  opencurr(content) {
    this.ex_curr1 = true;
    this.ex_curr2 = false;
    this.prepareGridcurr();
    this.modalService.open(content, { size: "lg" });
  }
  opencurr2(content) {
    this.ex_curr1 = false;
    this.ex_curr2 = true;
    this.prepareGridcurr();
    this.modalService.open(content, { size: "lg" });
  }
  onSubmit(){
    this.add(0)
  }
//reste form


  add(i) {
    const controls = this.form.controls;
    const elem = this.dataset[i];
    if (elem.is_new == true) {
      const { is_new, ...rest } = elem;
      this.deviseService
        .addExr({
          ...rest,
          exr_curr1: controls.ex_curr1.value,
          exr_curr2: controls.ex_curr2.value,
        })
        .subscribe(
          (res) => console.log(res),
          (error) => console.log(error),
          () => {
            if (i == this.dataset.length - 1) {
              this.layoutUtilsService.showActionNotification(
                "Ajout avec succès",
                MessageType.Create,
                10000,
                true,
                true
              );
              const url = `/`;
              this.router.navigateByUrl(url);
            } else {
              i++;
              this.add(i);
            }
          }
        );
    } else {
      if (i == this.dataset.length - 1) {
        this.layoutUtilsService.showActionNotification(
          "Ajout avec succès",
          MessageType.Create,
          10000,
          true,
          true
        );
        const url = `/`;
        this.router.navigateByUrl(url);
      } else {
        i++;
        this.add(i);
      }
    }
  }
}
