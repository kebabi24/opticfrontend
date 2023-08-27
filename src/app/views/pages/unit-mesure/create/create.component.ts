import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"

// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  GridService,
  Formatters,
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


import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap"
import { Mesure, MesureService, ItemService, CodeService} from "../../../../core/erp"

@Component({
  selector: 'kt-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

export class CreateComponent implements OnInit {
  mesure: Mesure
  mesureForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  angularGrid: AngularGridInstance
    grid: any
    gridService: GridService
    dataView: any
    columnDefinitions: Column[]
    gridOptions: GridOption
    dataset: any[]

  items: []
    columnDefinitions4: Column[] = []
    gridOptions4: GridOption = {}
    gridObj4: any
    angularGrid4: AngularGridInstance

    row_number

    data: []
    columnDefinitions3: Column[] = []
    gridOptions3: GridOption = {}
    gridObj3: any
    angularGrid3: AngularGridInstance
    selectedField = ""

  constructor(
      config: NgbDropdownConfig,
      private mesureFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private modalService: NgbModal,
      private layoutUtilsService: LayoutUtilsService,
      private mesureService: MesureService,
      private itemsService: ItemService,
      private codeService: CodeService
  ) {
      config.autoClose = true
  }
  ngOnInit(): void {
      this.loading$ = this.loadingSubject.asObservable()
      this.loadingSubject.next(false)
      this.createForm()
  }

  //create form
  createForm() {
      this.loadingSubject.next(false)

      this.mesure = new Mesure()
      this.mesureForm = this.mesureFB.group({
          um_um: [this.mesure.um_um, Validators.required],
          um_alt_um: [this.mesure.um_alt_um, Validators.required],
          um_part: [this.mesure.um_part],
          um_conv: [{ value: this.mesure.um_conv, disabled: !this.isExist }],
      })
  }
  onChangeCode() {
      const controls = this.mesureForm.controls
      this.mesureService
          .getBy({
              um_um: controls.um_um.value,
              um_alt_um: controls.um_alt_um.value,
              um_part: controls.um_part.value,
          })
          .subscribe((response: any) => {
              console.log(response)
              if (response.data) {
                  this.isExist = true
                  console.log(response.data.length)
              } else {
                  controls.um_conv.enable()
                  
              }
          })
  }
  //reste form
  reset() {
      this.mesure = new Mesure()
      this.createForm()
      this.hasFormErrors = false
  }
  // save data
  onSubmit() {
      this.hasFormErrors = false
      const controls = this.mesureForm.controls
      /** check form */
      if (this.mesureForm.invalid) {
          Object.keys(controls).forEach((controlName) =>
              controls[controlName].markAsTouched()
          )

          this.hasFormErrors = true
          return
      }

      // tslint:disable-next-line:prefer-const
      let address = this.prepareCode()
      this.addCode(address)
  }
  /**
   * Returns object for saving
   */
  prepareCode(): Mesure {
      const controls = this.mesureForm.controls
      const _mesure = new Mesure()
      _mesure.um_um = controls.um_um.value
      _mesure.um_alt_um = controls.um_alt_um.value
     
      _mesure.um_part = controls.um_part.value
      _mesure.um_conv = controls.um_conv.value
     

      return _mesure
  }
  /**
   * Add code
   *
   * @param _mesure: CodeModel
   */
  addCode(_mesure: Mesure) {
      this.loadingSubject.next(true)
      this.mesureService.add(_mesure).subscribe(
          (reponse) => console.log("response", Response),
          (error) => {
              this.layoutUtilsService.showActionNotification(
                  "Erreur verifier les informations",
                  MessageType.Create,
                  10000,
                  true,
                  true
              )
              this.loadingSubject.next(false)
          },
          () => {
              this.layoutUtilsService.showActionNotification(
                  "Ajout avec succès",
                  MessageType.Create,
                  10000,
                  true,
                  true
              )
              this.loadingSubject.next(false)
              this.router.navigateByUrl("/unit-mesure/units-list")
          }
      )
  }

  /**
   * Go back to the list
   *
   */
  goBack() {
      this.loadingSubject.next(false)
      const url = `/code-mstr/codes-list`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }









  handleSelectedRowsChanged4(e, args) {
    const controls = this.mesureForm.controls
    if (Array.isArray(args.rows) && this.gridObj4) {
        args.rows.map((idx) => {
            const item = this.gridObj4.getDataItem(idx)
            controls.um_part.setValue(item.pt_part || "")
        })
    }
}

  angularGridReady4(angularGrid: AngularGridInstance) {
    this.angularGrid4 = angularGrid
    this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {}
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
            name: "desc",
            field: "pt_um",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
    ]

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
    }

    // fill the dataset with your data
    this.itemsService
        .getAll()
        .subscribe((response: any) => (this.items = response.data))
}
open4(content) {
    this.prepareGrid4()
    this.modalService.open(content, { size: "lg" })
}


handleSelectedRowsChanged3(e, args) {
    const controls1 = this.mesureForm.controls
  

    if (Array.isArray(args.rows) && this.gridObj3) {
        args.rows.map((idx) => {
            const item = this.gridObj3.getDataItem(idx)
            // TODO : HERE itterate on selected field and change the value of the selected field
            switch (this.selectedField) {
                case "um_um": {
                    controls1.um_um.setValue(item.code_value || "")
                    break
                }    
                case "um_alt_um": {
                    controls1.um_alt_um.setValue(item.code_value || "")
                    break    
                }
                
                default:
                    break
            }
        })
    }
}
angularGridReady3(angularGrid: AngularGridInstance) {
    this.angularGrid3 = angularGrid
    this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid3() {
    this.columnDefinitions3 = [
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
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
        {
            id: "code_fldname",
            name: "Champs",
            field: "code_fldname",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "code_value",
            name: "Code",
            field: "code_value",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "code_cmmt",
            name: "Description",
            field: "code_cmmt",
            sortable: true,
            width: 200,
            filterable: true,
            type: FieldType.string,
        },
    ]

    this.gridOptions3 = {
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
        checkboxSelector: {
        },
        multiSelect: false,
        rowSelectionOptions: {
            selectActiveRow: true,
        },
    }

    // fill the dataset with your data
    this.codeService
        .getBy({ code_fldname: "pt_um" })
        .subscribe((response: any) => (this.data = response.data))
}
open3(content, field) {
    this.selectedField = field
    this.prepareGrid3()
    this.modalService.open(content, { size: "lg" })
}




}
