import { Component, OnInit } from "@angular/core";
// Angular slickgrid
import {
  Formatter,
  Editor,
  Editors,
  OnEventArgs,
  AngularGridInstance,
  Aggregators,
  Column,
  DelimiterType,
  FieldType,
  FileType,
  Filters,
  Formatters,
  FlatpickrOption,
  GridOption,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
  ColumnFilter,
  Filter,
  FilterArguments,
  FilterCallback,
  MultipleSelectOption,
  OperatorType,
  OperatorString,
  SearchTerm,
} from "angular-slickgrid"

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

import { SaleOrderService } from "../../../../core/erp";
const defaultPageSize = 100;
@Component({
  selector: 'kt-so-list',
  templateUrl: './so-list.component.html',
  styleUrls: ['./so-list.component.scss']
})
export class SoListComponent implements OnInit {

 
// slick grid
selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
gridObj: any;
dataviewObj: any;
angularGrid: AngularGridInstance;
draggableGroupingPlugin: any;    
columnDefinitions: Column[] = [];
gridOptions: GridOption = {};
dataset: any[] = [];
constructor(
  private activatedRoute: ActivatedRoute,
  private router: Router,
  public dialog: MatDialog,
  private layoutUtilsService: LayoutUtilsService,
  private soService: SaleOrderService
) {
  this.prepareGrid();
}

ngOnInit(): void {}
angularGridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
  this.gridObj = angularGrid.slickGrid; // grid object
  this.dataviewObj = angularGrid.dataView;
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
  `
      },
      minWidth: 50,
      maxWidth: 50,
      // use onCellClick OR grid.onClick.subscribe which you can see down below
      onCellClick: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id
          this.router.navigateByUrl(`/Sales/edit-so/${id}`)
      },
  },
    {
      id: "id",
      name: "id",
      field: "id",
      resizable: false,
      sortable: false,
      minWidth: 50,
      maxWidth: 50
    },
    {
      id: "so_mstr.id",
      name: "iid",
      field: "so_mstr.id",
      resizable: false,
      sortable: false,
      minWidth: 50,
      maxWidth: 50
    },
    {
      id: "so_nbr",
      name: "Code",
      field: "so_nbr",
      minWidth: 80,
      maxWidth: 80,
      selectable: true,
      filterable: true,
      grouping: {
        getter: 'so_nbr',
        formatter: (g) => `N BC: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregateCollapsed: false,
        collapsed: false,
      }
    },
    {
      id: "so_cust",
      name: "Client",
      field: "so_cust",
      sortable: true,
      width: 50,
      filterable: true,
      grouping: {
        getter: 'so_cust',
        formatter: (g) => `Client: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregateCollapsed: false,
        collapsed: false,
      }
    },

    {
      id: "so_ord_date",
      name: "Date de creation",
      field: "so_ord_date",
      sortable: true,
      width: 50,
      filterable: true,
      formatter: Formatters.dateIso,
      type: FieldType.dateIso,
      grouping: {
        getter: 'so_ord_date',
        formatter: (g) => `Date Creation: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregateCollapsed: false,
        collapsed: false,
      }
    },
    {
      id: "so_due_date",
      name: "Date d echeance",
      field: "so_due_date",
      sortable: true,
      width: 50,
      filterable: true,
      formatter: Formatters.dateIso,
      type: FieldType.dateIso,
      grouping: {
        getter: 'so_due_date',
        formatter: (g) => `Date echeance: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregateCollapsed: false,
        collapsed: false,
      }
    },
    {
      id: "so_stat",
      name: "Status",
      field: "so_stat",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.string,
    },
    
    {
      id: "so_po",
      name: "N° Projet ",
      field: "so_po",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "sod_part",
      name: "Article",
      field: "sod_part",
      sortable: true,
      width: 50,
      filterable: true,
      grouping: {
        getter: 'sod_part',
        formatter: (g) => `Article: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('sod_qty_ord'),
          new Aggregators.Sum('sod_qty_rcvd')
        ],
        aggregateCollapsed: true,
    
        collapsed: false,
      }
    },
    {
      id: "pt_desc1",
      name: "Designation",
      field: "pt_desc1",
      sortable: true,
      width: 50,
      filterable: true,
    },
    {
      id: "sod_um",
      name: "UM",
      field: "sod_um",
      sortable: true,
      width: 30,
      filterable: true,
    },
    
    {
      id: "sod_qty_ord",
      name: "Quantite",
      field: "sod_qty_ord",
      sortable: true,
      width: 50,
      filterable: true,
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
      type: FieldType.float,

    },
    {
      id: "sod_qty_ship",
      name: "Quantite Livree",
      field: "sod_qty_ship",
      sortable: true,
      width: 50,
      filterable: true,
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
      type: FieldType.float,

    },
    
    {
      id: "sod_price",
      name: "Prix",
      field: "sod_price",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.float,
    },
    
  ];

  this.gridOptions = {
    autoResize: {
      containerId: 'demo-container',
      sidePadding: 10
    },
    enableDraggableGrouping: true,
    createPreHeaderPanel: true,
    showPreHeaderPanel: true,
    preHeaderPanelHeight: 40,
    enableFiltering: true,
    enableSorting: true,
    exportOptions: {
      sanitizeDataExport: true
    },
    
  
    gridMenu: {
      onCommand: (e, args) => {
        if (args.command === 'toggle-preheader') {
          // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
          this.clearGrouping();
        }
      },
    },
    draggableGrouping: {
      dropPlaceHolderText: 'Drop a column header here to group by the column',
      // groupIconCssClass: 'fa fa-outdent',
      deleteIconCssClass: 'fa fa-times',
      onGroupChanged: (e, args) => this.onGroupChanged(args),
      onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
  
  },
    enablePagination: true, // you could optionally disable the Pagination
      pagination: {
      pageSizes: [20, 50, 100, 200, 300, 400, 500, 700, 1000],
      pageSize: defaultPageSize,
      totalItems: 0
    },


    dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
      var val = undefined;
      try {
        val = eval("item." + column.field);
      } catch (e) {
        // ignore
      }
      return val;
    },


}

// fill the dataset with your data
this.dataset = []
this.soService.getAllwithDetail().subscribe(
    (response: any) =>  ( this.dataset = response.data),
   
   

   (error) => {
    
        this.dataset = []
    },
    () => {}
   
)  

  // fill the dataset with your data
}

onGroupChanged(change: { caller?: string; groupColumns: Grouping[] }) {
  // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
  const caller = change && change.caller || [];
  const groups = change && change.groupColumns || [];

  if (Array.isArray(this.selectedGroupingFields) && Array.isArray(groups) && groups.length > 0) {
    // update all Group By select dropdown
    this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = groups[i] && groups[i].getter || '');
  } else if (groups.length === 0 && caller === 'remove-group') {
    this.clearGroupingSelects();
  }
}
clearGroupingSelects() {
  this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = '');
}

collapseAllGroups() {
  this.dataviewObj.collapseAllGroups();
}

expandAllGroups() {
  this.dataviewObj.expandAllGroups();
}
clearGrouping() {
  if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
    this.draggableGroupingPlugin.clearDroppedGroups();
  }
  this.gridObj.invalidate(); // invalidate all rows and re-render
}

}
