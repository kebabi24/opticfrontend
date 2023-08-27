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

import { Location, LocationService } from "../../../../core/erp"

@Component({
  selector: 'kt-list-loc',
  templateUrl: './list-loc.component.html',
  styleUrls: ['./list-loc.component.scss']
})
export class ListLocComponent implements OnInit {
  // slick grid
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private locationService: LocationService
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
  }

  createCode() {
      this.router.navigateByUrl("inventory-setting/create-loc")
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
                  this.router.navigateByUrl(`/inventory-settings/edit-loc/${id}`)
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
              id: "loc_loc",
              name: "Emplacement",
              field: "loc_loc",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
              id: "loc_site",
              name: "Site",
              field: "loc_site",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
              id: "loc_desc",
              name: "Designation",
              field: "loc_desc",
              sortable: true,
              width: 200,
              filterable: true,
              type: FieldType.string,
          },
          {
            id: "loc_status",
            name: "Status",
            field: "loc_status",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          
          {
            id: "loc_project",
            name: "Projet",
            field: "loc_project",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          
          {
            id: "loc_type",
            name: "Type",
            field: "loc_type",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "loc_perm",
            name: "Permanent",
            field: "loc_perm",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "loc_single",
            name: "Article Unique",
            field: "loc_single",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "loc__qad01",
            name: "Lot/Référence Unique",
            field: "loc__qad01",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "loc_cap",
            name: "Capacite",
            field: "loc_cap",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },
          {
            id: "loc_cap_um",
            name: "UM",
            field: "loc_cap_um",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "loc_xfer_ownership",
            name: "Transfert de Propriété",
            field: "loc_xfer_ownership",
            sortable: true,
            filterable: true,
            type: FieldType.string,
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
      this.locationService.getAll().subscribe(
          (response: any) => (this.dataset = response.data),
          (error) => {
              this.dataset = []
          },
          () => {}
      )
  }
}
