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
    GridService,
    AngularGridInstance,
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

import { PenicheService } from "../../../../core/erp"
@Component({
  selector: 'kt-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  
    columnDefinitions: Column[] = []
    gridOptions: GridOption = {}
    dataset: any[] = []
   
    angularGrid: AngularGridInstance;
     grid: any;
     gridService: GridService;
     dataView: any;
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private penicheService: PenicheService
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  
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
              this.router.navigateByUrl(`/peniche/edit/${id}`)
          },
      },
          {
              id: "id",
              name: "id",
              field: "id",
              sortable: true,
              minWidth: 80,
              maxWidth: 80,
          },
         
          {
              id: "pen_pen",
              name: "Code Peniche",
              field: "pen_pen",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
            id: "pen_desc",
            name: "Designation",
            field: "pen_desc",
            sortable: true,
            width: 200,
            filterable: true,
            type: FieldType.string,
         },
         {
            id: "pen_user1",
            name: "Code Client",
            field: "pen_user1",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
         {
            id: "pen_phys_addr",
            name: "Nom Client",
            field: "pen_phys_addr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "pen_used",
            name: "Utilise",
            field: "pen_used",
            sortable: true,
            filterable: true,
            type: FieldType.boolean,
            formatter: Formatters.checkmark
          },
          
          
      ]

      this.gridOptions = {
          enableSorting: true,
          enableCellNavigation: true,
          enableExcelCopyBuffer: true,
          enableFiltering: true,
          autoEdit: false,
          autoHeight: false,
          frozenColumn: 0,
          frozenBottom: true,
      }

      // fill the dataset with your data
      this.dataset = []
      this.penicheService.getAll().subscribe(
          (response: any) => {this.dataset = response.data
             this.dataView.setItems(this.dataset)
           },
          (error) => {
              this.dataset = []
          },
          () => {}
      )
        }
    }
