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
import { TaskService, Task, CodeService , JobService,ToolService} from "../../../../core/erp";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud"

@Component({
  selector: 'kt-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit {

  
  taskForm: FormGroup;
  row_number;

  isExist = false

  
  data: [];
  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;
  error = false;

  
  datajob: [];
  columnDefinitionsjob: Column[] = [];
  gridOptionsjob: GridOption = {};
  gridObjjob: any;
  angularGridjob: AngularGridInstance;

  datalevel: [];
  columnDefinitionslevel: Column[] = [];
  gridOptionslevel: GridOption = {};
  gridObjlevel: any;
  angularGridlevel: AngularGridInstance;

  datatool: [];
  columnDefinitionstool: Column[] = [];
  gridOptionstool: GridOption = {};
  gridObjtool: any;
  angularGridtool: AngularGridInstance;

  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];
  task: Task;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;

  constructor(
    config: NgbDropdownConfig,
    private taskFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public  dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private taskService: TaskService,
    private codeService: CodeService,
    private jobService: JobService,
    private toolService: ToolService,
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
    this.createForm();
    this.initmvGrid();
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.task = new Task();
    this.taskForm = this.taskFB.group({
      tk_code: [this.task.tk_code, Validators.required],
      tk_desc: [{ value: this.task.tk_desc, disabled: !this.isExist },  Validators.required],
      tk_um: [{ value: this.task.tk_um, disabled: !this.isExist },  Validators.required],
      tk_price: [{ value: this.task.tk_price, disabled: !this.isExist },  Validators.required],

     
    });
  }


  onChangeCode() {
    const controls = this.taskForm.controls
    this.taskService
        .getBy({
              tk_code: controls.tk_code.value
        })
        .subscribe((response: any) => {
         
            if (response.data.task ) {
                this.isExist = true
              
            } else {
                controls.tk_desc.enable()
                controls.tk_um.enable()
                controls.tk_price.enable()
              
                
            }
     })
  }
  changeUm() {
    const controls = this.taskForm.controls
    this.codeService.getBy({ code_fldname : "pt_um", code_value  : controls.tk_um.value }).subscribe(
      (res: any) => {
        
        
        console.log(res.data.length)
        if (res.data.length == 0) {
          this.layoutUtilsService.showActionNotification(
            "cette unite de mesure n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
        } else {
          this.error = false;
        }
      },
      (error) => console.log(error)
    );
  }

  //reste form
  reset() {
    this.task = new Task();
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.taskForm.controls;
    /** check form */
    if (this.taskForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    // tslint:disable-next-line:prefer-const
    let task = this.preparetask();
    for (let data of this.mvdataset) {
      delete data.id;
      delete data.cmvid;
    }
    this.addtask(task, this.mvdataset);
  }
  /**
   * Returns object for saving
   */
  preparetask(): Task {
    const controls = this.taskForm.controls;
    const _task = new Task();
    _task.tk_code = controls.tk_code.value;
    _task.tk_desc = controls.tk_desc.value;
    _task.tk_um = controls.tk_um.value;
    _task.tk_price = controls.tk_price.value;
    return _task;
  }
  /**
   * Add code
   *
   * @param _task: TaskModel
   */
  addtask(_task: Task, details: any) {
    this.loadingSubject.next(true);
    this.taskService
      .add({ Task: _task, TaskDetails: details })
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
          this.loadingSubject.next(false);
          this.reset();
          this.router.navigateByUrl("/task/create-task");
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
        id: "tkd_nbr",
        name: "Code Tache",
        field: "tkd_nbr",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      
      {
        id: "tkd_desc",
        name: "Description",
        field: "tkd_desc",
        sortable: true,
        width: 200,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },

      {
        id: "tkd_job",
        name: "Métier",
        field: "tkd_job",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvidl",
        field: "cmvidl",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
            this.row_number = args.row;
            let element: HTMLElement = document.getElementById(
            "openJobsGrid"
            ) as HTMLElement;
            element.click();
        },
      },    
      {
        id: "tkd_level",
        name: "Maitrise",
        field: "tkd_level",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvidl",
        field: "cmvidl",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
            this.row_number = args.row;
            let element: HTMLElement = document.getElementById(
            "openLevelsGrid"
            ) as HTMLElement;
            element.click();
        },
      },    
      {
        id: "tkd_duration",
        name: "Durée",
        field: "tkd_duration",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 }
        },
      },
      {
        id: "tkd_took",
        name: "Liste Outil",
        field: "tkd_tool",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvidl",
        field: "cmvidl",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
            this.row_number = args.row;
            let element: HTMLElement = document.getElementById(
            "openToolsGrid"
            ) as HTMLElement;
            element.click();
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
      tkd_nbr : "",
      tkd_desc: "",
      tkd_qty: 0,
    };
    this.mvgridService.addItem(newItem, { position: "bottom" });
  }



  handleSelectedRowsChanged3(e, args) {
    const controls = this.taskForm.controls;
       if (Array.isArray(args.rows) && this.gridObj3) {
      args.rows.map((idx) => {
        const item = this.gridObj3.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
            controls.tk_um.setValue(item.code_value || "");
    
      });
       }
  }



  angularGridReady3(angularGrid: AngularGridInstance) {
    this.angularGrid3 = angularGrid;
    this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {};
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
    ];

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
      checkboxSelector: {},
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };

    // fill the dataset with your data
    this.codeService
      .getBy({ code_fldname: "pt_um" })
      .subscribe((response: any) => (this.data = response.data));
  }
  open3(content) {
    
    this.prepareGrid3();
    this.modalService.open(content, { size: "lg" });
  }


onAlertClose($event) {
  this.hasFormErrors = false
}





handleSelectedRowsChangedlevel(e, args) {
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjlevel) {
    args.rows.map((idx) => {
      const item = this.gridObjlevel.getDataItem(idx);
    console.log(item)
          updateItem.tkd_level = item.jbd_level;
          
          this.mvgridService.updateItem(updateItem);
         
    
});

  }
}
angularGridReadylevel(angularGrid: AngularGridInstance) {
  this.angularGridlevel = angularGrid;
  this.gridObjlevel = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridlevel() {
  this.columnDefinitionslevel = [
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
      type: FieldType.float,
    },
    
    
  ];

  this.gridOptionslevel = {
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
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  
  // fill the dataset with your data
  this.jobService
    .getByDet({jbd_code: updateItem.tkd_job})
    .subscribe((response: any) => (this.datalevel = response.data));
}
openlevel(content) {
  this.prepareGridlevel();
  this.modalService.open(content, { size: "lg" });
}



handleSelectedRowsChangedjob(e, args) {
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjjob) {
    args.rows.map((idx) => {
      const item = this.gridObjjob.getDataItem(idx);
    console.log(item)
          updateItem.tkd_job = item.jb_code;
          
          this.mvgridService.updateItem(updateItem);
         
    
});

  }
}
angularGridReadyjob(angularGrid: AngularGridInstance) {
  this.angularGridjob = angularGrid;
  this.gridObjjob = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridjob() {
  this.columnDefinitionsjob = [
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
      id: "jb_code",
      name: "Code",
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

  this.gridOptionsjob = {
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
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  
  // fill the dataset with your data
  this.jobService
    .getAll()
    .subscribe((response: any) => (this.datajob = response.data));
}
openjob(contenttask) {
  this.prepareGridjob();
  this.modalService.open(contenttask, { size: "lg" });
}

handleSelectedRowsChangedtool(e, args) {
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjtool) {
    args.rows.map((idx) => {
      const item = this.gridObjtool.getDataItem(idx);
    console.log(item)
          updateItem.tkd_tool = item.to_code;
          
          this.mvgridService.updateItem(updateItem);
         
    
});

  }
}
angularGridReadytool(angularGrid: AngularGridInstance) {
  this.angularGridtool = angularGrid;
  this.gridObjtool = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridtool() {
  this.columnDefinitionstool = [
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
      id: "to_code",
      name: "Code Liste",
      field: "to_code",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "to_desc",
      name: "Designation",
      field: "to_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    }, 
    
  ];

  this.gridOptionstool = {
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
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  
  // fill the dataset with your data
  this.toolService
    .getAll()
    .subscribe((response: any) => (this.datatool = response.data));
}
opentool(content) {
  this.prepareGridtool();
  this.modalService.open(content, { size: "lg" });
}
}
