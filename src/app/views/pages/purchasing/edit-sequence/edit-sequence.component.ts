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
  FieldType,
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

import { Sequence, SequenceService, UsersService} from "../../../../core/erp"
@Component({
  selector: 'kt-edit-sequence',
  templateUrl: './edit-sequence.component.html',
  styleUrls: ['./edit-sequence.component.scss']
})
export class EditSequenceComponent implements OnInit {

  sequence: Sequence
  sequenceForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  title: String = 'Modifier Sequence - '
  sequenceEdit: any
  isnRQ: Boolean

  profiles: []
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  gridObj: any
  angularGrid: AngularGridInstance
  isExist = false
  users: []
  columnDefinitions1: Column[] = []
  gridOptions1: GridOption = {}
  gridObj1: any
  angularGrid1: AngularGridInstance

  level = 1

date1: any;
date2: any;
  constructor(
      config: NgbDropdownConfig,
      private sequenceFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private sequenceService: SequenceService,
      private userService: UsersService,
      private modalService: NgbModal
  ) {
      config.autoClose = true
  }
  ngOnInit(): void {
      this.loading$ = this.loadingSubject.asObservable()
      this.loadingSubject.next(true)
      this.activatedRoute.params.subscribe((params) => {
          const id = params.id
          this.sequenceService.getOne(id).subscribe((response: any)=>{
            this.sequenceEdit = response.data

            if(this.sequenceEdit.seq_type == "RQ") { this.isnRQ = false} else { this.isnRQ = true}
            this.date1 = new Date(this.sequenceEdit.seq_valid_date_start)
            this.date2 = new Date(this.sequenceEdit.seq_valid_date_end)
            this.date1.setDate(this.date1.getDate() )
            this.date2.setDate(this.date2.getDate() )
            this.initCode()
            this.loadingSubject.next(false)
            this.title = this.title + this.sequenceEdit.seq_value
          })
      })
  }
  // init code
  initCode() {
      this.createForm()
      this.loadingSubject.next(false)
  }

  handleSelectedRowsChanged(e, args) {
    const controls = this.sequenceForm.controls
    if (Array.isArray(args.rows) && this.gridObj) {
        args.rows.map((idx) => {
            const item = this.gridObj.getDataItem(idx)
            controls.seq_profile.setValue(item.usrg_code || "")
        })
    }
}

angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    this.gridObj = (angularGrid && angularGrid.slickGrid) || {}
}
handleSelectedRowsChanged1(e, args) {
    const controls = this.sequenceForm.controls
    if (Array.isArray(args.rows) && this.gridObj1) {
        args.rows.map((idx) => {
            const item = this.gridObj1.getDataItem(idx)
            this.level == 1
                ? controls.seq_appr1.setValue(item.usrd_code || "")
                : this.level == 2
                ? controls.seq_appr2.setValue(item.usrd_code || "")
                : controls.seq_appr3.setValue(item.usrd_code || "")
        })
    }
}

angularGridReady1(angularGrid: AngularGridInstance) {
    this.angularGrid1 = angularGrid
    this.gridObj1 = (angularGrid && angularGrid.slickGrid) || {}
}
prepareGrid() {
    this.columnDefinitions = [
        {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
        {
            id: "usrg_code",
            name: "code profil",
            field: "usrg_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "usrg_description",
            name: "description",
            field: "usrg_description",
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
    this.userService
        .getAllProfiles()
        .subscribe((response: any) => (this.profiles = response.data))
}

prepareGrid1() {
    this.columnDefinitions1 = [
        {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
        {
            id: "usrd_code",
            name: "code user",
            field: "usrd_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "usrd_name",
            name: "nom",
            field: "usrd_name",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
    ]

    this.gridOptions1 = {
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
    this.userService
        .getAllUsers()
        .subscribe((response: any) => (this.users = response.data))
}
open(content) {
    this.prepareGrid()
    this.modalService.open(content, { size: "lg" })
}

open1(content) {
    this.prepareGrid1()
    this.level = 1
    this.modalService.open(content, { size: "lg" })
}
open2(content) {
    this.prepareGrid1()
    this.level = 2
    this.modalService.open(content, { size: "lg" })
}
open3(content) {
    this.prepareGrid1()
    this.level = 3
    this.modalService.open(content, { size: "lg" })
}

  //create form
  createForm() {
      this.sequence = new Sequence()
      this.sequenceForm = this.sequenceFB.group({
        seq_seq: [{value: this.sequenceEdit.seq_seq, disabled : true}, Validators.required],
        seq_type: [{value: this.sequenceEdit.seq_type, disabled : true}, Validators.required],
        seq_desc: [this.sequenceEdit.seq_desc, Validators.required],
        seq_profile: [this.sequenceEdit.seq_profile, Validators.required],
        seq_appr1: [{value: this.sequenceEdit.seq_appr1, disabled: this.isnRQ},Validators.required],
        seq_appr1_lev: [{value:  this.sequenceEdit.seq_appr1_lev, disabled: this.isnRQ}, Validators.required],
        seq_appr1_thr: [{value:  this.sequenceEdit.seq_appr1_thr, disabled: this.isnRQ}, Validators.required],
        seq_appr2: [{value:  this.sequenceEdit.seq_appr2, disabled: this.isnRQ}, Validators.required],
        seq_appr2_lev: [{value: this.sequenceEdit.seq_appr2_lev, disabled: this.isnRQ}, Validators.required],
        seq_appr2_thr: [{value:  this.sequenceEdit.seq_appr2_thr, disabled: this.isnRQ}, Validators.required],
        seq_appr3: [{value:  this.sequenceEdit.seq_appr3, disabled: this.isnRQ}, Validators.required],
        seq_appr3_lev: [{value:  this.sequenceEdit.seq_appr3_lev, disabled: this.isnRQ}, Validators.required],
        seq_appr3_thr: [{value:  this.sequenceEdit.seq_appr3_thr,  disabled: this.isnRQ},Validators.required],


        seq_valid_date_start: [{
          year: this.date1.getFullYear(),
          month: this.date1.getMonth()+1,
          day: this.date1.getDate()
        }],
        seq_valid_date_end: [{
          year: this.date2.getFullYear(),
          month: this.date2.getMonth()+1,
          day: this.date2.getDate()
        }],

        seq_prefix: [this.sequenceEdit.seq_prefix, Validators.required],
        seq_dig_range_inf: [this.sequenceEdit.seq_dig_range_inf, Validators.required],
        seq_dig_range_sup: [this.sequenceEdit.seq_dig_range_sup, Validators.required],
        seq_curr_val: [this.sequenceEdit.seq_curr_val, Validators.required],
      
        })
  }


  //reste form
  reset() {
      this.sequence = new Sequence()
      this.createForm()
      this.hasFormErrors = false
  }
  // save data
  onSubmit() {
      this.hasFormErrors = false
      const controls = this.sequenceForm.controls
      /** check form */
      if (this.sequenceForm.invalid) {
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
  prepareCode(): Sequence {
      const controls = this.sequenceForm.controls
      const _sequence = new Sequence()
      _sequence.id = this.sequenceEdit.id
      _sequence.seq_seq = controls.seq_seq.value
      _sequence.seq_desc = controls.seq_desc.value
      _sequence.seq_type = controls.seq_type.value
      _sequence.seq_profile = controls.seq_profile.value
      _sequence.seq_appr1 = controls.seq_appr1.value
      _sequence.seq_appr1_lev = controls.seq_appr1_lev.value
      _sequence.seq_appr1_thr = controls.seq_appr1_thr.value
      _sequence.seq_appr2 = controls.seq_appr2.value
      _sequence.seq_appr2_lev = controls.seq_appr2_lev.value
      _sequence.seq_appr2_thr = controls.seq_appr2_thr.value
      _sequence.seq_appr3 = controls.seq_appr3.value
      _sequence.seq_appr3_lev = controls.seq_appr3_lev.value
      _sequence.seq_appr3_thr = controls.seq_appr3_thr.value
      _sequence.seq_valid_date_start = controls.seq_valid_date_start.value
          ? `${controls.seq_valid_date_start.value.year}/${controls.seq_valid_date_start.value.month}/${controls.seq_valid_date_start.value.day}`
          : null
      _sequence.seq_valid_date_end = controls.seq_valid_date_end.value
          ? `${controls.seq_valid_date_end.value.year}/${controls.seq_valid_date_end.value.month}/${controls.seq_valid_date_end.value.day}`
          : null
      _sequence.seq_prefix = controls.seq_prefix.value
      _sequence.seq_dig_range_inf = controls.seq_dig_range_inf.value
      _sequence.seq_dig_range_sup = controls.seq_dig_range_sup.value
      _sequence.seq_curr_val =  controls.seq_curr_val.value
      return _sequence
  }
  /**
   * Add code
   *
   * @param _sequence: CodeModel
   */
  addCode(_sequence: Sequence) {
      this.loadingSubject.next(true)
      this.sequenceService.update(this.sequenceEdit.id, _sequence).subscribe(
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
                  "Modification avec succès",
                  MessageType.Create,
                  10000,
                  true,
                  true
              )
              this.loadingSubject.next(false)
              this.router.navigateByUrl("/purchasing/list-sequence")
          }
      )
  }

  /**
   * Go back to the list
   *
   */
  goBack() {
      this.loadingSubject.next(false)
      const url = `/purchasing/list-dequence`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
}
