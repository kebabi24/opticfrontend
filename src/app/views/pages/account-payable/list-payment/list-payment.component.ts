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

import { AccountPayableService} from "../../../../core/erp"


const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';

@Component({
  selector: 'kt-list-payment',
  templateUrl: './list-payment.component.html',
  styleUrls: ['./list-payment.component.scss']
})
export class ListPaymentComponent implements OnInit {

  
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  
  angularGrid: AngularGridInstance;

  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  gridObj: any;
  dataviewObj: any;

  
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private accountPayableService: AccountPayableService,
      
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
  }

  
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid; // grid object
    this.dataviewObj = angularGrid.dataView;
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
            id: "ap_nbr",
            name: "N° Paiement",
            field: "ap_nbr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ap_vend",
            name: "Fournisseur",
            field: "ap_vend",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ad_name",
            name: "Nom",
            field: "address.ad_name",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ap_curr",
            name: "Devise",
            field: "ap_curr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
          {
            id: "ap_bank",
            name: "Banque",
            field: "ap_bank",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
         
          {
            id: "ap_check",
            name: "N° Cheque",
            field: "ap_check",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
         
          {
            id: "ap_cr_terms",
            name: "Mode Paiement",
            field: "ap_cr_terms",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ap_ex_rate",
            name: "Taux Change",
            field: "ap_ex_rate",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },
          {
            id: "ap_ex_rate2",
            name: "Taux Change",
            field: "ap_ex_rate2",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },
          {
            id: "ap_amt",
            name: "Montant",
            field: "ap_amt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },
          {
            id: "ap_applied",
            name: "Montant Applique",
            field: "ap_applied",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },
          {
            id: "ap_base_amt",
            name: "Montant Devise",
            field: "ap_base_amt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },
          {
            id: "ap_base_applied",
            name: "Montant Applique Devise",
            field: "ap_base_applied",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },
          {
            id: "ap_open",
            name: "Ouvert",
            field: "ap_open",
            sortable: true,
            filterable: true,
            formatter: myCustomCheckboxFormatter,
          },

          

      ]

      this.gridOptions = {
          autoResize: {
            containerId: 'demo-container',
            sidePadding: 10
          },
         
          createPreHeaderPanel: true,
          showPreHeaderPanel: true,
          preHeaderPanelHeight: 40,
          enableFiltering: true,
          enableSorting: true,
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
      this.accountPayableService.getByWithAdress({ap_type : "P"}).subscribe(
          (response: any) => (this.dataset = response.data),
          (error) => {
              this.dataset = []
          },
          () => {}
      )
console.log(this.dataset)
    }
  
}
