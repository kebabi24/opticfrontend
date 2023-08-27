import { Component, OnInit } from "@angular/core"
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

import { ProjectService } from "../../../../core/erp"
@Component({
  selector: 'kt-list-project',
  templateUrl: './list-project.component.html',
  styleUrls: ['./list-project.component.scss']
})
export class ListProjectComponent implements OnInit {

 
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
      this.prepareGrid2()
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
              id: "pmd_task",
              name: "Code Instruction",
              field: "pmd_task",
              sortable: true,
              width: 80,
              filterable: true,
              type: FieldType.string,
          },
          {
            id: "tk_desc",
            name: "Designation",
            field: "tk_desc",
            sortable: true,
            width: 120,
            filterable: true,
            type: FieldType.string,
        },
          {
            id: "pmd_um",
            name: "UM",
            field: "pmd_um",
            sortable: true,
            width: 30,
            filterable: false,
            type: FieldType.string,
           
          },
          {
            id: "pmd_qty",
            name: "QTE",
            field: "pmd_qty",
            sortable: true,
            width: 30,
            filterable: false,
            type: FieldType.float,
           
          },
          {
            id: "up",
            name: "Prix Unitaire",
            field: "up",
            sortable: true,
            width: 80,
            filterable: false,
            type: FieldType.float,
           
          },
          {
            id: "pmd_price",
            name: "Prix",
            field: "pmd_price",
            sortable: true,
            width: 80,
            filterable: false,
            type: FieldType.float,
           
          },
          {
            id: "pmd_cost",
            name: "Cout",
            field: "pmd_cost",
            sortable: true,
            width: 80,
            filterable: false,
            type: FieldType.float,
           
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
      this.projectService.getAllwithDetail().subscribe(
        
          (response: any) => {
          //  console.log(response.data),
            (this.dataset = response.data),
         
          (error) => {
              this.dataset = []
          },
          () => {}
         } )
        
  }



  prepareGrid2() {
    this.columnDefinitions2 = [
        
        {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 30,
          maxWidth: 30,
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
            id: "ps_comp",
            name: "Prestation",
            field: "ps_comp",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "pt_um",
          name: "UM",
          field: "pt_um",
          sortable: true,
          width: 30,
          filterable: false,
          type: FieldType.string,
         
        },
        {
          id: "ps_qty_per",
          name: "QTE",
          field: "ps_qty_per",
          sortable: true,
          width: 30,
          filterable: false,
          type: FieldType.float,
         
        },
        {
          id: "pt_price",
          name: "Prix Unitaire",
          field: "pt_price",
          sortable: true,
          width: 80,
          filterable: false,
          type: FieldType.float,
         
        },
        {
          id: "tht",
          name: "Total HT",
          field: "tht",
          sortable: true,
          width: 80,
          filterable: false,
          type: FieldType.float,
         
        },
        {
          id: "tcost",
          name: "Cout",
          field: "tcost",
          sortable: true,
          width: 80,
          filterable: false,
          type: FieldType.float,
         
        },
        
    ]

    this.gridOptions2 = {
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
    this.dataset2 = []
    this.projectService.getAllbomDetail().subscribe(
      
        (response: any) => {
        //  console.log(response.data),
          (this.dataset2 = response.data),
       
        (error) => {
            this.dataset2 = []
        },
        () => {}
       } )
      
}
}
