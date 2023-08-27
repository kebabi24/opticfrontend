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
  GridService,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
} from "angular-slickgrid"


import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
// Layout
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

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

import { Customer, CustomerService,Address , AddressService, VisiteService,SaleOrderService} from "../../../../core/erp"


const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';

@Component({
  selector: 'kt-cust-hist',
  templateUrl: './cust-hist.component.html',
  styleUrls: ['./cust-hist.component.scss']
})
export class CustHistComponent implements OnInit {

  
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  angularGridvis: AngularGridInstance;
  gridvis: any;
  gridServicevis: GridService;
  dataViewvis: any;
  columnDefinitionsvis: Column[];
  gridOptionsvis: GridOption;
  visdataset: any[];


  angularGridsod: AngularGridInstance;
  gridsod: any;
  gridServicesod: GridService;
  dataViewsod: any;
  columnDefinitionssod: Column[];
  gridOptionssod: GridOption;
  soddataset: any[];

  //selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  gridObj: any;
  gridObjvis: any;
  //gridObjso: any;
  //dataviewObj: any;
  //dataviewObjvis: any;
  
  user;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  soForm: FormGroup;
  constructor(
    config: NgbDropdownConfig,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private soFB: FormBuilder,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private addressService: AddressService,
      private customerService: CustomerService,
      private saleOrderService: SaleOrderService,
      private visiteService: VisiteService,
  ) {
    config.autoClose = true;
      this.prepareGrid()
      this.prepareGridvis()
      this.prepareGridso()
      this.createForm()
     // this.getdata()
     // this.dataView.setItems(this.dataset)
  }

  ngOnInit(): void {
    this.user =  JSON.parse(localStorage.getItem('user'))
  //  this.createForm();
  }

  
  
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
    this.gridObj = (angularGrid && angularGrid.slickGrid) || {};
  }

  angularGridReadyvis(angularGrid: AngularGridInstance) {
    this.angularGridvis = angularGrid;
    this.dataViewvis = angularGrid.dataView;
    this.gridvis = angularGrid.slickGrid;
    this.gridServicevis = angularGrid.gridService;
    this.gridObjvis = (angularGrid && angularGrid.slickGrid) || {};
  }
  angularGridReadysod(angularGrid: AngularGridInstance) {
    this.angularGridsod = angularGrid;
    this.dataViewsod = angularGrid.dataView;
    this.gridsod = angularGrid.slickGrid;
    this.gridServicesod = angularGrid.gridService;
    //this.gridObjso = (angularGrid && angularGrid.slickGrid) || {};
  }
  // angularGridReadyso(angularGrid: AngularGridInstance) {
  //   this.angularGridso = angularGrid;
  //   this.dataViewso = angularGrid.dataView;
  //   this.gridso = angularGrid.slickGrid;
  //   this.gridServiceso = angularGrid.gridService;
  //  this.gridObjso = (angularGrid && angularGrid.slickGrid) || {};
  // }
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
          // {
          //   id: "cm_addr",
          //   name: "code",
          //   field: "cm_addr",
          //   sortable: true,
          //   filterable: true,
          //   type: FieldType.string,
          // },
          {
            id: "ad_name",
            name: "Client",
            field: "address.ad_name",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            minWidth: 50,
            maxWidth: 160,
        
          },

          {
            id: "ad_name_control",
            name: "Prénom",
            field: "address.ad_name_control",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            minWidth: 50,
            maxWidth: 160,
        
          },
          {
            id: "ad_line1",
            name: "Adresse",
            field: "address.ad_line1",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            minWidth: 50,
            maxWidth: 170,
        
          },
          {
            id: "cm_mod_date",
            name: "Date Naissance",
            field: "cm_mod_date",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            minWidth: 50,
            maxWidth: 90,
        
          },

         
          
          {
            id: "cm_balance",
            name: "Solde",
            field: "cm_balance",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            minWidth: 50,
            maxWidth: 100,
        
          },
          
          

      ]

      this.gridOptions = {
        enableSorting: true,
        enableCellNavigation: true,
        enableExcelCopyBuffer: true,
        enableFiltering: true,
        autoEdit: false,
        
        autoHeight: false,
       // frozenColumn: 0,
     //   frozenBottom: true,
        enableRowSelection: true,
        //enableCheckboxSelector: true,
        //checkboxSelector: {
          // optionally change the column index position of the icon (defaults to 0)
          // columnIndexPosition: 1,
  
          // remove the unnecessary "Select All" checkbox in header when in single selection mode
      //    hideSelectAllCheckbox: true,
  
          // you can override the logic for showing (or not) the expand icon
          // for example, display the expand icon only on every 2nd row
          // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
      //  },
        multiSelect: false,
        rowSelectionOptions: {
          // True (Single Selection), False (Multiple Selections)
          selectActiveRow: true,
        },
      
          createPreHeaderPanel: false,
          showPreHeaderPanel: false,
          //preHeaderPanelHeight: 40,
          enableAutoResize: false,
          exportOptions: {
            sanitizeDataExport: true
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
      this.customerService.getAll().subscribe(
          (response: any) => 
            {   
             this.dataset = response.data
             console.log(this.dataset)
             this.dataView.setItems(this.dataset)
              
               },
          (error) => {
              this.dataset = []
          },
          () => {}
      )
  }
  
  getdata(){
    this.customerService.getAll().subscribe(
      (response: any) => 
        {   
         this.dataset = response.data
         console.log(this.dataset)
         //this.dataView.setItems(this.dataset)
          
           },
      (error) => {
          this.dataset = []
      },
      () => {}
  )

  }

  handleSelectedRowsChanged(e, args) {
    if (Array.isArray(args.rows) && this.gridObj) {
      args.rows.map((idx) => {
        const item = this.gridObj.getDataItem(idx);
        console.log( "manich mlih rani nhawes",item);
        this.visiteService.getBy({vis_cust: item.cm_addr}).subscribe(
          (response: any) => 
            {   
             this.visdataset = response.data
             console.log(this.visdataset)
             this.dataViewvis.setItems(this.visdataset)
              
               },
          // (error) => {
          //     this.visdataset = []
          // },
          // () => {}
      )
  
      });
    }
  }
  
  prepareGridvis() {

    this.columnDefinitionsvis = [
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
          id: "vis_nbr",
          name: "N° Visite",
          field: "vis_nbr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          minWidth: 90,
          maxWidth: 90,
        },
        {
          id: "vis_ord_date",
          name: "Date",
          field: "vis_ord_date",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          minWidth: 90,
          maxWidth: 90,
        },
        {
          id: "vis_so_nbr",
          name: "N° CMD",
          field: "vis_so_nbr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          minWidth: 90,
          maxWidth: 90,
        },
        {
          id: "created_by",
          name: "Vendeur",
          field: "created_by",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          minWidth: 90,
          maxWidth: 90,
        },

    ]

    this.gridOptionsvis = {
       
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      //enableFiltering: true,
      autoEdit: false,
      autoHeight: false,
     // frozenColumn: 0,
    //  frozenBottom: true,
      enableRowSelection: true,
     // enableCheckboxSelector: true,
     // checkboxSelector: {
        // optionally change the column index position of the icon (defaults to 0)
        // columnIndexPosition: 1,

        // remove the unnecessary "Select All" checkbox in header when in single selection mode
     //   hideSelectAllCheckbox: true,

        // you can override the logic for showing (or not) the expand icon
        // for example, display the expand icon only on every 2nd row
        // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
     // },
      multiSelect: false,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true,
      },
    
        // createPreHeaderPanel: true,
        // showPreHeaderPanel: true,
        // preHeaderPanelHeight: 40,
        // enableAutoResize: false,
        // exportOptions: {
        //   sanitizeDataExport: true
        // },

    }

    // fill the dataset with your data
    this.visdataset = []
    // this.visiteService.getAll().subscribe(
    //     (response: any) => 
    //       {   
    //        this.visdataset = response.data
    //        console.log(this.visdataset)
    //        //this.dataViewvis.setItems(this.visdataset)
            
    //          },
    //     (error) => {
    //         this.visdataset = []
    //     },
    //     () => {}
    // )
}
handleSelectedRowsChangedvis(e, args) {
  const controls = this.soForm.controls 
  if (Array.isArray(args.rows) && this.gridObjvis) {
    args.rows.map((idx) => {
      const item = this.gridObjvis.getDataItem(idx);
      console.log( "visite",item);
      
     

      this.saleOrderService.getDet({so_nbr:item.vis_so_nbr}).subscribe(
        (response: any) => 
        {   
         this.soddataset = response.data
         console.log(this.soddataset)
//          for (let data of this.sodataset){
//            console.log(data)
//            const newItem = {
//             id: data.id,
//             nbr: data.nbr,
//             type: data.type,
//             oeil: data.oeil,
//             desc: data.desc,
//             price: data.price,  
          
//            }
//  console.log(newItem)
//            this.gridServiceso.addItem(
//           newItem,
//             { position: "bottom" }
//           );
//          }
console.log(this.soddataset)
       // this.dataViewvis.setItems(this.visdataset)
        this.dataViewsod.setItems(this.soddataset)
        //this.gridServiceso.init(this.gridServiceso,this.dataViewso)
          
           },
      // (error) => {
      //     this.sodataset = []
      // },
      // () => {}
  )

  controls.vis_rsph.setValue(item.vis_rsph)
  controls.vis_rcyl.setValue(item.vis_rcyl)
  controls.vis_raxe.setValue(item.vis_raxe)
  controls.vis_radd.setValue(item.vis_radd)
  controls.vis_rprisme.setValue(item.vis_rprisme)
  controls.vis_rbase.setValue(item.vis_rbase)
  controls.vis_recart.setValue(item.vis_recart)
  controls.vis_rhauteur.setValue(item.vis_rhauteur)

  controls.vis_lsph.setValue(item.vis_lsph)
  controls.vis_lcyl.setValue(item.vis_lcyl)
  controls.vis_laxe.setValue(item.vis_laxe)
  controls.vis_ladd.setValue(item.vis_ladd)
  controls.vis_lprisme.setValue(item.vis_lprisme)
  controls.vis_lbase.setValue(item.vis_lbase)
  controls.vis_lecart.setValue(item.vis_lecart)
  controls.vis_lhauteur.setValue(item.vis_lhauteur)
    });
    
  }
}
createForm() {
  this.loadingSubject.next(false);
  
  this.soForm = this.soFB.group({ 
    vis_rsph: [[""]],
    vis_rcyl: [""],
    vis_radd: [""],
    vis_rprisme: [""],
    vis_rbase: [""],
    vis_recart: [""],
    vis_rhauteur: [""],

    vis_raxe: [""],
    vis_lsph: [""],
    vis_lcyl: [""],
    vis_ladd: [""],
    vis_lprisme: [""],
    vis_lbase: [""],
    vis_lecart: [""],
    vis_lhauteur: [""],
    vis_laxe: [""],
   // so_ex_rate: [this.saleOrder.so_ex_rate],
   // so_ex_rate2: [this.saleOrder.so_ex_rate2],
   
  });

 
  

}
prepareGridso() {

  this.columnDefinitionssod = [
      {
        id: "id",
        field: "id",
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,

        minWidth: 40,
        maxWidth: 40,
      },
      // {
      //   id: "nbr",
      //   name: "N° CMD",
      //   field: "nbr",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.string,
      // },
      
      {
        id: "type",
        name: "Type",
        field: "type",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 90,
        maxWidth: 90,
      },
      {
        id: "oeil",
        name: "Oeil",
        field: "oeil",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 50,
        maxWidth: 50,
      },
      {
        id: "desc",
        name: "Description",
        field: "desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 50,
        maxWidth: 190,
      },
      {
        id: "price",
        name: "Prix",
        field: "price",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 90,
        maxWidth: 90,
      },
     

  ]

  this.gridOptionssod = {
     
    enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      //enableFiltering: true,
      autoEdit: false,
      autoHeight: false,
     // frozenColumn: 0,
    //  frozenBottom: true,
      enableRowSelection: true,
     // enableCheckboxSelector: true,
     // checkboxSelector: {
        // optionally change the column index position of the icon (defaults to 0)
        // columnIndexPosition: 1,

        // remove the unnecessary "Select All" checkbox in header when in single selection mode
     //   hideSelectAllCheckbox: true,

        // you can override the logic for showing (or not) the expand icon
        // for example, display the expand icon only on every 2nd row
        // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
     // },
      multiSelect: false,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true,
      },
    
  
    //  createPreHeaderPanel: true,
     // showPreHeaderPanel: true,
     // preHeaderPanelHeight: 40,
      enableAutoResize: false,
      exportOptions: {
        sanitizeDataExport: true
      },
      
  
      // createPreHeaderPanel: true,
      // showPreHeaderPanel: true,
      // preHeaderPanelHeight: 40,
      // enableAutoResize: false,
      // exportOptions: {
      //   sanitizeDataExport: true
      // },

  }

  // fill the dataset with your data
  this.soddataset = []
  // this.visiteService.getAll().subscribe(
  //     (response: any) => 
  //       {   
  //        this.visdataset = response.data
  //        console.log(this.visdataset)
  //        //this.dataViewvis.setItems(this.visdataset)
          
  //          },
  //     (error) => {
  //         this.visdataset = []
  //     },
  //     () => {}
  // )
}
}
