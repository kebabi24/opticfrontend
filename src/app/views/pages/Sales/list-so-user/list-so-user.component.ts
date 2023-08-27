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
  GridService,
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
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { jsPDF } from "jspdf";
import "jspdf-barcode";
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

import { SaleOrderService, ProviderService,CustomerService, VisiteService,GlassesService,
  ItemService,AccessoireService,PurchaseOrderService } from "../../../../core/erp";
const defaultPageSize = 100;

@Component({
  selector: 'kt-list-so-user',
  templateUrl: './list-so-user.component.html',
  styleUrls: ['./list-so-user.component.scss']
})
export class ListSoUserComponent implements OnInit {


  loadingSubject = new BehaviorSubject<boolean>(true);
  soForm: FormGroup;
// slick grid
selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
draggableGroupingPlugin: any;
angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  details: any [];
datasetgls: any[];
datasetacs: any[];
datasetmnt: any[];
soEdit: any;
customer: any;
visit: any;
provider;
hasFormErrors = false;
loading$: Observable<boolean>;
error = false;
  message = "";

constructor(
  private activatedRoute: ActivatedRoute,
  private router: Router,
  public dialog: MatDialog,
  private soFB: FormBuilder,
  private layoutUtilsService: LayoutUtilsService,
  private soService: SaleOrderService,
  private customerService: CustomerService,
  private visiteService: VisiteService,
  private glassesService: GlassesService,
  private itemService: ItemService,
  private purchaseOrderService: PurchaseOrderService,
  private accessoireService: AccessoireService,
  private providerService: ProviderService,
  private modalService: NgbModal,
    
  private saleOrderService: SaleOrderService,
) {
  this.prepareGrid();
  //this.solist();
}

ngOnInit(): void {
  this.createForm();
  this.prepareGrid();
  this.solist();

}
gridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
  this.dataView = angularGrid.dataView;
  this.grid = angularGrid.slickGrid;
  this.gridService = angularGrid.gridService;
}
createForm() {
  const date = new Date ;
  date.setDate(date.getDate() - 2);
  const date1 = new Date;
  this.soForm = this.soFB.group({
  
    date: [{
      year:date.getFullYear(),
      month: date.getMonth()+1,
      day: date.getDate() 
    }],
    date1: [{
      year:date1.getFullYear(),
      month: date1.getMonth()+1,
      day: date1.getDate()
    }],
    vend: [""],
  
  });

  
  

}

prepareGrid() {
  this.columnDefinitions = [
    
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
      id: "created_by",
      name: "Vendeur",
      field: "created_by",
      selectable: true,
      filterable: true,
      minWidth: 50,
      width: 90,
      grouping: {
        getter: 'created_by',
        formatter: (g) => `Vendeur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('so__dec01')
        ],
        aggregateCollapsed: true,
    
        collapsed: false,
       

      },
      params: { groupFormatterPrefix: '<i>Total</i>: ' }
    },
    {
      id: "so__chr01",
      name: "Nom",
      field: "so__chr01",
      exportWithFormatter: true,
      minWidth: 50,
      width: 120,
      selectable: true,
      filterable: true,
      grouping: {
        getter: 'so__chr01',
        formatter: (g) => `Vendeur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('so__dec01')
        ],
        aggregateCollapsed: false,
    
        collapsed: false,
      }
    },
    {
      id: "so_nbr",
      name: "Code CMD",
      field: "so_nbr",
      minWidth: 50,
      width: 90,
      selectable: true,
      filterable: true,
    },
    {
      id: "so_ord_date",
      name: "Date",
      field: "so_ord_date",
      sortable: true,
      minWidth: 50,
      width: 80,
      filterable: true,
      grouping: {
        getter: 'so_ord_date',
        formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('so__dec01')
        ],
        aggregateCollapsed: false,
    
        collapsed: false,
      }
    },
    
    {
      id: "so__dec01",
      name: "Montant",
      field: "so__dec01",
      sortable: true,
      minWidth: 50,
      width: 90,
      filterable: true,
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored,
      type: FieldType.number,
      grouping: {
        getter: 'Montant',
        formatter: (g) => `Montant: ${g.value} <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          new Aggregators.Sum('so__dec01')
        ],
        aggregateCollapsed: true,
        collapsed: true
      }

    },
    
    
    
  ];

  this.gridOptions = {
    asyncEditorLoading: true,
      
    editable: true,
    enableAutoResize: true,
    enableColumnPicker: true,
    enableCellNavigation: true,
    enableFiltering: true,
    enableSorting: true,
    enableExcelExport:true,
    enableExcelCopyBuffer:true,
    enableDraggableGrouping: true,
    createPreHeaderPanel: true,
    showPreHeaderPanel: true,
    preHeaderPanelHeight: 40,
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
      excelExportOptions: { sanitizeDataExport: true },

    enableRowSelection: true,
      formatterOptions: {
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
    
  
      dataItemColumnValueExtractor: function getItemColumnValue(user, column) {
        var val = undefined;
        try {
          val = eval("user." + column.field);
        } catch (e) {
          // ignore
        }
        return val;
      },
  



}

// fill the dataset with your data
this.dataset = []



//this.dataset = []
/*this.soService.getByAll({so_ord_date: date}).subscribe(
  
    (response: any) => (this.dataset = response.data),
    
    (error) => {
        this.dataset = []
    },
    () => {}
    
)
console.log(this.dataset)*/
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
  this.dataView.collapseAllGroups();
}

expandAllGroups() {
  this.dataView.expandAllGroups();
}
clearGrouping() {
  if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
    this.draggableGroupingPlugin.clearDroppedGroups();
  }
  this.grid.invalidate(); // invalidate all rows and re-render
}

onSubmit() {
  this.hasFormErrors = false;
  
}


reset() {
  this.createForm();
  this.dataset    = [];
 
  this.hasFormErrors = false;
}
goBack() {
  this.loadingSubject.next(false);
  const url = `/`;
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
}

solist(){
  const controls = this.soForm.controls
  console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
  this.dataset = []
  const date = controls.date.value
  ? `${controls.date.value.year}/${controls.date.value.month}/${controls.date.value.day}`
  : null;

  const date1 = controls.date1.value
  ? `${controls.date1.value.year}/${controls.date1.value.month}/${controls.date1.value.day}`
  : null;
  console.log(date)
  console.log(date1)
  let obj= {date,date1}
  this.soService.getByDateRange(obj).subscribe(
    (res: any) => {
  
    //(response: any) => (this.dataset = response.data),
    console.log(res.data)
    this.dataset  = res.data;
    this.dataView.setItems(this.dataset)
      
  //this.dataset = res.data
  this.loadingSubject.next(false) 
})

}


}
