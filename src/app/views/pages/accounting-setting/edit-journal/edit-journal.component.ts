// Angular
import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"

// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Editor,
    Editors,
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

import { CodeService, Daybook, DaybookService } from "../../../../core/erp"

@Component({
  selector: 'kt-edit-journal',
  templateUrl: './edit-journal.component.html',
  styleUrls: ['./edit-journal.component.scss']
})
export class EditJournalComponent implements OnInit {

  daybook: Daybook
  daybookForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  title: String = 'Modifier Journal - '
  daybookEdit: any
  dy_type: any[] = []
  constructor(
      config: NgbDropdownConfig,
      private dyFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private daybookService: DaybookService,
      private codeService: CodeService,
  ) {
      config.autoClose = true
      this.codeService
      .getBy({ code_fldname: "dy_type" })
      .subscribe((response: any) => (this.dy_type = response.data))
  }
  ngOnInit(): void {
      this.loading$ = this.loadingSubject.asObservable()
      this.loadingSubject.next(true)
      this.activatedRoute.params.subscribe((params) => {
          const id = params.id
          this.daybookService.getOne(id).subscribe((response: any)=>{
            this.daybookEdit = response.data
            this.initCode()
            this.loadingSubject.next(false)
            this.title = this.title + this.daybookEdit.dy_dy_code
          })
      })
  }
  // init code
  initCode() {
      this.createForm()
      this.loadingSubject.next(false)
  }
  //create form
  createForm() {
        this.daybook = new Daybook()
        this.daybookForm = this.dyFB.group({
            dy_dy_code: [{value: this.daybookEdit.dy_dy_code, disabled: true}, Validators.required],
            dy_desc: [this.daybookEdit.dy_desc, Validators.required ],
            dy_type: [this.daybookEdit.dy_type],
            dy_next_pgdet: [this.daybookEdit.dy_next_pgdet],
            dy_next_pgcen: [this.daybookEdit.dy_next_pgcen], 
            dy_last_entdet: [this.daybookEdit.dy_last_entdet],
            dy_last_entcen: [this.daybookEdit.dy_last_entcen], 




      })
  }
  //reste form
  reset() {
      this.daybook = new Daybook()
      this.createForm()
      this.hasFormErrors = false
  }
  // save data
  onSubmit() {
      this.hasFormErrors = false
      const controls = this.daybookForm.controls
      /** check form */
      if (this.daybookForm.invalid) {
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
  prepareCode(): Daybook {
    const controls = this.daybookForm.controls
    const _daybook = new Daybook()
    _daybook.id = this.daybookEdit.id
    _daybook.dy_dy_code = controls.dy_dy_code.value
    _daybook.dy_desc = controls.dy_desc.value
    _daybook.dy_type = controls.dy_type.value
    _daybook.dy_next_pgdet = controls.dy_next_pgdet.value
    _daybook.dy_next_pgcen = controls.dy_next_pgcen.value
    _daybook.dy_last_entdet = controls.dy_last_entdet.value
    _daybook.dy_last_entcen = controls.dy_last_entcen.value
    
    return _daybook
}
  /**
   * Add code
   *
   * @param _daybook: daybookModel
   */
  addCode(_daybook: Daybook) {
      this.loadingSubject.next(true)
      this.daybookService.update(this.daybookEdit.id, _daybook).subscribe(
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
              this.router.navigateByUrl("/daybooking-setting/list-journal")
          }
      )
  }

  /**
   * Go bdy_k to the list
   *
   */
  goBack() {
      this.loadingSubject.next(false)
      const url = `/accounting-setting/list-journal`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
}
