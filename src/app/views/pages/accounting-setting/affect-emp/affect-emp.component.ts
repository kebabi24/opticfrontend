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
import { FormGroup, FormBuilder, Validators, NgControlStatus } from "@angular/forms"
import { EmployeService, CodeService , ProjectService, TaskService,ProviderService,AffectEmpService,AffectEmp} from "../../../../core/erp";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY } from "@angular/cdk/overlay/overlay-directives";
@Component({
  selector: 'kt-affect-emp',
  templateUrl: './affect-emp.component.html',
  styleUrls: ['./affect-emp.component.scss']
})
export class AffectEmpComponent implements OnInit {

  affectEmp: AffectEmp;
  empForm: FormGroup;
  row_number;

  isExist = false

  emps: []
  columnDefinitionsemp: Column[] = []
  gridOptionsemp: GridOption = {}
  gridObjemp: any
  angularGridemp: AngularGridInstance
  
  providers: []
  columnDefinitionsprov: Column[] = []
  gridOptionsprov: GridOption = {}
  gridObjprov: any
  angularGridprov: AngularGridInstance

  dataset: []
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  gridObj: any
  angularGrid: AngularGridInstance
  
  datasetinst: []
  columnDefinitionsinst: Column[] = []
  gridOptionsinst: GridOption = {}
  gridObjinst: any
  angularGridinst: AngularGridInstance
  
  datasettask: []
  columnDefinitionstask: Column[] = []
  gridOptionstask: GridOption = {}
  gridObjtask: any
  angularGridtask: AngularGridInstance

  details: any;
  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];
  
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  message = "";
  job: String;
  level: String;
  
  constructor(
    
    config: NgbDropdownConfig,
    private empFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public  dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private employeService: EmployeService,
    private affectEmpService: AffectEmpService,
    private codeService: CodeService,
    private taskService: TaskService,
    private projectService: ProjectService,
    private providerService: ProviderService,
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
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.createForm();
    this.initmvGrid();
  }
  createForm() {
    this.loadingSubject.next(false)
  //create form
  this.affectEmp = new AffectEmp()
  
  this.empForm = this.empFB.group({
      pme_pm_code: [this.affectEmp.pme_pm_code, Validators.required],
      pmdesc :  [{value: "", disabled: true}],
      pme_inst: [
          this.affectEmp.pme_inst, 
          Validators.required,
      ],
      pme_task: [
        this.affectEmp.pme_task,
        Validators.required,
    ],
    taskdesc :  [{value: "", disabled: true}],
      
    pme_task_status: [{value:
      this.affectEmp.pme_task_status, 
      disabled: true}
  ],

  pme_start_date: [this.affectEmp.pme_start_date, Validators.required],
  pme_end_date: [this.affectEmp.pme_end_date, Validators.required],

  pme_start_time: [this.affectEmp.pme_start_time, Validators.required],
  pme_end_time: [this.affectEmp.pme_end_time, Validators.required],


      

      
  


  })
}

prepareCode(): any {
  const controls = this.empForm.controls
  const _affectEmp = new AffectEmp()
  _affectEmp.pme_pm_code = controls.pme_pm_code.value
  _affectEmp.pme_inst = controls.pme_inst.value
  _affectEmp.pme_task = controls.pme_task.value
  _affectEmp.pme_task_status = controls.pme_task_status.value
  _affectEmp.pme_start_time = controls.pme_start_time.value
  _affectEmp.pme_end_time = controls.pme_end_time.value
  _affectEmp.pme_start_date = controls.pme_start_date.value
    ? `${controls.pme_start_date.value.year}/${controls.pme_start_date.value.month}/${controls.pme_start_date.value.day}`
    : null
  _affectEmp.pme_end_date = controls.pme_end_date.value
    ? `${controls.pme_end_date.value.year}/${controls.pme_end_date.value.month}/${controls.pme_end_date.value.day}`
    : null
  return _affectEmp
}


  onChangeCode() {
    this.mvdataset = [];
    const controls = this.empForm.controls
    this.projectService
        .getBy({
              pme_pm_code: controls.pme_addr.value
        })
        .subscribe((response: any) => {
         // console.log(response.data)
          if (response.data.length == 0) {

            alert("Projet n'existe pas  ")
            controls.pme_addr.setValue(null);
            document.getElementById("pme_pm_code").focus();
          } else {

            controls.pmdesc.setValue(response.data[0].pm_desc || "");
         
          }
      
     })
  }
  //reste form
  reset() {
    
    this.createForm();
    this.hasFormErrors = false;
    this.mvdataset = []; 
  }
  // save data
  onSubmit() {
    console.log("haha")
    this.hasFormErrors = false;
    const controls = this.empForm.controls;
    /** check form */
    if (this.empForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;
      return;
    }

    if (!this.mvdataset.length) {
      this.message = "La liste des employés ne peut pas etre vide ";
      this.hasFormErrors = true;

      return;
    }

    for (var i = 0; i < this.mvdataset.length; i++) {
      console.log(this.mvdataset[i]  )
     if (this.mvdataset[i].pme_employe == "" || this.mvdataset[i].pme_employe == null  ) {
      this.message = "L' employé ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     

    }



  console.log("hhhhhhhjssfffjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
  let pme = this.prepareCode()
  console.log(pme)
  this.addDet(pme, this.mvdataset);
  console.log("jjjj")
  }

  
  
  addDet( _affectEmp: any ,detail: any) {
    console.log("here")
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
     
    }
    let emp = null;
  //  const controls = this.empForm.controls // chof le champs hada wesh men form rah
   // emp = controls.pme_addr.value
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
     
    }
    this.loadingSubject.next(true);
  
    this.affectEmpService
      .add({ affectEmp : _affectEmp, empDetail: detail })
      .subscribe(
        (reponse: any) => (emp = reponse.data),
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
            )
            this.loadingSubject.next(false)
            this.reset()
            this.router.navigateByUrl("/accounting-setting/affect-emp")
            this.reset()
        }
    )
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
        id: "pme_internal",
        name: "Interne",
        field: "pme_internal",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.checkbox
        },
        formatter: Formatters.checkmark,
        cannotTriggerInsert: false,
      },
      {
        id: "pme_employe",
        name: "Employé/Fournisseur",
        field: "pme_employe",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
                editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvid",
        field: "cmvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (args.dataContext.pme_internal) {
            this.row_number = args.row
            let element: HTMLElement = document.getElementById(
                "openEmpsGrid"
            ) as HTMLElement
            element.click()
          }
           else {

         
            this.row_number = args.row
            let element: HTMLElement = document.getElementById(
                "openProvsGrid"
            ) as HTMLElement
            element.click()
            }  
        },
      },
      {
        id: "fname",
        name: "Nom",
        field: "fname",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
      },
      {
        id: "lname",
        name: "Prénom",
        field: "lname",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
      },
      {
        id: "job",
        name: "Métier",
        field: "job",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
      },
      {
        id: "level",
        name: "Niveau",
        field: "level",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
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
      pme_internal: true,
      pme_affectEmp : "",
      fname: null,
      lname: null,
      job  : null,
      level: null,
    };
    this.mvgridService.addItem(newItem, { position: "bottom" });
  }


handleSelectedRowsChanged(e, args) {
  this.mvdataset = [];
  const controls = this.empForm.controls // chof le champs hada wesh men form rah
  if (Array.isArray(args.rows) && this.gridObj) {
    args.rows.map((idx) => {
      const item = this.gridObj.getDataItem(idx);
      console.log(item);
      controls.pme_pm_code.setValue(item.pm_code || "");
      controls.pmdesc.setValue(item.pm_desc || "");
      
      

    });
  }
}
angularGridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid
  this.gridObj = (angularGrid && angularGrid.slickGrid) || {}
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
        id: "pm_cust",
        name: "Client",
        field: "pm_cust",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
    },
    
      
  ];

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
      },
      multiSelect: false,
      rowSelectionOptions: {
          selectActiveRow: true,
      },
  }

  // fill the dataset with your data
  this.projectService
      .getByAll({pm_status: "R"})
      .subscribe((response: any) => (this.dataset = response.data))
}
open(content) {
 
  this.prepareGrid()
  this.modalService.open(content, { size: "lg" })
}



handleSelectedRowsChangedinst(e, args) {
  this.mvdataset = [];
  const controls = this.empForm.controls // chof le champs hada wesh men form rah
  if (Array.isArray(args.rows) && this.gridObjinst) {
    args.rows.map((idx) => {
      const item = this.gridObjinst.getDataItem(idx);
      console.log(item);
      controls.pme_inst.setValue(item.pmd_task || "");
      
      
    });
  }
}
angularGridReadyinst(angularGrid: AngularGridInstance) {
  this.angularGridinst = angularGrid
  this.gridObjinst = (angularGrid && angularGrid.slickGrid) || {}
}


prepareGridinst() {
  const controls = this.empForm.controls 
  this.columnDefinitionsinst = [
      {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 40,
          maxWidth: 40,
      },
      {
          id: "pmd_task",
          name: "Code Instruction",
          field: "pmd_task",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "tk_desc",
        name: "Designation",
        field: "task.tk_desc",
        sortable: true,
        width: 120,
        filterable: true,
        type: FieldType.string,
    },
      {
          id: "pmd_qty",
          name: "Quantité",
          field: "pmd_qty",
          sortable: true,
          width: 80,
          filterable: true,
          type: FieldType.string,
      },
     /* {
        id: "pmd_price",
        name: "Prix",
        field: "pmd_price",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.float,
    },*/
    {
      id: "tk_um",
      name: "UM",
      field: "task.tk_um",
      sortable: true,
      
      filterable: true,
      type: FieldType.string,
  },
  {
    id: "pmd_price",
    name: "Prix",
    field: "pmd_price",
    sortable: true,
    width: 80,
    filterable: true,
    type: FieldType.float,
},

      
  ];

  this.gridOptionsinst = {
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
    dataItemColumnValueExtractor: function getItemColumnValue(
        item,
        column
    ) {
        var val = undefined
        try {
            val = eval("item." + column.field)
        } catch (e) {
            // ignore
        }
        return val
    },
}

  // fill the dataset with your data
  this.projectService
      .getBy({pm_code: controls.pme_pm_code.value })
      .subscribe((response: any) => (this.datasetinst = response.data.details))
}
openinst(content) {
 
  this.prepareGridinst()
  this.modalService.open(content, { size: "lg" })
}


handleSelectedRowsChangedtask(e, args) {
  this.mvdataset = [];
  const controls = this.empForm.controls // chof le champs hada wesh men form rah
  if (Array.isArray(args.rows) && this.gridObjtask) {
    args.rows.map((idx) => {
      const item = this.gridObjtask.getDataItem(idx);
     // console.log(item);
      controls.pme_task.setValue(item.pmt_task || "");
      controls.taskdesc.setValue(item.pmt_desc || "");
      controls.pme_task_status.setValue(item.pmt_status || "");
      this.job = item.pmt_job;
      this.level = item.pmt_level
      
    });
  }
}
angularGridReadytask(angularGrid: AngularGridInstance) {
  this.angularGridtask = angularGrid
  this.gridObjtask = (angularGrid && angularGrid.slickGrid) || {}
}


prepareGridtask() {
  const controls = this.empForm.controls 
  this.columnDefinitionstask = [
      {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 40,
          maxWidth: 40,
      },
      {
          id: "pmt_task",
          name: "Code Tache",
          field: "pmt_task",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "pmt_desc",
        name: "Designation",
        field: "pmt_desc",
        sortable: true,
        width: 120,
        filterable: true,
        type: FieldType.string,
    },
    {
        id: "pmt_job",
        name: "Métier",
        field: "pmt_job",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
    },
    {
      id: "pmt_level",
      name: "Niveau",
      field: "pmt_level",
      sortable: true,
      width: 80,
      filterable: true,
      type: FieldType.string,
  },
    {
      id: "pmt_duration",
      name: "Taux Horaire",
      field: "pmt_duration",
      sortable: true,
      width: 80,
      filterable: true,
      type: FieldType.float,
    },
    {
      id: "pmt_tool",
      name: "Liste Outil",
      field: "pmt_tool",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    
      
  ]

  this.gridOptionstask = {
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
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true,
      },
    }
  // fill the dataset with your data
  this.projectService
      .getByTask({pmt_code: controls.pme_pm_code.value, pmt_inst: controls.pme_inst.value })
      .subscribe((response: any) => (this.datasettask = response.data.details))
}
opentask(content) {
 
  this.prepareGridtask()
  this.modalService.open(content, { size: "lg" })
}






handleSelectedRowsChangedemp(e, args) {
  const controls = this.empForm.controls
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number)
  if (Array.isArray(args.rows) && this.gridObjemp) {
      args.rows.map((idx) => {
          const item = this.gridObjemp.getDataItem(idx)
          console.log(item)
     if (item.emp_job != this.job || item.emp_level != this.level) {

      alert("Métier ou Niveai de maitrise ne correspond pas a cet employé")
      updateItem.pme_employe = null
      this.mvgridService.updateItem(updateItem)
    } else {   
          updateItem.pme_employe = item.emp_addr
          updateItem.fname = item.emp_fname
          updateItem.lname = item.emp_lname
          updateItem.job = item.emp_job
          updateItem.level = item.emp_level
          
          this.mvgridService.updateItem(updateItem)
     }
      })
  }
}
angularGridReadyemp(angularGrid: AngularGridInstance) {
  this.angularGridemp = angularGrid
  this.gridObjemp = (angularGrid && angularGrid.slickGrid) || {}
}


prepareGridemp() {
  this.columnDefinitionsemp = [
      {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
      },
      {
          id: "emp_addr",
          name: "Code Employé",
          field: "emp_addr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "emp_fname",
          name: "Nom",
          field: "emp_fname",
          sortable: true,
          width: 80,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "emp_lname",
        name: "Prénom",
        field: "emp_lname",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
    },
    {
      id: "emp_line1",
      name: "Adresse",
      field: "emp_line1",
      sortable: true,
      width: 80,
      filterable: true,
      type: FieldType.string,
  },
  {
    id: "emp_job",
    name: "Métier",
    field: "emp_job",
    sortable: true,
    width: 80,
    filterable: true,
    type: FieldType.string,
},
{
  id: "emp_level",
  name: "Niveau",
  field: "emp_level",
  sortable: true,
  width: 80,
  filterable: true,
  type: FieldType.string,
},
      
  ]

  this.gridOptionsemp = {
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
  this.employeService
      .getAll()
      .subscribe((response: any) => (this.emps = response.data))
}
openemp(content) {
 
  this.prepareGridemp()
  this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChangedprov(e, args) {
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number)
  if (Array.isArray(args.rows) && this.gridObjprov) {
      args.rows.map((idx) => {
          const item = this.gridObjprov.getDataItem(idx)
          console.log(item)
          updateItem.pme_employe = item.vd_addr
          updateItem.fname   = item.address.ad_name
          
          this.mvgridService.updateItem(updateItem)
      })
  }
}


angularGridReadyprov(angularGrid: AngularGridInstance) {
  this.angularGridprov = angularGrid
  this.gridObjprov = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridprov() {
  this.columnDefinitionsprov = [
      {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
      },
      {
          id: "vd_addr",
          name: "code",
          field: "vd_addr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "ad_name",
          name: "Fournisseur",
          field: "address.ad_name",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "ad_phone",
          name: "Numero telephone",
          field: "address.ad_phone",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
  ]

  this.gridOptionsprov = {
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
      dataItemColumnValueExtractor: function getItemColumnValue(
          item,
          column
      ) {
          var val = undefined
          try {
              val = eval("item." + column.field)
          } catch (e) {
              // ignore
          }
          return val
      },
  }

  // fill the dataset with your data
  this.providerService
      .getAll()
      .subscribe((response: any) => (this.providers = response.data))
}
openprov(content) {
  this.prepareGridprov()
  this.modalService.open(content, { size: "lg" })
}

onAlertClose($event) {
  this.hasFormErrors = false
}
}
