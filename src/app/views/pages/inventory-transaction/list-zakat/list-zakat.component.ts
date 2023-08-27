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

import { InventoryTransactionService } from "../../../../core/erp";
const defaultPageSize = 100;
@Component({
  selector: 'kt-list-zakat',
  templateUrl: './list-zakat.component.html',
  styleUrls: ['./list-zakat.component.scss']
})
export class ListZakatComponent implements OnInit {

  loadingSubject = new BehaviorSubject<boolean>(true);
  soForm: FormGroup;
// slick grid
selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
hasFormErrors = false;
loading$: Observable<boolean>;
error = false;
  message = "";
 draggableGroupingPlugin: any;
 
  gridObj: any;
  
constructor(
  private activatedRoute: ActivatedRoute,
  private router: Router,
  public dialog: MatDialog,
  private soFB: FormBuilder,
  private layoutUtilsService: LayoutUtilsService,

  private inventoryTransactionService: InventoryTransactionService,
  private modalService: NgbModal,
    
  
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
    type: [1, Validators.required],
  
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
      id: "code",
      name: "Code Client",
      field: "code",
      width: 50,
      selectable: true,
      filterable: true,
    },
    {
      id: "desc",
      name: "Designation",
      field: "desc",
      exportWithFormatter: true,
      width: 50,
      selectable: true,
      filterable: true,
      filter: { model: Filters.compoundInputNumber }
    },
    
    
    {
      id: "qty",
      name: "Quantité",
      field: "qty",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.float,

    },
    {
      id: "price",
      name: "Prix UN",
      field: "price",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.float,

    },
    {
      id: "amt",
      name: "Montant",
      field: "amt",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.float,

    },
    
    
    
  ];
  this.gridOptions = {
    asyncEditorLoading: true,
      
    editable: true,
    enableColumnPicker: true,
    enableCellNavigation: true,
    enableFiltering: true,
    enableSorting: true,
    enableExcelExport:true,
    enableExcelCopyBuffer:true,
    exportOptions: {
      sanitizeDataExport: true
    },
    enableRowSelection: true,
      formatterOptions: {
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
    
      // enableFilterTrimWhiteSpace: true,
 
      // use columnDef searchTerms OR use presets as shown below
     
  
 


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
  /*
  this.gridOptions = {
  enableDraggableGrouping: true,
  createPreHeaderPanel: true,
  showPreHeaderPanel: true,
  preHeaderPanelHeight: 40,
  enableFiltering: true,
  enableSorting: true,
  exportOptions: {
    sanitizeDataExport: true
  },

  enableExcelExport: true,
      enableExcelCopyBuffer: true,
      // enableFilterTrimWhiteSpace: true,
      showCustomFooter: true, // display some metrics in the bottom custom footer

      // use columnDef searchTerms OR use presets as shown below
      presets: {
        sorters: [
          { columnId: 'nbr', direction: 'DESC' },
        ],
      },
     
};
this.dataset = []

}
*/

onSubmit() {
  this.hasFormErrors = false;
  //let po = this.preparePo();
  
//  this.addPo( result,this.dataset);
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
  const type = controls.type.value
  let obj= {type,date,date1}
  this.inventoryTransactionService.zakat(obj).subscribe(
    (res: any) => {
  
    //(response: any) => (this.dataset = response.data),
    console.log(res.data)
    this.dataset  = res.data;
    //this.setSortingDynamically()
    this.dataView.setItems(this.dataset)
   
  //this.dataset = res.data
  this.loadingSubject.next(false) 
})

}

}
