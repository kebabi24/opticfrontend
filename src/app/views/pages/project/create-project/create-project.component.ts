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
import { round } from 'lodash';

import { BehaviorSubject, Observable } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Project, ProjectService, CustomerService, ProviderService, ItemService, BomService, TaskService, PsService , SaleOrderService, Requisition,
         RequisitionService,SaleOrder, PurchaseOrder, DeviseService} from "../../../../core/erp";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud"
@Component({
  selector: 'kt-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {

 
  projectForm: FormGroup;
  row_number;

  isExist = false

  error = false;

  customers: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;
  
  datatask: [];
  columnDefinitionstask: Column[] = [];
  gridOptionstask: GridOption = {};
  gridObjtask: any;
  angularGridtask: AngularGridInstance;
  
  databom: [];
  columnDefinitionsbom: Column[] = [];
  gridOptionsbom: GridOption = {};
  gridObjbom: any;
  angularGridbom: AngularGridInstance;

  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  providers: [];
  columnDefinitionsvend: Column[] = [];
  gridOptionsvend: GridOption = {};
  gridObjvend: any;
  angularGridvend: AngularGridInstance;
  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];
  sodataset = [];
  reqdataset = [];
  project: Project;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  saleOrder:  SaleOrder;
date: String;
customer: any;
ex_rate1 : any;
ex_rate2 : any;
type: String;
  constructor(
    config: NgbDropdownConfig,
    private projectFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private projectService: ProjectService,
    private taskService: TaskService,
    private customerService: CustomerService,
    private providerService: ProviderService,
    private itemService: ItemService,
    private bomService: BomService,
    private saleOrderService: SaleOrderService,
    private requisitonService: RequisitionService,
    private psService: PsService,
    private deviseService: DeviseService,
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
    this.project = new Project();
    const date = new Date;
    this.projectForm = this.projectFB.group({
      pm_code: [this.project.pm_code, Validators.required],
      pm_desc: [{ value: this.project.pm_desc, disabled: !this.isExist },  Validators.required],
      pm_cust: [{ value: this.project.pm_cust, disabled: !this.isExist }],
      name: [{value:"", disabled: true}],
      pm_amt: [{ value: this.project.pm_amt, disabled: !this.isExist }],
      pm_cost: [{value:0, disabled: true}],
      pm_ord_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      
     
    });
  }


  onChangeCode() {
    this.mvdataset = []
    this.sodataset = []
    const controls = this.projectForm.controls
    this.projectService
        .getBy({
              pm_code: controls.pm_code.value
        })
        .subscribe((response: any) => {
         
            if (response.data.project ) {
                this.isExist = true
              
            } else {
                controls.pm_desc.enable()
                controls.pm_cust.enable()
                controls.pm_amt.enable()
              
                
            }
     })
  }
  //reste form
  reset() {
    this.isExist = false 
    this.project = new Project();
    this.mvdataset = [];
    this.sodataset = [];
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.projectForm.controls;
    /** check form */
    if (this.projectForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    // tslint:disable-next-line:prefer-const
    let project = this.prepareproject();
    for (let data of this.mvdataset) {
      delete data.id;
      delete data.cmvid;
      
    }
    this.addproject(project, this.mvdataset);
  }
  /**
   * Returns object for saving
   */
  prepareproject(): Project {
    const controls = this.projectForm.controls;
    const _project = new Project();
    _project.pm_code = controls.pm_code.value;
    _project.pm_desc = controls.pm_desc.value;
    _project.pm_cust = controls.pm_cust.value;
    _project.pm_amt = controls.pm_amt.value;
    _project.pm_cost = controls.pm_cost.value;
    return _project;
  }
  /**
   * Add code
   *
   * @param _project: ProjectModel
   */
  addproject(_project: Project, details: any) {
    this.sodataset = [];
    for (let data of details) {
      this.itemService.getByOne({pt_part: data.pmd_part }).subscribe((resp:any)=>{

        if (resp.data.pt_phantom) {
          this.type = 'M'
        
        } else {
          this.type = null
        }            
        this.sodataset.push({
          sod_line: data.pmd_line,
          sod_part: resp.data.pt_part,
          sod_um: resp.data.pt_um,
          sod__chr01:  data.pmd_task,
          sod_qty_ord: 1,
          sod_desc: resp.data.pt_desc1 ,
          sod_site:resp.data.pt_site, 
          sod_loc: resp.data.pt_loc,
          sod_um_conv:1, 
          sod_type: this.type,
          sod_price: resp.data.pt_price, 
          sod_disc_pct:0, 
          sod_tax_code:resp.data.pt_taxc, 
          sod_taxc: resp.data.taxe.tx2_tax_pct, 
          sod_taxable: resp.data.pt_taxable
        })
     
      })
      
    }
    


    this.loadingSubject.next(true);
    this.projectService
      .add({ Project: _project, ProjectDetails: details })
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
          let so = this.prepareSo();
          console.log("so", so)
          this.addSo(so, this.sodataset);
          this.addReq(details);
          
          this.layoutUtilsService.showActionNotification(
            "Ajout avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
         
          this.loadingSubject.next(false);
          this.reset();
          this.router.navigateByUrl("/project/create-project");
          this.reset();
        }
      );


     
    

    
  }

  prepareReq(): any {
    const controls = this.projectForm.controls
    const _req = new Requisition()
    _req.rqm_category =  "RQ"
      _req.rqm_nbr=  controls.rqm_nbr.value
      _req.rqm_vend =  controls.rqm_vend.value
      _req.rqm_req_date=  controls.pm_ord_date.value
      ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}`
      : null;
      _req.rqm_need_date=  controls.pm_ord_date.value
      ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}`
      : null;
      //_req.rqm_status=  controls.rqm_status.value
      _req.rqm_open= true
      _req.rqm_aprv_stat = '0'
    return _req
}

  prepareSo(): any {
    const controls = this.projectForm.controls;
    const _so = new SaleOrder();
    const date = new Date()

    
            _so.so_category =  "SO"
            _so.so_cust = controls.pm_cust.value;
            _so.so_ord_date = controls.pm_ord_date.value
              ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}`
              : null;
            _so.so_due_date = controls.pm_ord_date.value
              ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}`
              : null;

            _so.so_po = controls.pm_code.value;
            _so.so_amt = controls.pm_amt.value;
            _so.so_cr_terms = this.customer.cm_cr_terms;
            _so.so_curr = this.customer.cm_curr 
            _so.so_taxable = this.customer.address.ad_taxable 
            _so.so_taxc = this.customer.address.ad_taxc 
            _so.so_ex_rate = this.ex_rate1 
            _so.so_ex_rate2 = this.ex_rate2

        
         
      
      
    return _so;



  
  }
  /**
   * Add po
   *
   * @param _so: so
   */
  addSo(_so: any, sodetail: any) {
    
     
    

    this.loadingSubject.next(true);
    let so = null;
    
    this.saleOrderService
      .add({ saleOrder: _so, saleOrderDetail: sodetail })
      .subscribe(
        (reponse: any) => (so = reponse.data),
        (error) => {
          this.layoutUtilsService.showActionNotification(
            "Erreur verifier les informations",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.loadingSubject.next(false);
        }
      );
  }

  addReq(detail:any) {
    const controls = this.projectForm.controls;
    for (let data of detail) {
    if ( data.pmd_vend != "" &&  data.pmd_vend != null) {  
      this.reqdataset = []
      const _req = new Requisition()
      _req.rqm_category =  "RQ"
        _req.rqm_vend =  data.pmd_vend
        _req.rqm_req_date=  controls.pm_ord_date.value
        ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}`
        : null;
        _req.rqm_need_date=  controls.pm_ord_date.value
        ? `${controls.pm_ord_date.value.year}/${controls.pm_ord_date.value.month}/${controls.pm_ord_date.value.day}`
        : null;
        //_req.rqm_status=  controls.rqm_status.value
        _req.rqm_open= true
        _req.rqm_aprv_stat = '0'

      this.reqdataset.push({
        rqd_line: data.pmd_line,
        rqd_part: data.pmd_part,
        rqd_um: data.pmd_um,
        
        rqd_req_qty: 1,
             });
             
    
    this.loadingSubject.next(true)
    this.requisitonService.add({ requisition: _req, requisitionDetail: this.reqdataset }).subscribe(
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
            //this.router.navigateByUrl("/")
        }
    )
    }
  }
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
            this.calculatetot();
          }
        },
      },
      {
        id: "pmd_line",
        name: "Ligne",
        field: "pmd_line",
        minWidth: 30,
        maxWidth: 30,
        selectable: true,
      },
      {
        id: "pmd_task",
        name: "Code Instruction",
        field: "pmd_task",
        sortable: true,
        width: 80,
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
            "openTasksGrid"
            ) as HTMLElement;
            element.click();
        },
    },    
      {
        id: "desc",
        name: "Designation",
        field: "desc",
        sortable: true,
        width: 120,
        filterable: false,
        type: FieldType.string,
       
      },
      {
        id: "pmd_um",
        name: "UM",
        field: "pmd_um",
        sortable: true,
        width: 30,
        filterable: false,
        type: FieldType.string,
       
      },
      {
        id: "pmd_cost",
        name: "Cout",
        field: "pmd_cost",
        sortable: true,
        width: 30,
        filterable: false,
        type: FieldType.float,
       
      },
      
      {
        id: "pmd_qty",
        name: "QTE",
        field: "pmd_qty",
        sortable: true,
        width: 30,
        filterable: false,
        type: FieldType.float,
       
      },
      {
        id: "pmd_price",
        name: "Prix",
        field: "pmd_price",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
       
      },
      
      {
        id: "pmd_bom_code",
        name: "Code Nomenclature",
        field: "pmd_bom_code",
        sortable: true,
        width: 80,
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
            "openBomsGrid"
            ) as HTMLElement;
            element.click();
        },
    },    
    {
      id: "bomcout",
      name: "Cout Nomenclature",
      field: "bomcout",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.float,
    },
    

      {
        id: "pmd_start",
        name: "Date Début",
        field: "pmd_start",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.dateIso,
        editor: {
          model: Editors.date,
        },
      },
      
      {
        id: "pmd_end",
        name: "Date Fin",
        field: "pmd_end",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.dateIso,
        editor: {
          model: Editors.date,
        },
      },
      {
        id: "pmd_part",
        name: "Code Service",
        field: "pmd_part",
        sortable: true,
        width: 50,
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
          this.row_number = args.row;
          let element: HTMLElement = document.getElementById(
            "openItemsGrid"
          ) as HTMLElement;
          element.click();
        },
      },
      {
        id: "descr",
        name: "Designation",
        field: "descr",
        sortable: true,
        width: 120,
        filterable: false,
        type: FieldType.string,
       
      },
      {
        id: "pmd_um",
        name: "UM",
        field: "pmd_um",
        sortable: true,
        width: 30,
        filterable: false,
        type: FieldType.string,
       
      },

      {
        id: "pmd_vend",
        name: "Code Fournisseur",
        field: "pmd_vend",
        sortable: true,
        width: 50,
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
          this.row_number = args.row;
          let element: HTMLElement = document.getElementById(
            "openVendsGrid"
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
      pmd_line: newId,
      pmd_task : "",
      desc: "",
      cout: 0,
      pmd_bom: "",
      bomcout : 0,
      pmd_start: null,
      pmd_end: null,
      pmd_part: "",
      descr:"",
      pmd_vend: "",
    };
    this.mvgridService.addItem(newItem, { position: "bottom" });
  }
onAlertClose($event) {
  this.hasFormErrors = false
}





onChangeCust() {
  const controls = this.projectForm.controls; // chof le champs hada wesh men form rah
  const cm_addr = controls.pm_cust.value;
  
  this.customerService.getBy({ cm_addr }).subscribe(
    (res: any) => {
      console.log(res);
      const { data } = res;

      if (!data) {
        this.layoutUtilsService.showActionNotification(
          "ce client n'existe pas!",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.error = true;
        document.getElementById("cust").focus();
      } else {
        this.error = false;
        controls.pm_cust.setValue(data.cm_addr || "");
        controls.name.setValue(data.address.ad_name || "");
        this.customerService.getBy({ cm_addr : controls.pm_cust.value  }).subscribe(
          (res: any) => {
            console.log(res);
            const { data } = res;
    
            if (data) {
    
            
             this.customer = data
              
              
              if (data.cm_curr == 'DA'){
               this.ex_rate1 = 1 
               this.ex_rate2 = 1
    
              } else {
    
              this.deviseService.getExRate({exr_curr1:data.cm_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
                
                 this.ex_rate1 = res.data.exr_rate
                 this.ex_rate2 = res.data.exr_rate2
                })
    
                }
    
            }
             
          }
          
        );


      }
       
    },
    (error) => console.log(error)
  );
}

handleSelectedRowsChanged2(e, args) {
  
  const controls = this.projectForm.controls;
  if (Array.isArray(args.rows) && this.gridObj2) {
    args.rows.map((idx) => {
      const item = this.gridObj2.getDataItem(idx);
      
      controls.pm_cust.setValue(item.cm_addr || "");
      controls.name.setValue(item.address.ad_name || "");
      
      this.customerService.getBy({ cm_addr : controls.pm_cust.value  }).subscribe(
        (res: any) => {
          console.log(res);
          const { data } = res;
  
          if (data) {
  
          
           this.customer = data
            
            
            if (data.cm_curr == 'DA'){
             this.ex_rate1 = 1 
             this.ex_rate2 = 1
  
            } else {
  
            this.deviseService.getExRate({exr_curr1:data.cm_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
              
               this.ex_rate1 = res.data.exr_rate
               this.ex_rate2 = res.data.exr_rate2
              })
  
              }
  
          }
           
        }
        
      );

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
      id: "cm_addr",
      name: "code",
      field: "cm_addr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_name",
      name: "Client",
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
    {
      id: "ad_taxable",
      name: "A Taxer",
      field: "address.ad_taxable",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxc",
      name: "Taxe",
      field: "address.ad_taxc",
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
    dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
      var val = undefined;
      try {
        val = eval("item." + column.field);
      } catch (e) {
        // ignore
      }
      return val;
    },
  };

  // fill the dataset with your data
  this.customerService
    .getAll()
    .subscribe((response: any) => (this.customers = response.data));
}
open2(content) {
  this.prepareGrid2();
  this.modalService.open(content, { size: "lg" });
}

handleSelectedRowsChangedtask(e, args) {
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjtask) {
    args.rows.map((idx) => {
      const item = this.gridObjtask.getDataItem(idx);
          
      
      
     
   
      this.taskService
        .getBy({
              tk_code: item.tk_code
        })
        .subscribe((response: any) => {
          console.log(response.data, response.data.details.length)
          updateItem.pmd_task = item.tk_code;
          updateItem.desc = item.tk_desc;
          updateItem.pmd_um = item.tk_um;
          updateItem.pmd_qty = Number(response.data.details.length);
          updateItem.pmd_price = item.tk_price * Number(response.data.details.length);
          this.taskService
          .getCost({
                tk_code: item.tk_code
               
          })
          .subscribe((response: any) => {
          
            updateItem.pmd_cost = Number(response.data);
        
            this.mvgridService.updateItem(updateItem);
            this.calculatetot();

          })

     })



});

  }
}
angularGridReadytask(angularGrid: AngularGridInstance) {
  this.angularGridtask = angularGrid;
  this.gridObjtask = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridtask() {
  this.columnDefinitionstask = [
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
      id: "tk_code",
      name: "Code",
      field: "tk_code",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "tk_desc",
      name: "Designation",
      field: "tk_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    
  ];

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
  this.taskService
    .getAll()
    .subscribe((response: any) => (this.datatask = response.data));
}
opentask(contenttask) {
  this.prepareGridtask();
  this.modalService.open(contenttask, { size: "lg" });
}


handleSelectedRowsChangedbom(e, args) {
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjbom) {
    args.rows.map((idx) => {
      const item = this.gridObjbom.getDataItem(idx);
          
      updateItem.pmd_bom = item.bom_parent;
      
      
      this.mvgridService.updateItem(updateItem);
      this.psService
      .getPrice({
            ps_parent: item.bom_parent
      })
      .subscribe((response: any) => {
        console.log(response.data, "here")
        updateItem.pmd_bom_code = item.bom_parent;
        
        updateItem.bomcout = response.data;
        this.mvgridService.updateItem(updateItem);
        this.calculatetot();
   })
   
});

  }
}
angularGridReadybom(angularGrid: AngularGridInstance) {
  this.angularGridbom = angularGrid;
  this.gridObjbom = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridbom() {
  this.columnDefinitionsbom = [
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
      id: "bom_parent",
      name: "Code",
      field: "bom_parent",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "bom_desc",
      name: "Designation",
      field: "bom_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    
  ];

  this.gridOptionsbom = {
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
  this.bomService
    .getAll()
    .subscribe((response: any) => (this.databom = response.data));
}
openbom(contentbom) {
  this.prepareGridbom();
  this.modalService.open(contentbom, { size: "lg" });
}


handleSelectedRowsChanged4(e, args) {
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  
  console.log(updateItem.pmd_line)
  if (Array.isArray(args.rows) && this.gridObj4) {
    args.rows.map((idx) => {

          
      const item = this.gridObj4.getDataItem(idx);
            updateItem.pmd_part = item.pt_part;
            updateItem.pmd_um = item.pt_um;
            updateItem.descr = item.pt_desc1;
            this.mvgridService.updateItem(updateItem);
           
          
         
    })   
  }
}
angularGridReady4(angularGrid: AngularGridInstance) {
  this.angularGrid4 = angularGrid;
  this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {};
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
      name: "UM",
      field: "pt_um",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

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
  };

  // fill the dataset with your data
  this.itemService
    .getAll()
    .subscribe((response: any) => (this.items = response.data));
}
open4(content) {
  this.prepareGrid4();
  this.modalService.open(content, { size: "lg" });
}






handleSelectedRowsChangedvend(e, args) {
  let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
  
  if (Array.isArray(args.rows) && this.gridObjvend) {
    args.rows.map((idx) => {

          
      const item = this.gridObjvend.getDataItem(idx);
            updateItem.pmd_vend = item.vd_addr;
            this.mvgridService.updateItem(updateItem);
         
    })   
  }
}

angularGridReadyvend(angularGrid: AngularGridInstance) {
  this.angularGridvend = angularGrid;
  this.gridObjvend = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridvend() {
  this.columnDefinitionsvend = [
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
    {
      id: "ad_taxable",
      name: "A Taxer",
      field: "address.ad_taxable",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxc",
      name: "Taxe",
      field: "address.ad_taxc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionsvend = {
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
    dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
      var val = undefined;
      try {
        val = eval("item." + column.field);
      } catch (e) {
        // ignore
      }
      return val;
    },
  };

  // fill the dataset with your data
  this.providerService
    .getAll()
    .subscribe((response: any) => (this.providers = response.data));
}
openvend(contentvend) {
  this.prepareGridvend();
  this.modalService.open(contentvend, { size: "lg" });
}


calculatetot(){
  const controls = this.projectForm.controls 
   let tcost = 0
   for (var i = 0; i < this.mvdataset.length; i++) {
     tcost += round((this.mvdataset[i].pmd_cost +  this.mvdataset[i].bomcout),2)


}
controls.pm_cost.setValue(tcost.toFixed(2));
}
}