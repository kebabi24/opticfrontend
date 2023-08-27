import { Component, OnInit } from "@angular/core";
// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Formatters,
  Editor,
  Editors,
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

import { PurchaseOrderService } from "../../../../core/erp";
import { RowDetailViewPoComponent } from "../rowDetails/rowdetail-view-po.component";
import { RowDetailPreloadComponent } from '../rowDetails/row-details-preload.component';
@Component({
  selector: "kt-purchase-order-list",
  templateUrl: "./purchase-order-list.component.html",
  styleUrls: ["./purchase-order-list.component.scss"],
})
export class PurchaseOrderListComponent implements OnInit {
  // slick grid
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private poService: PurchaseOrderService
  ) {
    this.prepareGrid();
  }

  ngOnInit(): void {}

  createCode() {
    this.router.navigateByUrl("purchasing/create-po");
  }
  prepareGrid() {
    this.columnDefinitions = [
      {
        id: "edit",
        field: "id",
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: (row, cell, value, columnDef, dataContext) => {
          // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
          return `
               <a class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">
               <span class="svg-icon svg-icon-md">
                   <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                       height="24px" viewBox="0 0 24 24" version="1.1">
                       <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                           <rect x="0" y="0" width="24" height="24"></rect>
                           <path
                               d="M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z"
                               fill="#000000" fill-rule="nonzero"
                               transform="translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) ">
                           </path>
                           <rect fill="#000000" opacity="0.3" x="5" y="20" width="15" height="2" rx="1"></rect>
                       </g>
                   </svg>
               </span>
           </a>
           `;
        },
        minWidth: 50,
        maxWidth: 50,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (e: Event, args: OnEventArgs) => {},
      },

      {
        id: "po_nbr",
        name: "Code",
        field: "po.po_nbr",
        minWidth: 80,
        maxWidth: 80,
        selectable: true,
      },
      {
        id: "po_vend",
        name: "Fournisseur",
        field: "po.po_vend",
        sortable: true,
        width: 50,
        filterable: false,
      },

      {
        id: "po_ord_date",
        name: "Date de creation",
        field: "po.po_ord_date",
        sortable: true,
        width: 80,
        filterable: false,
      },
      {
        id: "po_req_id",
        name: "Numero de demande ",
        field: "po.po_req_id",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
      },
    ];

    this.gridOptions = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      autoEdit: false,
      autoHeight: false,
      dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
        var val = undefined;
        try {
          val = eval("item." + column.field);
        } catch (e) {
          // ignore
        }
        return val;
      },
      enableRowDetailView: true,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
      rowDetailView: {
        // We can load the "process" asynchronously in 2 different ways (httpClient OR even Promise)
        process: (item) => {
          return this.simulateServerAsyncCall(item);
        },

        // load only once and reuse the same item detail without calling process method
        loadOnce: true,

        // limit expanded row to only 1 at a time
        singleRowExpand: true,

        // false by default, clicking anywhere on the row will open the detail view
        // when set to false, only the "+" icon would open the row detail
        // if you use editor or cell navigation you would want this flag set to false (default)
        useRowClick: false,

        // how many grid rows do we want to use for the row detail panel (this is only set once and will be used for all row detail)
        // also note that the detail view adds an extra 1 row for padding purposes
        // so if you choose 4 panelRows, the display will in fact use 5 rows
        panelRows: 9,

        // you can override the logic for showing (or not) the expand icon
        // for example, display the expand icon only on every 2nd row
        // expandableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1),

        // Preload View Template
        preloadComponent: RowDetailPreloadComponent,

        // ViewModel Template to load when row detail data is ready
        viewComponent: RowDetailViewPoComponent,

        // Optionally pass your Parent Component reference to your Child Component (row detail component)
        parent: this,
      },
    };

    // fill the dataset with your data
    this.dataset = [];
    this.poService.getAll().subscribe(
      (response: any) => (this.dataset = response.data),
      (error) => {
        this.dataset = [];
      },
      () => {}
    );
  }
  simulateServerAsyncCall(item: any) {
    return new Promise((resolve) => {
      const itemDetail = item;
      console.log(itemDetail)
      resolve(itemDetail);
    });
  }
}
