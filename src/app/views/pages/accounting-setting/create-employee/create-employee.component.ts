import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
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
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
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

import { Employe, EmployeService, JobService , CodeService, SiteService} from "../../../../core/erp"
@Component({
  selector: 'kt-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  employe: Employe
  empForm: FormGroup
  hasFormErrors = false
  hasEmployeErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  error = false
  field = ""
  selectedTab = 0
    data: []
    columnDefinitions3: Column[] = []
    gridOptions3: GridOption = {}
    gridObj3: any
    angularGrid3: AngularGridInstance
    selectedField = ""
   
    hasEmployeFormErrors = false

    datasite: []
    columnDefinitionssite: Column[] = []
    gridOptionssite: GridOption = {}
    gridObjsite: any
    angularGridsite: AngularGridInstance
    
    datashift: []
    columnDefinitionsshift: Column[] = []
    gridOptionsshift: GridOption = {}
    gridObjshift: any
    angularGridshift: AngularGridInstance

  jobs: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

    emp_city: any[] = []
    emp_state: any[] = []
    emp_county: any[] = []
    emp_country: any[] = []
  constructor(
      config: NgbDropdownConfig,
      private empFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private modalService: NgbModal,
      private employeService: EmployeService,
      private jobService: JobService,
      private codeService: CodeService,
      private siteService: SiteService,
      
  ) {
      config.autoClose = true
      this.codeService
      .getBy({ code_fldname: "ad_state" })
      .subscribe((response: any) => (this.emp_state = response.data))
      this.codeService
      .getBy({ code_fldname: "ad_country" })
      .subscribe((response: any) => (this.emp_country = response.data))
  this.codeService
      .getBy({ code_fldname: "ad_county" })
      .subscribe((response: any) => (this.emp_county = response.data))
      this.codeService
      .getBy({ code_fldname: "ad_city" })
      .subscribe((response: any) => (this.emp_city = response.data))
  
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.createForm()
}
//create form
createForm() {
  this.loadingSubject.next(false)

  this.employe = new Employe()
  
  this.empForm = this.empFB.group({
      emp_addr: [this.employe.emp_addr, Validators.required],
      emp_lname: [
          { value: this.employe.emp_lname, disabled: !this.isExist },
          Validators.required,
      ],
      emp_fname: [
        { value: this.employe.emp_fname, disabled: !this.isExist },
        Validators.required,
    ],
      
    emp_sex: [
      { value: this.employe.emp_sex, disabled: !this.isExist },
      Validators.required,
  ],
  emp_familysit: [
    { value: this.employe.emp_familysit, disabled: !this.isExist },
    Validators.required,
],

  emp_birth_date: [this.employe.emp_birth_date, Validators.required],




      

      emp_line1:  [{ value: this.employe.emp_line1, disabled: !this.isExist }, Validators.required,],
      emp_line2: [{ value: this.employe.emp_line2, disabled: !this.isExist }],
      emp_line3: [{ value: this.employe.emp_line3, disabled: !this.isExist }],
      emp_ss_id:  [{ value: this.employe.emp_ss_id, disabled: !this.isExist }, Validators.required,],
      emp_country: [{ value: this.employe.emp_country, disabled: !this.isExist }],
      emp_city: [{ value: this.employe.emp_city, disabled: !this.isExist }],
      
      emp_state: [{ value: this.employe.emp_state, disabled: !this.isExist }],

      emp_zip: [{ value: this.employe.emp_zip, disabled: !this.isExist }],
      emp_phone: [{ value: this.employe.emp_phone, disabled: !this.isExist }],
      emp_fax: [{ value: this.employe.emp_fax, disabled: !this.isExist }],
      emp_mail: [{ value: this.employe.emp_mail, disabled: !this.isExist }],
    
      emp_job: [{ value: this.employe.emp_job, disabled: !this.isExist }],

      emp_level: [{ value: this.employe.emp_level, disabled: !this.isExist }],

      emp_shift:  [{ value: this.employe.emp_shift, disabled: !this.isExist }],
      emp_site:  [{ value: this.employe.emp_site, disabled: !this.isExist }],
      emp_first_date:  [{ value: this.employe.emp_first_date, disabled: !this.isExist }],
      emp_last_date:  [{ value: this.employe.emp_last_date, disabled: !this.isExist }],
      emp_rate:  [{ value: this.employe.emp_rate, disabled: !this.isExist }],
      emp_mrate: [{ value: this.employe.emp_mrate, disabled: !this.isExist }],
      emp_arate: [{ value: this.employe.emp_arate, disabled: !this.isExist }],


  })
}

onChangeCode() {
  const controls = this.empForm.controls
  this.employeService
      .getBy({
            emp_addr: controls.emp_addr.value,
      })
      .subscribe((response: any) => {
          if (response.data.length) {
              this.isExist = true
              console.log(response.data.length)
          } else {
              controls.emp_lname.enable()
              controls.emp_fname.enable()
              controls.emp_sex.enable()
              controls.emp_familysit.enable()
              controls.emp_job.enable()
              controls.emp_level.enable()
              controls.emp_line1.enable()  
              controls.emp_line2.enable()
              controls.emp_line3.enable()
              controls.emp_ss_id.enable()
              controls.emp_country.enable()
              controls.emp_city.enable()
             
              controls.emp_state.enable()
              controls.emp_zip.enable()
              controls.emp_phone.enable()
              controls.emp_fax.enable()
              controls.emp_mail.enable()
              controls.emp_shift.enable()
              controls.emp_site.enable()
              controls.emp_first_date.enable()
              controls.emp_last_date.enable()
              controls.emp_rate.enable()
              controls.emp_mrate.enable()
              controls.emp_arate.enable()
          }
   })
}
onChangeJob() {
  const controls = this.empForm.controls; // chof le champs hada wesh men form rah
  const jb_code = controls.emp_job.value;
 

  this.jobService.getBy({ jb_code }).subscribe(
    (res: any) => {
      console.log(res);
      const { data } = res.data;

      if (!data) {
        this.layoutUtilsService.showActionNotification(
          "ce Métier n'existe pas!",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.error = true;
        document.getElementById("job").focus();
      }
    },
    (error) => console.log(error)
  );
}
onChangeLevel() {
  const controls = this.empForm.controls; // chof le champs hada wesh men form rah
  const jbd_code = controls.emp_job.value;
 

  this.jobService.getByDet({ jbd_code }).subscribe(
    (res: any) => {
      console.log(res);
      const { data } = res.data;

      if (!data) {
        this.layoutUtilsService.showActionNotification(
          "ce Niveau n'existe pas!",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.error = true;
        document.getElementById("level").focus();
      }
    },
    (error) => console.log(error)
  );
}

//reste form
reset() {
  this.employe = new Employe()
  this.createForm()
  this.hasFormErrors = false
  
}
// save data
onSubmit() {
  this.hasFormErrors = false
  
  const controls = this.empForm.controls
  /** check form */
  if (this.empForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      
      this.selectedTab = 0
      
      return
  }
  

  // tslint:disable-next-line:prefer-const
  let employe = this.prepareCode()
  this.addEmploye(employe)
  
}
/**
     * Returns object for saving
     */
    prepareCode(): Employe {
      const controls = this.empForm.controls
      const _employe = new Employe()
      _employe.emp_addr = controls.emp_addr.value
      _employe.emp_lname = controls.emp_lname.value
      _employe.emp_fname = controls.emp_fname.value
      _employe.emp_sex = controls.emp_sex.value
      _employe.emp_familysit = controls.emp_familysit.value
      _employe.emp_job = controls.emp_job.value
      _employe.emp_level = controls.emp_level.value
      _employe.emp_birth_date = controls.emp_birth_date.value
      ? `${controls.emp_birth_date.value.year}/${controls.emp_birth_date.value.month}/${controls.emp_birth_date.value.day}`
      : null
      _employe.emp_first_date = controls.emp_first_date.value
      ? `${controls.emp_first_date.value.year}/${controls.emp_first_date.value.month}/${controls.emp_first_date.value.day}`
      : null
      _employe.emp_last_date = controls.emp_last_date.value
      ? `${controls.emp_last_date.value.year}/${controls.emp_last_date.value.month}/${controls.emp_last_date.value.day}`
      : null

      _employe.emp_line1 = controls.emp_line1.value
      _employe.emp_line2 = controls.emp_line2.value
      _employe.emp_line3 = controls.emp_line3.value

      _employe.emp_country = controls.emp_country.value
      _employe.emp_city = controls.emp_city.value
      
      _employe.emp_state = controls.emp_state.value
      _employe.emp_zip =  controls.emp_zip.value

      _employe.emp_phone = controls.emp_phone.value
      _employe.emp_fax = controls.emp_fax.value
      _employe.emp_mail = controls.emp_mail.value




      _employe.emp_ss_id = controls.emp_ss_id.value
      _employe.emp_shift = controls.emp_shift.value
      _employe.emp_site = controls.emp_site.value
      _employe.emp_rate = controls.emp_rate.value
      _employe.emp_mrate = controls.emp_mrate.value
      _employe.emp_arate = controls.emp_arate.value
      


      return _employe
  }
  onChangeState() {
    const controls  = this.empForm.controls
  
    this.codeService
        .getBy({ code_fldname: "ad_city", chr01: controls.emp_state.value.substring(0, 2) })
        .subscribe((response: any) => {(this.emp_city = response.data)
        })    
}
/**
     * Add code
     *
     * @param _employe: EmployeModel
     */
    addEmploye(_employe: Employe) {
      const controls = this.empForm.controls
      this.loadingSubject.next(true)
      this.employeService.add(_employe).subscribe(
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
              
              this.router.navigateByUrl("/accounting-setting/employe-list")
          }
      )
  }


 

 /**
     * Go back to the list
     *
     */
    goBack() {
      this.loadingSubject.next(false)
      const url = `/accounting-setting/employe-list`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }




  changeJob(){
    const controls = this.empForm.controls // chof le champs hada wesh men form rah
    const jb_code  = controls.emp_job.value
    this.jobService.getBy({jb_code}).subscribe((res:any)=>{
        const {data} = res
        console.log(res)
        if (!data){ this.layoutUtilsService.showActionNotification(
            "ce Métier n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
        )
    this.error = true}
        else {
            this.error = false
        }


    },error=>console.log(error))
}

  handleSelectedRowsChanged2(e, args) {
    const controls = this.empForm.controls;
    if (Array.isArray(args.rows) && this.gridObj2) {
      args.rows.map((idx) => {
        const item = this.gridObj2.getDataItem(idx);
        controls.emp_job.setValue(item.jb_code || "");
      });
    }
  }

  angularGridReady2(angularGrid: AngularGridInstance) {
    this.angularGrid2 = angularGrid;
    this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid2() {
    this.columnDefinitions2 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "jb_code",
        name: "code",
        field: "jb_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "jb_desc",
        name: "Designation",
        field: "jb_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      
    ];

    this.gridOptions2 = {
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
    };

    // fill the dataset with your data
    this.jobService
      .getAll()
      .subscribe((response: any) => (this.jobs = response.data));
  }
  open2(content) {
    this.prepareGrid2();
    this.modalService.open(content, { size: "lg" });
  }


  handleSelectedRowsChanged3(e, args) {
    const controls = this.empForm.controls;
    if (Array.isArray(args.rows) && this.gridObj3) {
      args.rows.map((idx) => {
        const item = this.gridObj3.getDataItem(idx);
        controls.emp_level.setValue(item.jbd_level || "");
      });
    }
}
  angularGridReady3(angularGrid: AngularGridInstance) {
    this.angularGrid3 = angularGrid
    this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid3() {
  const controls = this.empForm.controls;
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
            id: "jbd_code",
            name: "Code Métier",
            field: "jbd_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "jbd_level",
          name: "Niveau",
          field: "jbd_level",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      
        {
            id: "jbd_desc",
            name: "Designation",
            field: "jbd_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "jbd_time_rate",
          name: "Taux Horaire",
          field: "jbd_time_rate",
          sortable: true,
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
    this.jobService
        .getByDet({jbd_code: controls.emp_job.value})
        .subscribe((response: any) => (this.data = response.data))
}
open3(content) {
   
    this.prepareGrid3()
    this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChangedsite(e, args) {
  
  const controls = this.empForm.controls;
  if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
          const item = this.gridObjsite.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
                  controls.emp_site.setValue(item.si_site || "")
      })
  }
}
angularGridReadysite(angularGrid: AngularGridInstance) {
  this.angularGridsite = angularGrid
  this.gridObjsite = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridsite() {
  this.columnDefinitionssite = [
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
          id: "si_site",
          name: "Site",
          field: "si_site",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "si_desc",
          name: "Designation",
          field: "si_desc",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      
  ]

  this.gridOptionssite = {
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
  this.siteService
      .getAll()
      .subscribe((response: any) => (this.datasite = response.data))
}
opensite(contentsite, field) {
  this.selectedField = field
  this.prepareGridsite()
  this.modalService.open(contentsite, { size: "lg" })
}
onChangesite() {
  const controls = this.empForm.controls;
  const si_site = controls.emp_site.value;
  
  this.siteService.getByOne({ si_site }).subscribe(
    (res: any) => {

      if (!res.data) {

          alert("Site n'existe pas  ")
          controls.emp_site.setValue(null);
          document.getElementById("emp_site").focus();
        }
    
    });
}

handleSelectedRowsChangedshift(e, args) {
  
  const controls = this.empForm.controls;
  if (Array.isArray(args.rows) && this.gridObjshift) {
      args.rows.map((idx) => {
          const item = this.gridObjshift.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
                  controls.emp_shift.setValue(item.code_value || "")
      })
  }
}
angularGridReadyshift(angularGrid: AngularGridInstance) {
  this.angularGridshift = angularGrid
  this.gridObjshift = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridshift() {
  this.columnDefinitionsshift = [
      /*{
          id: "id",
          field: "id",
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,

          minWidth: 50,
          maxWidth: 50,
      },*/
      {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
      },
      {
          id: "code_value",
          name: "Code Equipe",
          field: "code_value",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "code_cmmt",
          name: "Designation",
          field: "code_cmmt",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      
  ]

  this.gridOptionsshift = {
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
      .getBy ({code_fldname: "emp_shift"})
      .subscribe((response: any) => (this.datashift = response.data))
}
openshift(contentshift) {
  
  this.prepareGridshift()
  this.modalService.open(contentshift, { size: "lg" })
}
onChangeshift() {
  const controls = this.empForm.controls;
  
  this.codeService.getBy({ code_fldname: "emp_shift", code_value : controls.emp_shift.value}).subscribe(
    (res: any) => {
console.log(res.data)
      if (res.data.length == 0) {

          alert("Equipe n'existe pas  ")
          controls.emp_shift.setValue(null);
          document.getElementById("emp_shift").focus();
        }
    
    });
}

/**
     * Close alert
     *
     * @param $event
     */
 onAlertClose($event) {
  this.hasFormErrors = false
}

}
