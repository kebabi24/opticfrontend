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
import { EmployeService, CodeService } from "../../../../core/erp";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"
const API_URL = environment.apiUrl + "/codes"

@Component({
  selector: 'kt-create-emp-avail',
  templateUrl: './create-emp-avail.component.html',
  styleUrls: ['./create-emp-avail.component.scss']
})
export class CreateEmpAvailComponent implements OnInit {

  empForm: FormGroup;
  row_number;

  isExist = false

  transacts: []
  columnDefinitions4: Column[] = []
  gridOptions4: GridOption = {}
  gridObj4: any
  angularGrid4: AngularGridInstance
  
  dataset: []
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  gridObj: any
  angularGrid: AngularGridInstance
  
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
  httpOptions = this.httpUtils.getHTTPHeaders()
  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService,
    config: NgbDropdownConfig,
    private empFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public  dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private employeService: EmployeService,
    private codeService: CodeService
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

  //create form
  createForm() {
    this.loadingSubject.next(false);
    
    this.empForm = this.empFB.group({
      emp_addr: ["", Validators.required],
      emp_fname: [{ value: "", disabled: true }],
      emp_lname: [{ value: "", disabled: true }],
      emp_line1: [{ value: "", disabled: true }],
      emp_job:   [{ value: "", disabled: true }],
      emp_level: [{ value: "", disabled: true }],
    
    
    
    });
  }


  onChangeCode() {
    this.mvdataset = [];
    const controls = this.empForm.controls
    this.employeService
        .getBy({
              emp_addr: controls.emp_addr.value
        })
        .subscribe((response: any) => {
         // console.log(response.data)
          if (response.data.length == 0) {

            alert("Employé n'existe pas  ")
            controls.emp_addr.setValue(null);
            controls.emp_fname.setValue(null);
            controls.emp_lname.setValue(null);
            controls.emp_line1.setValue(null);
            controls.emp_job.setValue(null);
            controls.emp_level.setValue(null);
            document.getElementById("emp_addr").focus();
          } else {

            controls.emp_fname.setValue(response.data[0].emp_fname || "");
            controls.emp_lname.setValue(response.data[0].emp_lname || "");
            controls.emp_line1.setValue(response.data[0].emp_line1 || "");
            controls.emp_job.setValue(response.data[0].emp_job || "");
            controls.emp_level.setValue(response.data[0].emp_level || "");
            this.employeService
            .getByDet({
                  empd_addr: controls.emp_addr.value
            })
            .subscribe((resp: any) => {
              console.log(resp.data)
              this.details  = resp.data;
           
            
            for (var object = 0; object < this.details.length; object++) {
              const detail = this.details[object];
                  this.mvgridService.addItem(
                    {
                      id: object + 1,
                      empd_type: detail.empd_type,
                      empd_fdate: detail.empd_fdate,
                      empd_ldate: detail.empd_ldate,
                      },
                    { position: "bottom" }
                  );
            
            }

            })
          }
      
     })
  }
  //reste form
  reset() {
    
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
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

    // tslint:disable-next-line:prefer-const
  
    this.addDet(this.mvdataset);


  }

  
  
  addDet( detail: any) {
    let emp = null;
    const controls = this.empForm.controls // chof le champs hada wesh men form rah
    emp = controls.emp_addr.value
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
     
    }
    this.loadingSubject.next(true);
  
    this.employeService
      .addC({ emp,empDetail: detail })
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
            
            this.router.navigateByUrl("/accounting-setting/employe-list")
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
        id: "empd_type",
        name: "Type Congé",
        field: "empd_type",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.singleSelect,

          // We can also add HTML text to be rendered (any bad script will be sanitized) but we have to opt-in, else it will be sanitized
          enableRenderHtml: true,
          collectionAsync:  this.http.get(`${API_URL}/conge`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
       /*   customStructure: {    
            value: 'code_value',
            label: 'code_cmmt',
            optionLabel: 'code_value', // if selected text is too long, we can use option labels instead
            //labelSuffix: 'text',
         },*/
          editorOptions: {
            maxHeight: 400
          }
        },
      },
      
      {
        id: "empd_fdate",
        name: "Date Début",
        field: "empd_fdate",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.dateIso,
                editor: {
          model: Editors.date,
        },
      },
      {
        id: "empd_ldate",
        name: "Date Fin",
        field: "empd_ldate",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.dateIso,
                editor: {
          model: Editors.date,
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
      empd_type: "",
      empd_fdate: null,
      empd_ldate: null,
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
      controls.emp_addr.setValue(item.emp_addr || "");
      controls.emp_fname.setValue(item.emp_fname || "");
      controls.emp_lname.setValue(item.emp_lname || "");
      controls.emp_line1.setValue(item.emp_line1 || "");
      controls.emp_job.setValue(item.emp_job || "");
      controls.emp_level.setValue(item.emp_level || "");

      this.employeService
            .getByDet({
                  empd_addr: item.emp_addr
            })
            .subscribe((resp: any) => {
              console.log(resp.data)
              this.details  = resp.data;
           
            
            for (var object = 0; object < this.details.length; object++) {
              const detail = this.details[object];
                  this.mvgridService.addItem(
                    {
                      id: object + 1,
                      empd_type: detail.empd_type,
                      empd_fdate: detail.empd_fdate,
                      empd_ldate: detail.empd_ldate,
                      },
                    { position: "bottom" }
                  );
            
            }

            })
  

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
  this.employeService
      .getAll()
      .subscribe((response: any) => (this.dataset = response.data))
}
open(content) {
 
  this.prepareGrid()
  this.modalService.open(content, { size: "lg" })
}
onAlertClose($event) {
  this.hasFormErrors = false
}
}
