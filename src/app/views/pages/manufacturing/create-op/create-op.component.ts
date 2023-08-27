import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  EditorValidator,
  EditorArgs,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators, NgControlStatus } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
// Layout
import {
  SubheaderService,
  LayoutConfigService,
} from "../../../../core/_base/layout";
// CRUD
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import {
  ItemService,
  AddressService,
  TaxeService,
  VendorProposal,
  OperationHistory,
  OperationHistoryService,
  WorkCenterService,
  SiteService,
  CostSimulationService,
  LocationDetailService,
  CodeService,
  InventoryStatusService,
  MesureService,
  SequenceService,
  WorkOrderService,
  WorkOrderDetailService,
  ReasonService,
  WoroutingService,
 
} from "../../../../core/erp";
import { any } from "@amcharts/amcharts4/.internal/core/utils/Array";

const statusValidator: EditorValidator = (value: any, args: EditorArgs) => {
  // you can get the Editor Args which can be helpful, e.g. we can get the Translate Service from it
  const grid = args && args.grid;
  const gridOptions = (grid && grid.getOptions) ? grid.getOptions() : {};
  const translate = gridOptions.i18n;

  // to get the editor object, you'll need to use "internalColumnEditor"
  // don't use "editor" property since that one is what SlickGrid uses internally by it's editor factory
  const columnEditor = args && args.column && args.column.internalColumnEditor;

  if (value == null || value == undefined || !value.length) {
    return { valid: false, msg: 'This is a required field' };
  } 
  return { valid: true, msg: '' };
};
const myCustomTimeFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
   `<div class="time" ></div>` ;


@Component({
  selector: 'kt-create-op',
  templateUrl: './create-op.component.html',
  styleUrls: ['./create-op.component.scss']
})
export class CreateOpComponent implements OnInit {

  operationHistory: OperationHistory;
  opForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];


  angularGriddwn: AngularGridInstance; 
  griddwn: any;
  gridServicedwn: GridService;
  dataViewdwn: any;
  columnDefinitionsdwn: Column[];
  gridOptionsdwn: GridOption;
  dwndataset : any[];

  angularGridrjct: AngularGridInstance; 
  gridrjct: any;
  gridServicerjct: GridService;
  dataViewrjct: any;
  columnDefinitionsrjct: Column[];
  gridOptionsrjct: GridOption;
  rjctdataset : any[];

  user
  
  alertWarning: any;
 
 

  wos: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  items: [];
  columnDefinitions5: Column[] = [];
  gridOptions5: GridOption = {};
  gridObj5: any;
  angularGrid5: AngularGridInstance;

  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;

  datawkctr: [];
  columnDefinitionswkctr: Column[] = [];
  gridOptionswkctr: GridOption = {};
  gridObjwkctr: any;
  angularGridwkctr: AngularGridInstance;
 
  datamch: [];
  columnDefinitionsmch: Column[] = [];
  gridOptionsmch: GridOption = {};
  gridObjmch: any;
  angularGridmch: AngularGridInstance;

  data: [];
  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;
  selectedField = "";
  fieldcode = "";
  msg: String;
  fldname: String;

  datarsn: [];
  columnDefinitionsrsn: Column[] = [];
  gridOptionsrsn: GridOption = {};
  gridObjrsn: any;
  angularGridrsn: AngularGridInstance;

  datarejct: [];
  columnDefinitionsrejct: Column[] = [];
  gridOptionsrejct: GridOption = {};
  gridObjrejct: any;
  angularGridrejct: AngularGridInstance;

  row_number;
  message = "";
  detail;
  woServer;
 
  constructor(
    config: NgbDropdownConfig,
    private opFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private operationHistoryService: OperationHistoryService,
    private sctService: CostSimulationService,  
    private itemsService: ItemService,
    private workCenterService: WorkCenterService,
    private codeService: CodeService,
    private inventoryStatusService: InventoryStatusService,
    private siteService: SiteService,
    private mesureService: MesureService,
    private addressService: AddressService,
    private sequenceService: SequenceService,
    private workOrderService: WorkOrderService,
    private workOrderDetailService: WorkOrderDetailService,
    private reasonService: ReasonService,
    private locationDetailService: LocationDetailService,
    private woroutingService: WoroutingService,

  ) {
    config.autoClose = true;
    this.initGrid();
    this.initGriddwn();
    this.initGridrjct();
  }
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  initGrid() {
    this.columnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.angularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      },

      {
        id: "op_line",
        name: "Ligne",
        field: "op_line",
        minWidth: 50,
        maxWidth: 50,
        selectable: true,
      },
      
      {
        id: "op_wo_lot",
        name: "Id OF",
        field: "op_wo_lot",
        minWidth: 80,
        maxWidth: 80,
        selectable: true,
        
        editor: {
          model: Editors.text,
          required: true,
          validator: statusValidator,

        },
        
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.op_wo_lot)
          const controls = this.opForm.controls;
                                                                   
          this.woroutingService.getBy({wr_lot: Number(args.dataContext.op_wo_lot) , wr_wkctr: controls.op_wkctr.value, wr_mch: controls.op_mch.value, wr_status : "R" }).subscribe((resp:any)=>{
              console.log(resp.data)
            if (resp.data.length > 0) {
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , op_wo_nbr: resp.data[0].wr_nbr, op_part: resp.data[0].wr_part,  })
          }


          else {
            alert("ID OF  N'existe pas")
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , op_wo_lot: null })
          }
          
          });

          
         
        }
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
        id: "op_wo_nbr",
        name: "N° OF",
        field: "op_wo_nbr",
        sortable: true,
        width: 50,
        filterable: false,
        
      },
      {
        id: "op_part",
        name: "Article",
        field: "op_part",
        sortable: true,
        width: 50,
        filterable: false,
        
      },


      {
        id: "op_wo_op",
        name: "Opération",
        field: "op_wo_op",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.integer,
          required: true,
          
          
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.op_wo_lot)
          const controls = this.opForm.controls;
                                                                   
          this.woroutingService.getBy({wr_lot: Number(args.dataContext.op_wo_lot) , wr_wkctr: controls.op_wkctr.value, wr_mch: controls.op_mch.value, wr_status : "R" , wr_op: args.dataContext.op_wo_op}).subscribe((resp:any)=>{
              console.log(resp.data)
            if (resp.data.length > 0) {
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , op_wo_op: resp.data[0].wr_op, })
          }


          else {
            alert("OP  N'existe pas")
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , op_wo_op: null })
          }
          
          });

          
         
        }
      },
      
      {
          id: "op_qty_comp",
          name: "QTE Terminée",
          field: "op_qty_comp",
          sortable: true,
          width: 80,
          filterable: false,
          type: FieldType.float,
          editor: {
              model: Editors.float,
              params: { decimalPlaces: 2 },
              required: true,
              
              
          },
      
          
      },
      
      {
        id: "op_act_setup",
        name: "Réglage",
        field: "op_act_setup",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        editor: {
            model: Editors.float,
            params: { decimalPlaces: 2 },
            required: true,
            
            
        },
    
        
    },
    
        
      {
        id: "debut",
        name: "Début",
        field: "debut",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        editor: {
            model: Editors.text,
            required: true,
            
            
        },

        onCellChange: (e: Event, args: OnEventArgs) => {

       
          let time = args.dataContext.debut
       
          if (time.substring(0,2) > 24) {
            alert("Heure ne doit pas depassé 24")
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , debut: "HH:MM" })
          }
          if (time.substring(3,5) > 59) {
            alert("Minute ne doit pas depassé 59")
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , debut: "HH:MM" })
          }
        }
        
    },
 
    {
      id: "fin",
      name: "Fin",
      field: "fin",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.string,
      editor: {
          model: Editors.text,
         
          required: true,
          
          
      },
      onCellChange: (e: Event, args: OnEventArgs) => {

       
        let time = args.dataContext.fin
     
        if (time.substring(0,2) > 24) {
          alert("Heure ne doit pas depassé 24")
          this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , fin: "HH:MM" })
        }
        if (time.substring(3,5) > 59) {
          alert("Minute ne doit pas depassé 59")
          this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , fin: "HH:MM" })
        }
      }
     
      
  },
  {
    id: "op_comment",
    name: "Remarque",
    field: "op_comment",
    sortable: true,
    width: 50,
    filterable: false,
    editor: {
      model: Editors.longText,

    }
  },

    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      formatterOptions: {
        
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
    };

    this.dataset = [];
  }



  gridReadydwn(angularGrid: AngularGridInstance) {
    this.angularGriddwn = angularGrid;
    this.dataViewdwn = angularGrid.dataView;
    this.griddwn = angularGrid.slickGrid;
    this.gridServicedwn = angularGrid.gridService;
  }

  initGriddwn() {
    this.columnDefinitionsdwn = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.angularGriddwn.gridService.deleteItem(args.dataContext);
          }
        },
      },
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 50,
        maxWidth: 50,
    },
      
    {
      id: "op_rsn_down",
      name: "Cause",
      field: "op_rsn_down",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
      filterable: false,
      editor: {
        model: Editors.text,
  
      }
      
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
          "openRsnGrid"
        ) as HTMLElement;
        element.click();
      },
    },
    {
      id: "desc_cause",
      name: "Description",
      field: "desc_cause",
      sortable: true,
      minWidth: 160,
      maxWidth: 160,
      filterable: false,
      
    },
    {
      id: "debut_cause",
      name: "Debut",
      field: "debut_cause",
      sortable: true,
      minWidth: 120,
      maxWidth: 120,
      filterable: false,
      editor: {
        model: Editors.text,
        required: true,
        
        
    },

    onCellChange: (e: Event, args: OnEventArgs) => {

       
      let time = args.dataContext.debut_cause
   
      if (time.substring(0,2) > 24) {
        alert("Heure ne doit pas depassé 24")
        this.gridServicedwn.updateItemById(args.dataContext.id,{...args.dataContext , debut_cause: "HH:MM" })
      }
      if (time.substring(3,5) > 59) {
        alert("Minute ne doit pas depassé 59")
        this.gridServicedwn.updateItemById(args.dataContext.id,{...args.dataContext , debut_cause: "HH:MM" })
      }
    }
   
    },

    {
      id: "fin_cause",
      name: "Fin",
      field: "fin_cause",
      sortable: true,
      minWidth: 120,
      maxWidth: 120,
      filterable: false,
      editor: {
        model: Editors.text,
        //params: { decimalPlaces: 2 },
        required: true,
        
        
    },
    onCellChange: (e: Event, args: OnEventArgs) => {

       
      let time = args.dataContext.fin_cause
   
      if (time.substring(0,2) > 24) {
        alert("Heure ne doit pas depassé 24")
        this.gridServicedwn.updateItemById(args.dataContext.id,{...args.dataContext , fin_cause: "HH:MM" })
      }
      if (time.substring(3,5) > 59) {
        alert("Minute ne doit pas depassé 59")
        this.gridServicedwn.updateItemById(args.dataContext.id,{...args.dataContext , fin_cause: "HH:MM" })
      }
    }
   
      
    },
    {
      id: "op_comment",
      name: "Remarque",
      field: "op_comment",
      sortable: true,
      width: 80,
      filterable: false,
      editor: {
        model: Editors.longText,
  
      }
    },
      
    ];

    this.gridOptionsdwn = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableSorting: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableAutoResize: false,
    
      
      formatterOptions: {
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
     /* presets: {
        sorters: [
          { columnId: 'prh_line', direction: 'ASC' }
        ],
      },*/
    };

    this.dwndataset = [];
  }



  gridReadyrjct(angularGrid: AngularGridInstance) {
    this.angularGridrjct = angularGrid;
    this.dataViewrjct = angularGrid.dataView;
    this.gridrjct = angularGrid.slickGrid;
    this.gridServicerjct = angularGrid.gridService;
  }

  initGridrjct() {
    this.columnDefinitionsrjct = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.angularGridrjct.gridService.deleteItem(args.dataContext);
          }
        },
      },
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 50,
        maxWidth: 50,
    },
      
    
    {
      id: "op_rsn_rjct",
      name: "Cause",
      field: "op_rsn_rjct",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
      filterable: false,
      editor: {
        model: Editors.text,
  
      }
      
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
          "openRsnsGrid"
        ) as HTMLElement;
        element.click();
      },
    },
    {
      id: "desc_cause_rjct",
      name: "Description",
      field: "desc_cause_rjct",
      sortable: true,
      minWidth: 160,
      maxWidth: 160,
      filterable: false,
      
    },
    
    {
      id: "op_qty_rjct",
      name: "QTE Terminée",
      field: "op_qty_rjct",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.float,
      editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
          required: true,
          
          
      },
  
      
  },

    {
      id: "op_wo_lot",
      name: "Id OF",
      field: "op_wo_lot",
      minWidth: 50,
      maxWidth: 50,
      selectable: true,
      
      editor: {
        model: Editors.text,
        required: true,
        validator: statusValidator,

      },
      
      onCellChange: (e: Event, args: OnEventArgs) => {
        console.log(args.dataContext.op_wo_lot)
        this.workOrderService.getByOne({id: Number(args.dataContext.op_wo_lot) }).subscribe((resp:any)=>{

          if (resp.data) {
                  this.gridServicerjct.updateItemById(args.dataContext.id,{...args.dataContext , op_wo_nbr: resp.data.wo_nbr,  })
        }


        else {
          alert("ID OF  N'existe pas")
          this.gridServicerjct.updateItemById(args.dataContext.id,{...args.dataContext , op_wo_lot: null })
        }
        
        });

         
       
       
      }
    },
   
    {
      id: "mvid",
      field: "cmvidd",
      excludeFromHeaderMenu: true,
      formatter: Formatters.infoIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        this.row_number = args.row;
        let element: HTMLElement = document.getElementById(
          "openIdGrid"
        ) as HTMLElement;
        element.click();
      },
    },
   
    {
      id: "op_wo_nbr",
      name: "N° OF",
      field: "op_wo_nbr",
      sortable: true,
      width: 50,
      filterable: false,
      
    },

    {
      id: "op_comment",
      name: "Remarque",
      field: "op_comment",
      sortable: true,
      width: 80,
      filterable: false,
      editor: {
        model: Editors.longText,
  
      }
    },
      
    ];

    this.gridOptionsrjct = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableSorting: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableAutoResize: false,
    
      
      formatterOptions: {
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
     /* presets: {
        sorters: [
          { columnId: 'prh_line', direction: 'ASC' }
        ],
      },*/
    };

    this.rjctdataset = [];
  }



  //ISS-UNP qrt * -1 w ttna7a men ld_det 
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.createForm();
    this.user =  JSON.parse(localStorage.getItem('user'))
    
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.operationHistory = new OperationHistory();
    const date = new Date;
    this.opForm = this.opFB.group({
      op_tran_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      op_site  : [this.operationHistory.op_site],
      op_wkctr : [this.operationHistory.op_wkctr],
      op_mch   : [this.operationHistory.op_mch],
      op_dept  : [{value: this.operationHistory.op_dept, disabled:true}],
      op_shift : [this.operationHistory.op_shift],
      op_emp   : [this.operationHistory.op_emp],
      
      
        
    
    });
  }
  //reste form
  reset() {
    this.operationHistory = new OperationHistory();
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.opForm.controls;
    /** check form */
    if (this.opForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }

    if ( (!this.dataset.length) && (!this.dwndataset.length) && (!this.rjctdataset.length) ) {
      this.message = "Veuillez remplir au moin un tableau";
      this.hasFormErrors = true;

      return;
    }

    for (var i = 0; i < this.dataset.length; i++) {
     if (this.dataset[i].op_wo_lot == "" || this.dataset[i].op_wo_lot == null  ) {
      this.message = "L' ID OF ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
    
    }

    for (var i = 0; i < this.dwndataset.length; i++) {
      if (this.dwndataset[i].op_rsn_down == "" || this.dwndataset[i].op_rsn_down == null  ) {
       this.message = "Cause d'arret ne peut pas etre vide";
       this.hasFormErrors = true;
       return;
  
      }
     
     }

     for (var i = 0; i < this.rjctdataset.length; i++) {
      if (this.rjctdataset[i].op_rsn_rjct == "" || this.rjctdataset[i].op_rsn_rjct == null  ) {
       this.message = "Cause du rejet ne peut pas etre vide";
       this.hasFormErrors = true;
       return;
  
      }
      if (this.rjctdataset[i].op_wo_lot == "" || this.rjctdataset[i].op_wo_lot == null  ) {
        this.message = "L' ID OF ne peut pas etre vide";
        this.hasFormErrors = true;
        return;
   
       }
     
     }

/*
    for (var i = 0; i < this.dataset.length; i++) {
      console.log(this.dataset[i]  )
     if (this.dataset[i].op_part == "" || this.dataset[i].op_part == null  ) {
      this.message = "L' article ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].op_site == "" || this.dataset[i].op_site == null  ) {
      this.message = "Le Site ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].op_loc == "" || this.dataset[i].op_loc == null  ) {
      this.message = "L' Emplacement ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].op_um == "" || this.dataset[i].op_um == null  ) {
      this.message = "L' UM ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].op_status == "" || this.dataset[i].op_status == null  ) {
      this.message = "Le Status ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].op_qty_loc == 0 ) {
      this.message = "La Quantite ne peut pas etre 0";
      this.hasFormErrors = true;
      return;
 
     }

    }

*/    

        let op = this.prepare()
        this.addIt( this.dataset, this.dwndataset,this.rjctdataset, op);

   
    // tslint:disable-next-line:prefer-const
    
  }

  prepare(){
    const controls = this.opForm.controls;
    const _op    = new OperationHistory();
    _op.op_site  = controls.op_site.value
    _op.op_wkctr = controls.op_wkctr.value
    _op.op_mch   = controls.op_mch.value
    _op.op_dept  = controls.op_dept.value
    _op.op_shift = controls.op_shift.value
    _op.op_emp   = controls.op_emp.value
        
    
    
    
    
    _op.op_tran_date = controls.op_tran_date.value
    ? `${controls.op_tran_date.value.year}/${controls.op_tran_date.value.month}/${controls.op_tran_date.value.day}`
    : null
   
    return _op
  }
  /**
   *
   * Returns object for saving
   */
  /**
   * Add po
   *
   * @param _op: op
   */
  addIt( detail: any, dwndetail: any, rjctdetail: any , op : OperationHistory) {
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
     
    }
    for (let data of dwndetail) {
      delete data.id;
      delete data.cmvid;
     
    }
    for (let data of rjctdetail) {
      delete data.id;
      delete data.cmvid;
     
    }
    this.loadingSubject.next(true);
    const controls = this.opForm.controls;

    this.operationHistoryService
      .add( {detail, dwndetail, rjctdetail, op})
      .subscribe(
       (reponse: any) => console.log(reponse),
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
      //    console.log(this.provider, po, this.dataset);
      //    if(controls.print.value == true) printBc(this.provider, this.datasetPrint, po);
     
        this.router.navigateByUrl("/");
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

  onChangesite() {
    this.dataset=[]
    const controls = this.opForm.controls;
    const si_site = controls.op_site.value;
    
    this.siteService.getByOne({ si_site }).subscribe(
      (res: any) => {

        if (res.data) {
        controls.op_site.setValue(res.data.si_site);
       





          }
          else {

            alert("Site n'existe pas  ")
            controls.op_site.setValue(null);
            document.getElementById("op_site").focus();
          }
       
        
      
      });
  }

  onChangewkc() {
    
    const controls = this.opForm.controls;
    const wc_wkctr = controls.op_wkctr.value;
    
    this.workCenterService.getBy({ wc_wkctr }).subscribe(
      (res: any) => {

        console.log(res.data)
        if (res.data.length == 0) {
            alert("Centre n'existe pas  ")
            controls.op_wkctr.setValue(null);
            document.getElementById("op_wkctr").focus();
          }
          else {

            controls.op_dept.setValue(res.data[0].wc_dept);

          }
       
        
      
      });
  }

  
  onChangemch() {
    
    const controls = this.opForm.controls;
    const wc_wkctr = controls.op_wkctr.value;
    const wc_mch = controls.op_mch.value;
    
    this.workCenterService.getBy({ wc_wkctr , wc_mch}).subscribe(
      (res: any) => {

        if (res.data.length == 0) {
            alert("Machine n'existe pas  ")
            controls.op_mch.setValue(null);
            document.getElementById("op_mch").focus();
          }
       
        
      
      });
  }
  // add new Item to Datatable
  addNewItem() {
    this.gridService.addItem(
      {
        id: this.dataset.length + 1,
        op_line: this.dataset.length + 1,
        op_wo_lot: null,
        cmvid: "",
        op_wo_nbr: "",
        op_wo_op: 0,
        op_qty_comp: 0,
        op_act_setup: 0,
        debut: "HH:MM",
        fin: "HH:MM",
        
        op_comment: "",
      },
      { position: "bottom" }
    );
  }
  
  addNewItemdwn() {
    this.gridServicedwn.addItem(
      {
        id: this.dwndataset.length + 1,
        op_line: this.dwndataset.length + 1,
        op_rsn_down: null,
        cmvid: "",
        desc_cause: "",
        debut_cause: "HH:MM",
        fin_cause: "HH:MM",
        op_comment: "",
      },
      { position: "bottom" }
    );
  }

  addNewItemrjct() {
    this.gridServicerjct.addItem(
      {
        id: this.rjctdataset.length + 1,
        op_line: this.rjctdataset.length + 1,
        op_rsn_rjct: null,
        cmvid: "",
        desc_rjct: "",
        op_qty_rjct: 0,
        op_wo_lot: null,
        op_wo_nbr: null,
        op_comment: "",
      },
      { position: "bottom" }
    );
  }


  handleSelectedRowsChanged4(e, args) {
    let updateItem = this.gridServicerjct.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        console.log(item);

       
        
            this.workOrderService.getByOne({ id: item.id, }).subscribe(
              (response: any) => {
            
              updateItem.op_wo_lot = item.id;
              updateItem.op_wo_nbr = item.wo_nbr;
             
              this.gridServicerjct.updateItem(updateItem);
           });
      });
    
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
        id: "wo_nbr",
        name: "N° OF ",
        field: "wo_nbr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },

      {
        id: "wo_part",
        name: "Article ",
        field: "wo_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "wo_qty_comp",
        name: "Qte ",
        field: "wo_qty_comp",
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
    this.workOrderService
      .getBy({wo_status : "C"})
      .subscribe((response: any) => (this.wos = response.data) 
      
      
      );
    
  }
  open4(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }
  onAlertClose($event) {
    this.hasFormErrors = false;
  }





  handleSelectedRowsChanged5(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj5) {
      args.rows.map((idx) => {
        const item = this.gridObj5.getDataItem(idx);
        console.log(item);

       
        
           /* this.woroutingService.getBy({ id: item.wr_lot, }).subscribe(
              (response: any) => {
            */
              updateItem.op_wo_lot = item.wr_lot;
              updateItem.op_wo_nbr = item.wr_nbr;
              updateItem.op_part = item.wr_part;
              updateItem.op_wo_op = item.wr_op;
              
              this.gridService.updateItem(updateItem);
           //});
      });
    
  }
}
  angularGridReady5(angularGrid: AngularGridInstance) {
    this.angularGrid5 = angularGrid;
    this.gridObj5 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid5() {
    const controls = this.opForm.controls
    this.columnDefinitions5 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "wr_lot",
        name: "ID OF ",
        field: "wr_lot",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },

      {
        id: "wr_nbr",
        name: "N° OF ",
        field: "wr_nbr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },

      {
        id: "wr_part",
        name: "Article ",
        field: "wr_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "wr_op",
        name: "Article ",
        field: "wr_op",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      
    ];

    this.gridOptions5 = {
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
    this.woroutingService
      .getBy({wr_wkctr:controls.op_wkctr.value , wr_mch: controls.op_mch.value , wr_status : "R"})
      .subscribe((response: any) => (this.items = response.data) 
      
      
      );
    
  }
  open5(content) {
    this.prepareGrid5();
    this.modalService.open(content, { size: "lg" });
  }
 


  handleSelectedRowsChangedsite(e, args) {
    const controls = this.opForm.controls
    
      if (Array.isArray(args.rows) && this.gridObjsite) {
        args.rows.map((idx) => {
          const item = this.gridObjsite.getDataItem(idx);
              
          controls.op_site.setValue(item.si_site || "")
          
          
    });
 
      }
    }
    angularGridReadysite(angularGrid: AngularGridInstance) {
      this.angularGridsite = angularGrid;
      this.gridObjsite = (angularGrid && angularGrid.slickGrid) || {};
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
      ];
  
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
      this.siteService
        .getAll()
        .subscribe((response: any) => (this.datasite = response.data));
    }
    opensite(contentsite) {
      this.prepareGridsite();
      this.modalService.open(contentsite, { size: "lg" });
    }
   
    handleSelectedRowsChanged3(e, args) {
      const controls = this.opForm.controls;
    
      if (Array.isArray(args.rows) && this.gridObj3) {
        args.rows.map((idx) => {
          const item = this.gridObj3.getDataItem(idx);
          // TODO : HERE itterate on selected field and change the value of the selected field
          switch (this.selectedField) {
            case "op_dept": {
              controls.op_dept.setValue(item.code_value || "");
              break;
            }
            case "op_shift": {
              controls.op_shift.setValue(item.code_value || "");
              break;
            }
            case "op_emp": {
              controls.op_emp.setValue(item.code_value || "");
              break;
            }
            default:
              break;
          }
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
      if (this.selectedField == "op_dept") {

        this.fldname = "wc_dept"
      }
      else {
        this.fldname = this.selectedField
      }
    
      // fill the dataset with your data
      this.codeService
        .getBy({ code_fldname: this.fldname })
        .subscribe((response: any) => (this.data = response.data));
    }
    open3(content, field) {
      this.selectedField = field;
      this.prepareGrid3();
      this.modalService.open(content, { size: "lg" });
    }
    
    ChangeCode(field) {
      const controls = this.opForm.controls; // chof le champs hada wesh men form rah
    
      let obj = {};
      if (field == "op_dept") {
        this.msg = " Dept ";
        const code_value = controls.op_dept.value;
        obj = {
          code_value,
          code_fldname: "wc_dept",
        };
      }
      if (field == "op_shift") {
        this.msg = " Equipe ";
        const code_value = controls.op_shift.value;
        obj = {
          code_value,
          code_fldname: "op_shift",
        };
      }
      if (field == "op_emp") {
        this.msg = " Employé ";
        const code_value = controls.op_emp.value;
        obj = {
          code_value,
          code_fldname: "op_emp",
        };
      }
      this.codeService.getBy(obj).subscribe(
        (res: any) => {
          const { data } = res;
          const message = "Ce code" + this.msg + " n'existe pas!";
    
    
          if (!data.length) {

            console.log("hereeee")
            alert(message)
              controls.op_dept.setValue(null);
                document.getElementById(field).focus();
        
          
        }
        
      })
      
    }
    

    
    handleSelectedRowsChangedwkctr(e, args) {
      const controls = this.opForm.controls
      
        if (Array.isArray(args.rows) && this.gridObjwkctr) {
          args.rows.map((idx) => {
            const item = this.gridObjwkctr.getDataItem(idx);
                
            controls.op_wkctr.setValue(item.wc_wkctr || "")
            controls.op_dept.setValue(item.wc_dept || "")
            
      });
   
        }
      }
      angularGridReadywkctr(angularGrid: AngularGridInstance) {
        this.angularGridwkctr = angularGrid;
        this.gridObjwkctr = (angularGrid && angularGrid.slickGrid) || {};
      }
    
      prepareGridwkctr() {
        this.columnDefinitionswkctr = [
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
            id: "wc_wkctr",
            name: "Centre Charge",
            field: "wc_wkctr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "wc_mch",
            name: "Machine",
            field: "wc_mch",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "wc_dept",
            name: "Département",
            field: "wc_dept",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "wc_desc",
            name: "Designation",
            field: "wc_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
        ];
    
        this.gridOptionswkctr = {
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
        this.workCenterService
          .getAll()
          .subscribe((response: any) => (this.datawkctr = response.data));
      }
      openwkctr(content) {
        this.prepareGridwkctr();
        this.modalService.open(content, { size: "lg" });
      }



      handleSelectedRowsChangedmch(e, args) {
        const controls = this.opForm.controls
        
          if (Array.isArray(args.rows) && this.gridObjmch) {
            args.rows.map((idx) => {
              const item = this.gridObjmch.getDataItem(idx);
                  
              controls.op_mch.setValue(item.wc_mch || "")
              
              
        });
     
          }
        }
        angularGridReadymch(angularGrid: AngularGridInstance) {
          this.angularGridmch = angularGrid;
          this.gridObjmch = (angularGrid && angularGrid.slickGrid) || {};
        }
      
        prepareGridmch() {
          const controls = this.opForm.controls
          this.columnDefinitionsmch = [
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
              id: "wc_wkctr",
              name: "Centre Charge",
              field: "wc_wkctr",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "wc_mch",
              name: "Machine",
              field: "wc_mch",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
  
            {
              id: "wc_desc",
              name: "Designation",
              field: "wc_desc",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
          ];
      
          this.gridOptionsmch = {
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
          this.workCenterService
            .getBy({ wc_wkctr: controls.op_wkctr.value })
            .subscribe((response: any) => (this.datamch = response.data));
        }
        openmch(content) {
          this.prepareGridmch();
          this.modalService.open(content, { size: "lg" });
        }


        

        handleSelectedRowsChangedrsn(e, args) {
          let updateItem = this.gridServicedwn.getDataItemByRowIndex(this.row_number);
          if (Array.isArray(args.rows) && this.gridObjrsn) {
            args.rows.map((idx) => {
              const item = this.gridObjrsn.getDataItem(idx);
             
                  
                  
                    updateItem.op_rsn_down = item.rsn_ref;
                    updateItem.desc_cause = item.rsn_desc;
                    
                    this.gridServicedwn.updateItem(updateItem);
                
            });
          
        }
      }

        angularGridReadyrsn(angularGrid: AngularGridInstance) {
          this.angularGridrsn = angularGrid;
          this.gridObjrsn = (angularGrid && angularGrid.slickGrid) || {};
        }
      
        prepareGridrsn() {
          this.columnDefinitionsrsn = [
            {
              id: "id",
              name: "id",
              field: "id",
              sortable: true,
              minWidth: 80,
              maxWidth: 80,
            },
            {
              id: "rsn_ref",
              name: "code ",
              field: "rsn_ref",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "rsn_desc",
              name: "desc",
              field: "rsn_desc",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            
          ];
      
          this.gridOptionsrsn = {
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
          this.reasonService
            .getBy({rsn_type: "Down"}) 
            .subscribe((response: any) => (this.datarsn = response.data));
        }
        openrsn(content) {
          this.prepareGridrsn();
          this.modalService.open(content, { size: "lg" });
        }

        

        
        handleSelectedRowsChangedrejct(e, args) {
          let updateItem = this.gridServicerjct.getDataItemByRowIndex(this.row_number);
          if (Array.isArray(args.rows) && this.gridObjrejct) {
            args.rows.map((idx) => {
              const item = this.gridObjrejct.getDataItem(idx);
             
                  
                  
                    updateItem.op_rsn_rjct = item.rsn_ref;
                    updateItem.desc_cause_rjct = item.rsn_desc;
                    
                    this.gridServicerjct.updateItem(updateItem);
                
            });
          
        }
      }

        angularGridReadyrejct(angularGrid: AngularGridInstance) {
          this.angularGridrejct = angularGrid;
          this.gridObjrejct = (angularGrid && angularGrid.slickGrid) || {};
        }
      
        prepareGridrejct() {
          this.columnDefinitionsrejct = [
            {
              id: "id",
              name: "id",
              field: "id",
              sortable: true,
              minWidth: 80,
              maxWidth: 80,
            },
            {
              id: "rsn_ref",
              name: "code ",
              field: "rsn_ref",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "rsn_desc",
              name: "desc",
              field: "rsn_desc",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            
          ];
      
          this.gridOptionsrejct = {
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
          this.reasonService
            .getBy({rsn_type: "Reject"}) 
            .subscribe((response: any) => (this.datarejct = response.data));
        }
        openrejct(content) {
          this.prepareGridrejct();
          this.modalService.open(content, { size: "lg" });
        }

}






