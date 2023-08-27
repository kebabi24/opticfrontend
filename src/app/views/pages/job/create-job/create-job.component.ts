// Angular
import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  GridService,
  FieldType,
  Formatters,
  OnEventArgs,
} from "angular-slickgrid";
import { BehaviorSubject, Observable } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { JobService, Job } from "../../../../core/erp";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud"

@Component({
  selector: 'kt-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.scss']
})
export class CreateJobComponent implements OnInit {

  jobForm: FormGroup;
  row_number;

  isExist = false

  

  
  
  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];
  job: Job;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;

  constructor(
    config: NgbDropdownConfig,
    private jobFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private jobService: JobService,
  ) {
    config.autoClose = true;
  }

  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  ngOnInit(): void {
    this.reset();
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.reset();
    this.createForm();
    this.initmvGrid();

  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.job = new Job();
    this.jobForm = this.jobFB.group({
      jb_code: [this.job.jb_code, Validators.required],
      jb_desc: [{ value: this.job.jb_desc, disabled: !this.isExist },  Validators.required],
     
    });
  }


  onChangeCode() {
    const controls = this.jobForm.controls
    this.jobService
        .getBy({
              jb_code: controls.jb_code.value
        })
        .subscribe((response: any) => {
          console.log(response.data.job)
            if (response.data.job ) {
                this.isExist = true
                console.log(response.data.length)
              
            } else {
                controls.jb_desc.enable()
              
                
            }
     })
  }
  //reste form
  reset() {
    this.job = new Job();
    this.mvdataset = []
    this.createForm();
    this.hasFormErrors = false;

  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.jobForm.controls;
    /** check form */
    if (this.jobForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    // tslint:disable-next-line:prefer-const
    let job = this.preparejob();
    for (let data of this.mvdataset) {
      delete data.id;
      delete data.cmvid;
    }
    this.addjob(job, this.mvdataset);
  }
  /**
   * Returns object for saving
   */
  preparejob(): Job {
    const controls = this.jobForm.controls;
    const _job = new Job();
    _job.jb_code = controls.jb_code.value;
    _job.jb_desc = controls.jb_desc.value;
    return _job;
  }
  /**
   * Add code
   *
   * @param _job: JobModel
   */
  addjob(_job: Job, details: any) {
    this.loadingSubject.next(true);
    this.jobService
      .add({ Job: _job, JobDetails: details })
      .subscribe(
        (reponse) => console.log("response", Response),
        (error) => {
          this.layoutUtilsService.showActionNotification(
            "Erreur verifier les informations",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.loadingSubject.next(false);
        },
        () => {
          this.layoutUtilsService.showActionNotification(
            "Ajout avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.reset();
          this.loadingSubject.next(false);
          this.router.navigateByUrl("/job/create-job");
        }
      );
  }

  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  initmvGrid() {
    this.mvcolumnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.mvangularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      },
      {
        id: "jbd_level",
        name: "Code Niveau",
        field: "jbd_level",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "jbd_desc",
        name: "Description",
        field: "jbd_desc",
        sortable: true,
        width: 200,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "jbd_time_rate",
        name: "Taux Horaire",
        field: "jbd_time_rate",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.number,
        editor: {
          model: Editors.float,
        },
      },
      
      
    ];

    this.mvgridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
    };

    this.mvdataset = [];
  }
  addNewItem() {
    const newId = this.mvdataset.length+1;

    const newItem = {
      id: newId,
      jbd_level: "",
      jbd_desc: "",
      jbd_time_rate: 0,
    };
    this.mvgridService.addItem(newItem, { position: "bottom" });
  }
onAlertClose($event) {
  this.hasFormErrors = false
}
}
