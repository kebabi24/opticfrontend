import { Component, OnInit } from "@angular/core"
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
  OperatorType,
  GridService,
  OperatorString,
  SearchTerm,
} from "angular-slickgrid"

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
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import {ItemService, InventoryTransactionService, LocationDetailService} from "../../../../core/erp"


const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';


@Component({
  selector: 'kt-create-mn-inv',
  templateUrl: './create-mn-inv.component.html',
  styleUrls: ['./create-mn-inv.component.scss']
})
export class CreateMnInvComponent implements OnInit {

  hasFormErrors = false;
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;
  row_number;
  grid: any;
  gridService: GridService;
  dataview: any;


   gridObj: any;
  dataviewObj: any;
  message = "";
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;

  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private itemsService: ItemService,
      private locationDetailService: LocationDetailService,
      private inventoryTransactionService: InventoryTransactionService,
      private modalService: NgbModal,
   
      
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
  }

  
  
 
    angularGridReady(angularGrid: AngularGridInstance) {
      this.angularGrid = angularGrid;
      this.grid = angularGrid.slickGrid; // grid object
      this.dataview = angularGrid.dataView;
      this.gridService = angularGrid.gridService;
    }

  
  prepareGrid() {

      this.columnDefinitions = [
          
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
            id: "add",
            field: "add",
           
            minWidth: 50,
            maxWidth: 50,
            type: FieldType.boolean,
            formatter: Formatters.checkmark
          },
          {
            id: "ld_site",
            name: "Site",
            field: "ld_site",
            sortable: true,
            filterable: true,
            type: FieldType.string,
           
          }, 
          {
            id: "ld_loc",
            name: "Emplacement",
            field: "ld_loc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
           
          }, 
          {
            id: "ld_part",
            name: "Article",
            field: "ld_part",
            sortable: true,
            filterable: true,
            type: FieldType.string,
           
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
              console.log("here",args.dataContext.add)
              if(args.dataContext.add) {
              let element: HTMLElement = document.getElementById(
                "openItemsGrid"
              ) as HTMLElement;
              element.click();
              }
            },
          },
          {
            id: "ld__chr05",
            name: "Description",
            field: "ld__chr05",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
          {
            id: "ld_lot",
            name: "Lot",
            field: "ld_lot",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            editor:  {
              model: Editors.text,
            },
           
           
          },
          {
            id: "ld_ref",
            name: "N° Série",
            field: "ld_ref",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            editor:  {
              model: Editors.text,
            },
           
          },  
          {
            id: "ld_qty_oh",
            name: "Quantite",
            field: "ld_qty_oh",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            // filter: { model: Filters.input,operator: OperatorType.rangeInclusive}
            
            
          },
          {
            id: "qty_inv",
            name: "Qte INV",
            field: "qty_inv",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            // filter: { model: Filters.input,operator: OperatorType.rangeInclusive}
            editor: {
              model: Editors.float,
              params: { decimalPlaces: 2 }
            },
            formatter: Formatters.decimal,
            
          },  
        

      ]

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
          thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
        },
          autoHeight:true,
          enableAutoResize:true,
          
        
          
    
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
      this.locationDetailService.getAll().subscribe(
        
          (response: any) => {this.dataset = response.data,
            console.log(this.dataset)
            this.dataview.setItems(this.dataset)},
          (error) => {
              this.dataset = []
          },
          () => {}
          
      )
      console.log(this.dataset)
  }
  
  addNewItem() {
    this.gridService.addItem(
      {
        id: this.dataset.length + 1,
        ld_part: null,
        ld_lot: null,
        ld_ref:null,
        add: true,
        
      },
      { position: "bottom" }
    );
  }

  onSubmit() {
   

    if (!this.dataset.length) {
      this.message = "La liste des article ne peut pas etre vide ";
      this.hasFormErrors = true;

      return;
    }

    
    
      
    // tslint:disable-next-line:prefer-const
    
    this.addIt(this.dataset);
    
  

  }
  addIt( detail: any) {
    for (let data in detail) {
      delete this.dataset[data].id;
      delete this.dataset[data].cmvid;
    }
    this.loadingSubject.next(true);
    let inv
    this.inventoryTransactionService
      .Inventory({detail})
      .subscribe(
       (reponse: any) => (inv = reponse.data),
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
      
          this.router.navigateByUrl("/");
        }
      );
  }

  handleSelectedRowsChanged4(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        console.log(item);

       
        updateItem.ld_part = item.pt_part;
        updateItem.ld_site = item.pt_site;
        updateItem.ld_loc = item.pt_loc
        updateItem.ld__chr05 = item.pt_desc1
       // updateItem.desc = item.pt_desc1;
      //  const desc = item.pt_desc1
      //   updateItem.desc = desc
          this.gridService.updateItem(updateItem);
       
      });
    }
  }
 
  angularGridReady4(angularGrid: AngularGridInstance) {
    this.angularGrid4 = angularGrid;
    this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid4() {
    this.columnDefinitions4 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "pt_part",
        name: "code ",
        field: "pt_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pt_desc1",
        name: "desc",
        field: "pt_desc1",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pt_um",
        name: "UM",
        field: "pt_um",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

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
      editable:true,
      
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
    this.itemsService
      .getAll()
      .subscribe((response: any) => (this.items = response.data));
  }
  open4(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }
  
} 