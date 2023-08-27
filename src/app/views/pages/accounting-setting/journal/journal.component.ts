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
  selector: 'kt-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss'],
  providers: [NgbDropdownConfig, NgbTabsetConfig],

})
export class JournalComponent implements OnInit {

  daybook: Daybook
  daybookForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
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
          this.loadingSubject.next(false)
          this.createForm()
      }
      //create form
      createForm() {
          this.loadingSubject.next(false)
      
          this.daybook = new Daybook()
          this.daybookForm = this.dyFB.group({
              dy_dy_code: [this.daybook.dy_dy_code, Validators.required],
              dy_desc: [
                  { value: this.daybook.dy_desc, disabled: !this.isExist },
                  Validators.required,
              ],
              dy_type: [{ value: this.daybook.dy_type, disabled: !this.isExist }],
              
              dy_next_pgdet: [{ value: this.daybook.dy_next_pgdet, disabled: !this.isExist }],
              dy_next_pgcen: [{ value: this.daybook.dy_next_pgcen, disabled: !this.isExist }],
              dy_last_entdet: [{ value: this.daybook.dy_last_entdet, disabled: !this.isExist }],
              dy_last_entcen: [{ value: this.daybook.dy_last_entcen, disabled: !this.isExist }],
              
          })
      }
      
      onChangeCode() {
          const controls = this.daybookForm.controls
          this.daybookService
              .getBy({
                    dy_dy_code: controls.dy_dy_code.value,
              })
              .subscribe((response: any) => {
                console.log(response)
                  if (response.data.length) {
                      this.isExist = true
                      console.log(response.data.length)
                  } else {
                      controls.dy_desc.enable()
                      controls.dy_type.enable()
                      controls.dy_next_pgdet.enable()
                      controls.dy_next_pgcen.enable()
                      controls.dy_last_entdet.enable()
                      controls.dy_last_entcen.enable()
                  }
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
/**
   * Add daybook
   *
   * @param _daybook: daybookModel
   */
  addCode(_daybook: Daybook) {
      this.loadingSubject.next(true)
      this.daybookService.add(_daybook).subscribe(
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
              this.router.navigateByUrl("/accounting-setting/journal-list")
          }
      )
  }


 /**
     * Go back to the list
     *
     */
    goBack() {
      this.loadingSubject.next(false)
      const url = `/accounting-setting/journal-list`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }



}
