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


import { ProjectService } from "../../../../core/erp";
@Component({
  selector: 'kt-list-pm',
  templateUrl: './list-pm.component.html',
  styleUrls: ['./list-pm.component.scss']
})
export class ListPmComponent implements OnInit {

 
  // slick grid
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []

  columnDefinitions2: Column[] = []
  gridOptions2: GridOption = {}
  dataset2: any[] = []
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private projectService: ProjectService
  ) {
      this.prepareGrid()
    
  }

  ngOnInit(): void {
  }

 
  prepareGrid() {
      this.columnDefinitions = [
          
        
          {
              id: "id",
              name: "id",
              field: "id",
              sortable: true,
              minWidth: 30,
              maxWidth: 30,
          },
          {
            id: "pm_cust",
            name: "Code Client",
            field: "pm_cust",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ad_name",
            name: "Client",
            field: "ad_name",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
          {
              id: "pm_code",
              name: "Code Projet",
              field: "pm_code",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
            id: "pm_desc",
            name: "Designation",
            field: "pm_desc",
            sortable: true,
            width: 120,
            filterable: true,
            type: FieldType.string,
        },
          {
            id: "pm_amt",
            name: "Selling Price",
            field: "pm_amt",
            sortable: true,
            width: 80,
            filterable: false,
            type: FieldType.float,
           
          },
          {
            id: "pm_cost",
            name: "Budget",
            field: "pm_cost",
            sortable: true,
            width: 80,
            filterable: false,
            type: FieldType.float,
           
          },
          {
            id: "gm",
            name: "GM %",
            field: "gm",
            sortable: true,
            width: 80,
            filterable: false,
            type: FieldType.float,
            formatter: Formatters.percent,
            params: { minDecimal: 1, maxDecimal: 2 },
           
          },


          
          
      ]

      this.gridOptions = {
          enableSorting: true,
          enableCellNavigation: true,
          enableExcelCopyBuffer: true,
          enableFiltering: false,
          autoEdit: false,
          autoHeight: false,
          frozenColumn: 0,
          frozenBottom: true,
      }    
      // fill the dataset with your data
      this.dataset = []
      this.projectService.getAllPmdetail().subscribe(
        
          (response: any) => {
          //  console.log(response.data),
            (this.dataset = response.data),
         
          (error) => {
              this.dataset = []
          },
          () => {}
         } )
        
  }
}