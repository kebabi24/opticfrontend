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
  ItemService, SiteService, BomService,BomPartService, WorkOrder, WorkOrderService, SequenceService, ProviderService, WorkRoutingService,
  PsService,  LocationDetailService, LocationService,

} from "../../../../core/erp";

@Component({
  selector: 'kt-create-prod',
  templateUrl: './create-prod.component.html',
  styleUrls: ['./create-prod.component.scss']
})
export class CreateProdComponent implements OnInit {

  workOrder: WorkOrder
  woForm: FormGroup;
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
  user: any;
  alertWarning: any;
 
  sites: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;

  part: any;
  gammes: [];
  columnDefinitionsgamme: Column[] = [];
  gridOptionsgamme: GridOption = {};
  gridObjgamme: any;
  angularGridgamme: AngularGridInstance;

  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;
  details: any;
  boms: [];
  columnDefinitionsbom: Column[] = [];
  gridOptionsbom: GridOption = {};
  gridObjbom: any;
  angularGridbom: AngularGridInstance;


  dataloc: [];
  columnDefinitionsloc: Column[] = [];
  gridOptionsloc: GridOption = {};
  gridObjloc: any;
  angularGridloc: AngularGridInstance;

  dataemp: [];
  columnDefinitionsemp: Column[] = [];
  gridOptionsemp: GridOption = {};
  gridObjemp: any;
  angularGridemp: AngularGridInstance;

  isExist = false
  seq : any;
  nof : any;  
  row_number;
  ld: any;
  message = "";
  location;
  stat;
  lddet;
  wostat;
  datalocdet: [];
  qty;
  columnDefinitionslocdet: Column[] = [];
  gridOptionslocdet: GridOption = {};
  gridObjlocdet: any;
  angularGridlocdet: AngularGridInstance;

  parts: [];
  columnDefinitionspart: Column[] = [];
  gridOptionspart: GridOption = {};
  gridObjpart: any;
  angularGridpart: AngularGridInstance;

  constructor(
    config: NgbDropdownConfig,
    private woFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private siteService: SiteService,  
    private providersService: ProviderService,  
    private itemService: ItemService,
    private sequenceService: SequenceService,
    private workOrderService: WorkOrderService,
    private workRoutingService: WorkRoutingService,
    private bomService: BomService,
    private psService: PsService,
    private locationDetailService: LocationDetailService,
    private locationService: LocationService,
    private bomPartService: BomPartService,
  ) {
    config.autoClose = true;
    this.initGrid();
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
        id: "wod_line",
        name: "Ligne",
        field: "wod_line",
        minWidth: 30,
        maxWidth: 30,
        selectable: true,
      },
      {
        id: "wod_part",
        name: "Article",
        field: "wod_part",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
          required: true,
         

        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          
          this.itemService.getByOne({pt_part: args.dataContext.wod_part }).subscribe((resp:any)=>{

            if (resp.data) {
             this.part = resp.data.pt_part
               
                 this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , wod_um: resp.data.pt_um, wod_site: resp.data.pt_site, wod_loc: resp.data.pt_loc})

               
            } else {

                      alert("Article Nexiste pas")
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , wod_part: null })
              
            } 
          })
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
            "openItemsdetGrid"
            ) as HTMLElement;
            element.click();
      },
    },
      
      {
        id: "desc",
        name: "Description",
        field: "desc",
        sortable: true,
        width: 150,
        filterable: false,
      },
      

      {
        id: "wod_site",
        name: "Site",
        field: "wod_site",
        sortable: true,
        width: 80,
        filterable: false,
      },
      {
        id: "wod_loc",
        name: "Emplacement",
        field: "wod_loc",
        sortable: true,
        width: 80,
        filterable: false,
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
            "openLocsGrid"
            ) as HTMLElement;
            element.click();
        },
      },       
      {
        id: "wod_serial",
        name: "Lot/Serie",
        field: "wod_serial",
        sortable: true,
        width: 80,
        filterable: false,
      },
      {
        id: "mvidlot",
        field: "cmvidlot",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
            this.row_number = args.row;
            let element: HTMLElement = document.getElementById(
            "openLocdetsGrid"
            ) as HTMLElement;
            element.click();
        },
    },
      {
        id: "wod_ref",
        name: "Réference",
        field: "wod_ref",
        sortable: true,
        width: 80,
        filterable: false,
      },
      {
        id: "wod_qty_req",
        name: "Quantité",
        field: "wod_qty_req",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
          required: true,
          

        },
       
      },
      {
        id: "qty_oh",
        name: "Quantité Stock",
        field: "qty_oh",
        sortable: true,
        width: 80,
        filterable: false,
       
      },
      {
        id: "wod_um",
        name: "UM",
        field: "wod_um",
        sortable: true,
        width: 80,
        filterable: false,
        
      },
    


    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableAutoResize: true,
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
    this.workOrder = new WorkOrder();
    const date = new Date;
    this.woForm = this.woFB.group({
      wo_ord_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      wo_site: [this.workOrder.wo_site , Validators.required],
      wo_loc: [this.workOrder.wo_loc , Validators.required],
      wo_part: [this.workOrder.wo_part , Validators.required],
      desc: [{ value:"" , disabled: true}],
      wo_bom_code: [{value:this.workOrder.wo_bom_code, disabled: true} ],
      wo_qty_ord: [this.workOrder.wo_qty_ord ],
      wo_rmks: [this.workOrder.wo_rmks ],
      wo_serial: [this.workOrder.wo_serial ],
      batch: [{value:0, disabled: true}],
      wo__chr01: [{value: this.workOrder.wo__chr01, disabled: true} ],
    });
    const controls = this.woForm.controls;
    this.siteService.getByOne({ si_default: true  }).subscribe(
      (res: any) => {
      //this.site = res.data.si_site
      
      controls.wo_site.setValue(res.data.si_site );
     
  
    })
  }
  //reste form
  reset() {
    this.workOrder = new WorkOrder();
    this.createForm();
    this.hasFormErrors = false;
  }


  onChangeCode() {
    const controls = this.woForm.controls
    this.siteService
        .getByOne({
              si_site: controls.wo_site.value,
        })
        .subscribe((response: any) => {
            
            const { data } = response;
            if (!data) {
              alert("Site n'existe pas")
              controls.wo_site.setValue("")
              document.getElementById("site").focus();
            } 
     })
  }

  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.woForm.controls;
    /** check form */
    if (this.woForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }

    if (!this.dataset.length) {
      this.message = "La liste des article ne peut pas etre vide";
      this.hasFormErrors = true;

      return;
    }
    for (var i = 0; i < this.dataset.length; i++) {
      
     if (this.dataset[i].wod_part == "" || this.dataset[i].wod_part == null  ) {
      this.message = "L' article ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
    }
     for (var i = 0; i < this.dataset.length; i++) {
      
     if (this.dataset[i].wod_qty_req == 0 || this.dataset[i].wod_qty_req == null  ) {
      this.message = "Quantité ne peut pas etre 0";
      this.hasFormErrors = true;
      return;
 
     }
    }
    for (var i = 0; i < this.dataset.length; i++) {
      
      if (this.dataset[i].wod_site == "" || this.dataset[i].wod_site == null  ) {
       this.message = "Site ne peut pas etre vide";
       this.hasFormErrors = true;
       return;
  
      }
     }
     
    for (var i = 0; i < this.dataset.length; i++) {
      
      if (this.dataset[i].wod_loc == "" || this.dataset[i].wod_loc == null  ) {
       this.message = "Emplacement ne peut pas etre vide";
       this.hasFormErrors = true;
       return;
  
      }
     }
    
     for (var i = 0; i < this.dataset.length; i++) {
      
      if (this.dataset[i].wod_qty_req > this.dataset[i].qty_oh   ) {
       this.message = "Stock Insufisant";
       this.hasFormErrors = true;
       return;
  
      }
     }
    this.sequenceService.getByOne({ seq_type: "OF", seq_profile: this.user.usrd_profile }).subscribe(
      (response: any) => {
    this.seq = response.data 
        
        if (this.seq) {
         this.nof = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`

         this.sequenceService.update(this.seq.id,{ seq_curr_val: Number(this.seq.seq_curr_val )+1 }).subscribe(
          (reponse) => console.log("response", Response),
          (error) => {
            this.message = "Erreur modification Sequence";
            this.hasFormErrors = true;
            return;
       
          
          },
          )
    
    let wo = this.prepare()
    this.addIt( this.dataset,wo, this.nof);

  }else {
    this.message = "Parametrage Monquant pour la sequence";
    this.hasFormErrors = true;
    return;

   }


})



    

    
    // tslint:disable-next-line:prefer-const
    
  }

  prepare(){
    const controls = this.woForm.controls;
    const _wo = new WorkOrder();
    _wo.wo_site = controls.wo_site.value
    _wo.wo_loc = controls.wo_loc.value
    _wo.wo__chr01 = controls.wo__chr01.value
    
    _wo.wo_part = controls.wo_part.value
    _wo.wo_bom_code = controls.wo_bom_code.value 
    _wo.wo_qty_ord = controls.wo_qty_ord.value 
    _wo.wo_rmks = controls.wo_rmks.value
    _wo.wo_serial = controls.wo_serial.value

    _wo.wo_rctstat = this.wostat
    _wo.wo_ord_date = controls.wo_ord_date.value
    ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}`
    : null
    return _wo
  }
  /**
   *
   * Returns object for saving
   */
  /**
   * Add po
   *
   * @param _it: it
   */ 
   addIt( detail: any, wo, nof) {
    for (let data of detail) {
      delete data.id;
      delete data.desc;
      delete data.cmvid;
     
    }
    this.loadingSubject.next(true);
    const controls = this.woForm.controls;

    this.workOrderService
      .addDirect({detail, wo,nof})
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
      this.router.navigateByUrl("/manufacturing/list-wo")
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

  // add new Item to Datatable
  addNewItem() {
    this.part = null,
    this.gridService.addItem(
     
      {
        id: this.dataset.length + 1,
        wod_line: this.dataset.length + 1,
        wod_part: "",
        cmvid: "",
        desc: "",
        wod_qty_req: 0,
        wod_site: null,
        wod_loc: null,
        wod_serial: null,
        wod_ref: null,
      },
      { position: "bottom" }
    );
  }
  
  
 





  handleSelectedRowsChangedsite(e, args) {
    const controls = this.woForm.controls;
    if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
    
        controls.wo_site.setValue(item.si_site || "");
        
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
      .subscribe((response: any) => (this.sites = response.data));
  }
  opensite(content) {
    this.prepareGridsite();
    this.modalService.open(content, { size: "lg" });
  }

  onChangePart() {
    const controls = this.woForm.controls
    this.itemService
        .getByOne({
            pt_part: controls.wo_part.value,    pt_pm_code:  "M"
        })
        .subscribe((response: any) => {
        console.log(response.data)
            if (response.data) {    
              controls.wo_part.setValue(response.data.pt_part || "");
              controls.desc.setValue(response.data.pt_desc1 || "");
              controls.wo_bom_code.setValue(response.data.pt_bom_code || "");
              controls.wo__chr01.setValue(response.data.pt_um || "");
        
         
            } else {
              //this.isExist = true
              alert("Produit n'existe pas  ")
              controls.wo_part.setValue(null);
              document.getElementById("wo_part").focus();
      
  
            }
        })
  }
  


  handleSelectedRowsChanged4(e, args) {
    //let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    const controls = this.woForm.controls;
    
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
    
        controls.wo_part.setValue(item.pt_part || "");
        controls.desc.setValue(item.pt_desc1 || "");
        controls.wo_bom_code.setValue(item.pt_bom_code || "");
        controls.wo_loc.setValue(item.pt_loc || "");
        controls.wo__chr01.setValue(item.pt_um || "");
        this.bomService.getBy({bom_parent: controls.wo_bom_code.value}).subscribe((response: any)=>{
          console.log(response.data.bom_batch)
          
            controls.batch.setValue(response.data.bom_batch);
          })
       

      }) 
      
    }
  }



  onChangeQty(){

    this.dataset=[]
    const controls = this.woForm.controls;
    
    const ps_parent = controls.wo_bom_code.value;
        
    this.psService.getBy({ps_parent}).subscribe((response: any)=>{
            
      this.details  = response.data;
     
      console.log(this.details);

      for (var object = 0; object < this.details.length; object++) {
        // console.log(this.details[object]);
         // const detail = this.details[object];
         let qte = Number(controls.wo_qty_ord.value)
          let qty = Number(this.details[object].ps_qty_per) * Number (qte) / Number(controls.batch.value) ;
       // let obj = {}
         console.log(qty)
            this.itemService.getByOne({pt_part: this.details[object].ps_comp}).subscribe((resp: any)=>{
    
              this.locationDetailService.getByOne({ld_part: resp.data.pt_part, ld_site: resp.data.pt_site, ld_loc : resp.data.pt_loc, ld_lot: null}).subscribe((res: any)=>{
                let qtyoh = 0
                if (res.data) {
                   qtyoh = res.data.ld_qty_oh
                }
                else {
                  qtyoh = 0
                }
            this.gridService.addItem(
                {
    
                  
                  id: this.dataset.length + 1,
                  wod_line: this.dataset.length + 1,
                  wod_part: resp.data.pt_part,
                  desc: resp.data.pt_desc1,
                  wod_um: resp.data.pt_um,
                  wod_qty_req: qty,
                  qty_oh : qtyoh,
                  wod_site: resp.data.pt_site,
                  wod_loc: resp.data.pt_loc,
                  wod_serial: null,
                  wod_ref: null,         
                  
                 
                },
                { position: "bottom" }
              );
              
     
     
            })
          })
           }
    });
  

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
        name: "desc",
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

      .getProd({})
      .subscribe((response: any) => (this.items = response.data));
  }
  open4(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }



  

  
  handleSelectedRowsChangedbom(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjbom) {
      args.rows.map((idx) => {
        const item = this.gridObjbom.getDataItem(idx);
        
     
        updateItem.wo_bom_code = item.bom_parent;
      
        this.gridService.updateItem(updateItem);
     
       
     
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
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "ptb_bom",
        name: "code Nomen",
        field: "ptb_bom",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "bom_desc",
        name: "Désignation",
        field: "Bom.bom_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "bom_batch",
        name: "Batch",
        field: "Bom.bom_batch",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "bom_batch_um",
        name: "UM",
        field: "Bom.bom_batch_um",
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
    
    this.bomPartService
      .getBy({ptb_part : this.part})
      .subscribe((response: any) => { console.log(response.data);
        (this.boms = response.data)});
  }
  openbom(content) {
    this.prepareGridbom();
    this.modalService.open(content, { size: "lg" });
  }


  handleSelectedRowsChangedloc(e, args) {
    const controls = this.woForm.controls;
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);

    if (Array.isArray(args.rows) && this.gridObjloc) {
      args.rows.map((idx) => {
        const item = this.gridObjloc.getDataItem(idx);
        console.log(item);

            

   /*     this.locationService.getByOne({ loc_loc: item.wod_loc, loc_site: controls.wo_site.value }).subscribe(
          (response: any) => {
            this.location = response.data
            if (response.data) {

     */          
                      
         
                      this.locationDetailService.getByOne({ld_part: updateItem.wod_part, ld_site: controls.wo_site.value, ld_loc : item.loc_loc, ld_lot: null}).subscribe((res: any)=>{
                        let qtyoh = 0
                        if (res.data) {
                           qtyoh = res.data.ld_qty_oh
                        }
                        else {
                          qtyoh = 0
                        }

                        updateItem.wod_loc = item.loc_loc
                        updateItem.wod_status = item.loc_status
                        updateItem.qty_oh = qtyoh
                        this.gridService.updateItem(updateItem);
 
                  
       /*         }
                else {
                  alert("Emplacement Nexiste pas")
                  updateItem.tr_loc = null
                  updateItem.tr_status = null
                  this.gridService.updateItem(updateItem);
                }
       */          
    });
   })
  }
}
  angularGridReadyloc(angularGrid: AngularGridInstance) {
    this.angularGridloc = angularGrid;
    this.gridObjloc = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridloc() {
    this.columnDefinitionsloc = [
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
        id: "loc_site",
        name: "Site",
        field: "loc_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_loc",
        name: "Emplacement",
        field: "loc_loc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_desc",
        name: "Designation",
        field: "loc_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_status",
        name: "Status",
        field: "loc_status",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_perm",
        name: "Permanent",
        field: "loc_perm",
        sortable: true,
        filterable: true,
        type: FieldType.boolean,
        formatter: Formatters.yesNo,
      },
    ];

    this.gridOptionsloc = {
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
      let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    
    // fill the dataset with your data
    this.locationService
      .getBy({ loc_site:  updateItem.tr_site })
      .subscribe((response: any) => (this.dataloc = response.data));
  }
  openloc(contentloc) {
    this.prepareGridloc();
    this.modalService.open(contentloc, { size: "lg" });
  }
  handleSelectedRowsChangedlocdet(e, args) {
    const controls = this.woForm.controls;
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjlocdet) {
      args.rows.map((idx) => {
        const item = this.gridObjlocdet.getDataItem(idx);
        console.log(item);

        updateItem.wod_serial = item.ld_lot;
        updateItem.wod_ref = item.ld_ref;
        updateItem.tr_expire = item.ld_expire;
        updateItem.qty_oh = item.ld_qty_oh;
        
            
        this.gridService.updateItem(updateItem);
        
       
      
      });
    }
  }
  angularGridReadylocdet(angularGrid: AngularGridInstance) {
    this.angularGridlocdet = angularGrid;
    this.gridObjlocdet = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridlocdet() {
    const controls = this.woForm.controls; 

    this.columnDefinitionslocdet = [
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
        id: "ld_site",
        name: "Site",
        field: "ld_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_loc",
        name: "Emplacement",
        field: "ld_loc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_part",
        name: "Article",
        field: "ld_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_lot",
        name: "Lot",
        field: "ld_lot",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_status",
        name: "Status",
        field: "ld_status",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_qty_oh",
        name: "Qte",
        field: "ld_qty_oh",
        sortable: true,
        filterable: true,
        type: FieldType.float,
      },
      {
        id: "ld_expire",
        name: "Expire",
        field: "ld_expire",
        sortable: true,
        filterable: true,
        type: FieldType.dateIso,
      },
    ];

    this.gridOptionslocdet = {
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
      let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    
    // fill the dataset with your data
    this.locationDetailService
      .getBy({ ld_site:   updateItem.wod_site , ld_loc:  updateItem.wod_loc , ld_part:  updateItem.wod_part })
      .subscribe((response: any) => (this.datalocdet = response.data));
  }
  openlocdet(contentlocdet) {
    this.prepareGridlocdet();
    this.modalService.open(contentlocdet, { size: "lg" });
  }


  handleSelectedRowsChangedpart(e, args) {
    const controls = this.woForm.controls;
     let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
     if (Array.isArray(args.rows) && this.gridObjpart) {
       args.rows.map((idx) => {
         const item = this.gridObjpart.getDataItem(idx);
         console.log(item);
 
         //this.locationService.getByOne({ loc_loc: controls.tr_ref_loc.value, loc_site: controls.tr_ref_site.value }).subscribe(
          // (response: any) => {
           //  this.location = response.data
         
          
               this.locationDetailService.getByOne({ ld_site: item.pt_site, ld_loc: item.pt_loc, ld_part: item.pt_part, ld_lot: null }).subscribe(
                 (response: any) => {
                   this.lddet = response.data
                   //console.log(this.lddet.ld_qty_oh)

if (this.lddet != null)
{
                 updateItem.wod_part = item.pt_part;
                 updateItem.desc = item.pt_desc1;
                 updateItem.wod_um = item.pt_um;
                 updateItem.wod_site = item.pt_site;
                 updateItem.wod_loc = item.pt_loc;
                 updateItem.qty_oh =  this.lddet.ld_qty_oh;
                 updateItem.wod_status =  this.stat;
                 updateItem.tr_expire =  this.lddet.ld_expire;
                       
                 
                 this.gridService.updateItem(updateItem);
              
               } 
               else {
                 updateItem.wod_part = item.pt_part;
                 updateItem.desc = item.pt_desc1;
                 updateItem.wod_um = item.pt_um;
                 updateItem.wod_site = item.pt_site;
                 updateItem.wod_loc = item.pt_loc;
                 
                 updateItem.qty_oh =  0;
                  
                 
                 this.gridService.updateItem(updateItem);
              

               }
               
             });       
           });   
      
     }
   }
   angularGridReadypart(angularGrid: AngularGridInstance) {
     this.angularGridpart = angularGrid;
     this.gridObjpart = (angularGrid && angularGrid.slickGrid) || {};
   }
 
   prepareGridpart() {
     this.columnDefinitionspart = [
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
         name: "desc",
         field: "pt_um",
         sortable: true,
         filterable: true,
         type: FieldType.string,
       },
     ];
 
     this.gridOptionspart = {
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
       .subscribe((response: any) => (this.parts = response.data));
   }
   openpart(content) {
     this.prepareGridpart();
     this.modalService.open(content, { size: "lg" });
   }

   

   
  handleSelectedRowsChangedemp(e, args) {
    const controls = this.woForm.controls;
    
    if (Array.isArray(args.rows) && this.gridObjemp) {
      args.rows.map((idx) => {
        const item = this.gridObjemp.getDataItem(idx);
        controls.wo_loc.setValue(item.loc_loc || "");
        this.wostat = item.loc_status;
  
            

   })
  }
}
  angularGridReadyemp(angularGrid: AngularGridInstance) {
    this.angularGridemp = angularGrid;
    this.gridObjemp = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridemp() {
    const controls = this.woForm.controls;
    
    this.columnDefinitionsemp = [
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
        id: "loc_site",
        name: "Site",
        field: "loc_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_loc",
        name: "Emplacement",
        field: "loc_loc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_desc",
        name: "Designation",
        field: "loc_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_status",
        name: "Status",
        field: "loc_status",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_perm",
        name: "Permanent",
        field: "loc_perm",
        sortable: true,
        filterable: true,
        type: FieldType.boolean,
        formatter: Formatters.yesNo,
      },
    ];

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
    this.locationService
      .getBy({ loc_site: controls.wo_site.value })
      .subscribe((response: any) => (this.dataemp = response.data));
  }
  openemp(contentemp) {
    this.prepareGridemp();
    this.modalService.open(contentemp, { size: "lg" });
  }

  }






