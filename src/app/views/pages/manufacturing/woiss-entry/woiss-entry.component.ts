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
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
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
  InventoryTransaction,
  InventoryTransactionService,
  LocationService,
  SiteService,
  CostSimulationService,
  LocationDetailService,
  CodeService,
  InventoryStatusService,
  MesureService,
  SequenceService,
  WorkOrderService,
  WorkOrderDetailService,
 
} from "../../../../core/erp";


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

@Component({
  selector: 'kt-woiss-entry',
  templateUrl: './woiss-entry.component.html',
  styleUrls: ['./woiss-entry.component.scss']
})
export class WoissEntryComponent implements OnInit {
  inventoryTransaction: InventoryTransaction;
  trForm: FormGroup;
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
  user
  
  alertWarning: any;
 
  adresses: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  wos: [];
  columnDefinitions5: Column[] = [];
  gridOptions5: GridOption = {};
  gridObj5: any;
  angularGrid5: AngularGridInstance;

  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;

  dataloc: [];
  columnDefinitionsloc: Column[] = [];
  gridOptionsloc: GridOption = {};
  gridObjloc: any;
  angularGridloc: AngularGridInstance;

  datalocdet: [];
  columnDefinitionslocdet: Column[] = [];
  gridOptionslocdet: GridOption = {};
  gridObjlocdet: any;
  angularGridlocdet: AngularGridInstance;
  ums: [];
  columnDefinitionsum: Column[] = [];
  gridOptionsum: GridOption = {};
  gridObjum: any;
  angularGridum: AngularGridInstance;

  statuss: [];
  columnDefinitionsstatus: Column[] = [];
  gridOptionsstatus: GridOption = {};
  gridObjstatus: any;
  angularGridstatus: AngularGridInstance;

  provider: any;
  row_number;
  message = "";
  prhServer;
  location: any;
  sct: any;
  seq: any;
  lddet: any;
  trlot: string;
  datasetPrint = [];
  stat: String;
  detail;
  woServer;
  serial;
  qty;
  status;

  constructor(
    config: NgbDropdownConfig,
    private trFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private inventoryTransactionService: InventoryTransactionService,
    private sctService: CostSimulationService,  
    private itemsService: ItemService,
    private locationService: LocationService,
    private codeService: CodeService,
    private inventoryStatusService: InventoryStatusService,
    private siteService: SiteService,
    private mesureService: MesureService,
    private addressService: AddressService,
    private sequenceService: SequenceService,
    private workOrderService: WorkOrderService,
    private workOrderDetailService: WorkOrderDetailService,
    
    private locationDetailService: LocationDetailService
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
        id: "add",
        field: "add",
        excludeFromHeaderMenu: true,
        formatter: Formatters.icon, params: { formatterIcon: 'fa fa-plus' },
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          //if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          //  this.angularGrid.gridService.deleteItem(args.dataContext);
         // }
         this.addsameItem(args.dataContext.id)
        
        },
      },

      {
        id: "tr_line",
        name: "Ligne",
        field: "tr_line",
        minWidth: 50,
        maxWidth: 50,
        selectable: true,
      },
      {
        id: "wodid",
        name: "Wod Ligne",
        field: "wodid",
        minWidth: 50,
        maxWidth: 50,
        selectable: true,
      },
          
      {
        id: "tr_part",
        name: "Article",
        field: "tr_part",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
          required: true,
          validator: statusValidator,

        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.tr_part)
          this.itemsService.getByOne({pt_part: args.dataContext.tr_part }).subscribe((resp:any)=>{

            if (resp.data) {
              console.log(resp.data)

             
                this.sctService.getByOne({ sct_site: resp.data.pt_site, sct_part: resp.data.pt_part, sct_sim: 'STDCG' }).subscribe(
                  (response: any) => {
                    this.sct = response.data
           
                    this.locationDetailService.getByOne({ ld_site: resp.data.pt_site, ld_loc: resp.data.pt_loc, ld_part: resp.data.pt_part, ld_lot: null }).subscribe(
                      (response: any) => {
                        this.lddet = response.data
                        console.log(this.lddet.ld_qty_oh)
                        if (this.lddet != null) {
                        this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-WO" }).subscribe((resstat:any)=>{
                       //   console.log(resstat)
                          const { data } = resstat;
  
                          if (data) {
                            this.stat = null
                          } else {
                            this.stat = this.lddet.ld_status
                          }
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , tr_site:resp.data.pt_site, tr_loc:resp.data.pt_loc,
                      tr_um:resp.data.pt_um, tr_um_conv: 1,  tr_status: this.stat, tr_price: this.sct.sct_mtl_tl, qty_oh: this.lddet.ld_qty_oh, tr_expire: this.lddet.ld_expire})
                        });
                      }
                      else {
                        this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , tr_site:resp.data.pt_site, tr_loc:resp.data.pt_loc,
                          tr_um:resp.data.pt_um, tr_um_conv: 1,  tr_status: null, tr_price: this.sct.sct_mtl_tl, qty_oh: 0, tr_expire: null})
                      

                      }     
     
                      });     
                });  
            
          }



    


          else {
            alert("Article Nexiste pas")
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_part: null })
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
        id: "desc",
        name: "Description",
        field: "desc",
        sortable: true,
        width: 180,
        filterable: false,
      },
      
      {
        id: "tr_site",
        name: "Site",
        field: "tr_site",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
          required: true,
          validator: statusValidator,

        },
        onCellChange: (e: Event, args: OnEventArgs) => {

          this.siteService.getByOne({ si_site: args.dataContext.tr_site,}).subscribe(
            (response: any) => {
              
          console.log(response.data)

                if (response.data) {
                  
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_site: response.data.si_site})
                }
                else {
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , tr_site: null});
    
                     // this.gridService.onItemUpdated;
                      alert("Site N'existe pas")
                }
          });     
      }

      },
      {
          id: "mvids",
          field: "cmvids",
          excludeFromHeaderMenu: true,
          formatter: Formatters.infoIcon,
          minWidth: 30,
          maxWidth: 30,
          onCellClick: (e: Event, args: OnEventArgs) => {
              this.row_number = args.row;
              let element: HTMLElement = document.getElementById(
              "openSitesGrid"
              ) as HTMLElement;
              element.click();
          },
      },
      {
        id: "tr_loc",
        name: "Emplacement",
        field: "tr_loc",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
          required: true,
          validator: statusValidator,

        },


        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.tr_site)
          console.log(args.dataView.tr_site)
            
            this.locationService.getByOne({ loc_loc: args.dataContext.tr_loc, loc_site: args.dataContext.tr_site }).subscribe(
              (response: any) => {
                this.location = response.data
                if (response.data) {

                    this.locationDetailService.getByOne({ ld_site: args.dataContext.tr_site, ld_loc: args.dataContext.tr_loc, ld_part: args.dataContext.tr_part, ld_lot:  args.dataContext.tr_serial }).subscribe(
                      (response: any) => {
                        this.lddet = response.data
                      //  console.log(this.lddet[0].ld_qty_oh)
               if (this.lddet){
                        this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-WO" }).subscribe((resstat:any)=>{
                    //      console.log(resstat)
                          const { data } = resstat;
  
                          if (data) {
                            this.stat = null
                          } else {
                            this.stat = this.lddet.ld_status
                          }
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,   tr_status: this.stat, qty_oh: this.lddet.ld_qty_oh, tr_expire: this.lddet.ld_expire})
                        });     
                      }
                      else {
                        this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,   tr_status: null, qty_oh: 0, tr_expire: null})
                     
                      }
                      });     
                    }
                    else {
                      alert("Emplacement Nexiste pas")
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_loc: null, qty_oh: 0, tr_status: null })
                    }
                     
        });

      }



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
        id: "tr_serial",
        name: "Lot/Serie",
        field: "tr_serial",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {

            this.locationDetailService.getByOne({ ld_site: args.dataContext.tr_site, ld_loc: args.dataContext.tr_loc, ld_part: args.dataContext.tr_part, ld_lot: args.dataContext.tr_serial }).subscribe(
              (response: any) => {
                this.lddet = response.data
                
       // console.log(response.data.length)
                  if (this.lddet != null) {
                    
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,   qty_oh: this.lddet.ld_qty_oh, tr_status: this.lddet.ld_status, tr_expire: this.lddet.tr_expire})
                  }
                  else {
                        this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , tr_serial: null, qty_0h: 0, tr_expire: null});
      
                        alert("Lot N' existe pas")
                  }
            });     
        }

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
          id: "qty_oh",
          name: "QTE Stock",
          field: "qty_oh",
          sortable: true,
          width: 80,
          filterable: false,
          type: FieldType.float,
          
      },
      {
          id: "tr_qty_loc",
          name: "QTE",
          field: "tr_qty_loc",
          sortable: true,
          width: 80,
          filterable: false,
          type: FieldType.float,
          editor: {
              model: Editors.float,
              params: { decimalPlaces: 2 },
              required: true,
              
              
          },
      
        onCellChange: (e: Event, args: OnEventArgs) => {
              console.log(args.dataContext.tr_qty_loc)
              console.log(args.dataContext.tr_um_conv)
              
              if (args.dataContext.tr_qty_loc * args.dataContext.tr_um_conv   > args.dataContext.qty_oh) {
                  console.log('here')
               alert ("Qte monquante")
               this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_qty_loc: null })
            //  this.alertWarning = `Updated Title: ${args.dataView.tr_qty_loc}`;
           
             
          }
      
           // meta.cssClasses = (meta.cssClasses || '') + ' ' + newCssClass;
          }
          
      },
      
        {
          id: "tr_um",
          name: "UM",
          field: "tr_um",
          sortable: true,
          width: 80,
          filterable: false,
          editor: {
              model: Editors.text,
              required: true,
              validator: statusValidator,

          },
          onCellChange: (e: Event, args: OnEventArgs) => {
            console.log(args.dataContext.tr_um)
            this.itemsService.getBy({pt_part: args.dataContext.tr_part }).subscribe((resp:any)=>{
              
            if   (args.dataContext.tr_um == resp.data.pt_um )  {
              
              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: 1 })
            } else { 
              //console.log(resp.data.pt_um)



                this.mesureService.getBy({um_um: args.dataContext.tr_um, um_alt_um: resp.data.pt_um, um_part: args.dataContext.tr_part  }).subscribe((res:any)=>{
                console.log(res)
                const { data } = res;
      
              if (data) {
                //alert ("Mouvement Interdit Pour ce Status")
                this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: res.data.um_conv })
                this.angularGrid.gridService.highlightRow(1, 1500);

                if (args.dataContext.tr_qty_loc * Number(res.data.um_conv) >  args.dataContext.qty_oh) {
                  console.log('here')
                  alert ("Qte monquante")
                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: "1" , tr_um: null});
                  
              
                } else {
              
                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um: null })

                }




              } else {
                this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: args.dataContext.tr_um, um_part: args.dataContext.tr_part  }).subscribe((res:any)=>{
                  console.log(res)
                  const { data } = res;
                  if (data) {
                    if (args.dataContext.tr_qty_loc * Number(res.data.um_conv) >  args.dataContext.qty_oh) {
                      console.log('here')
                      alert ("Qte monquante")
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: "1" , tr_um: null});
                      
                  
                    } else {
                  
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um: null })
    
                    }
          
                  } else {
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: "1" , tr_um: null});
              
                    alert("UM conversion manquante")
                    
                  }  
                })

              }
                })

              }
              })
    
            }

          
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
            "openUmsGrid"
            ) as HTMLElement;
            element.click();
        },
      },
      {
        id: "tr_um_conv",
        name: "Conv UM",
        field: "tr_um_conv",
        sortable: true,
        width: 80,
        filterable: false,
       // editor: {
       //     model: Editors.float,
        //},
        
      },
                   
      {
        id: "tr_status",
        name: "Status",
        field: "tr_status",
        sortable: true,
        width: 80,
        filterable: false,
       /* editor: {
          model: Editors.text,
          required: true,
          validator: statusValidator,

        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.tr_status)
          
          this.inventoryStatusService.getAllDetails({isd_status: args.dataContext.tr_status, isd_tr_type: "ISS-UNP" }).subscribe((res:any)=>{
          console.log(res)
          const { data } = res;

        if (data) {
          alert ("Mouvement Interdit Pour ce Status")
          this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_status: null })
          
        }
          })

  
          //if (args.dataContext.tr_qty_loc > args.dataContext.qty_oh) {
          //    console.log('here')
          // alert ("Qte monquante")
          // this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_qty_loc: null })
        //  this.alertWarning = `Updated Title: ${args.dataView.tr_qty_loc}`;
       
         
      },
      */




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
            "openStatussGrid"
            ) as HTMLElement;
            element.click();
        },
      },
      {
        id: "tr_expire",
        name: "Expire",
        field: "tr_expire",
        sortable: true,
        width: 80,
        filterable: false,
        formatter: Formatters.dateIso,
        
        type: FieldType.dateIso,
        
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
    this.inventoryTransaction = new InventoryTransaction();
    const date = new Date;
    this.trForm = this.trFB.group({
      tr_effdate: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      tr_lot : [this.inventoryTransaction.tr_lot],
      tr_nbr:  [{value: this.inventoryTransaction.tr_nbr,disabled:true}],
     
      tr_part:  [{value:this.inventoryTransaction.tr_part, disabled: true}],
      desc:  [{value:"", disabled: true}],

      tr_so_job: [this.inventoryTransaction.tr_so_job],
      
      tr_rmks: [this.inventoryTransaction.tr_rmks],
      });
  }
  //reste form
  reset() {
    this.inventoryTransaction = new InventoryTransaction();
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.trForm.controls;
    /** check form */
    if (this.trForm.invalid) {
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
      console.log(this.dataset[i]  )
     if (this.dataset[i].tr_part == "" || this.dataset[i].tr_part == null  ) {
      this.message = "L' article ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].tr_site == "" || this.dataset[i].tr_site == null  ) {
      this.message = "Le Site ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].tr_loc == "" || this.dataset[i].tr_loc == null  ) {
      this.message = "L' Emplacement ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].tr_um == "" || this.dataset[i].tr_um == null  ) {
      this.message = "L' UM ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].tr_status == "" || this.dataset[i].tr_status == null  ) {
      this.message = "Le Status ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].tr_qty_loc == 0 ) {
      this.message = "La Quantite ne peut pas etre 0";
      this.hasFormErrors = true;
      return;
 
     }

    }

    

        let tr = this.prepare()
        this.addIt( this.dataset,tr);

      console.log(this.trlot)
   
    // tslint:disable-next-line:prefer-const
    
  }

  prepare(){
    const controls = this.trForm.controls;
    const _tr = new InventoryTransaction();
    _tr.tr_nbr = controls.tr_nbr.value
    _tr.tr_lot = controls.tr_lot.value
    
    
    _tr.tr_effdate = controls.tr_effdate.value
    ? `${controls.tr_effdate.value.year}/${controls.tr_effdate.value.month}/${controls.tr_effdate.value.day}`
    : null
    _tr.tr_so_job = controls.tr_so_job.value
    
    _tr.tr_rmks = controls.tr_rmks.value
  
    return _tr
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
  addIt( detail: any, it) {
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
     
    }
    this.loadingSubject.next(true);
    const controls = this.trForm.controls;

    this.inventoryTransactionService
      .addIssWo({detail, it})
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

  onChangeOA() {
    this.dataset=[]
    const controls = this.trForm.controls;
    const id = controls.tr_lot.value;
    
    this.workOrderService.getByOne({ id }).subscribe(
      (res: any) => {
      
          if(res.data.wo_status == "R") {      
        this.woServer = res.data;
        
        controls.tr_lot.setValue(this.woServer.id);
        controls.tr_nbr.setValue(this.woServer.wo_nbr);
        controls.tr_part.setValue(this.woServer.wo_part);
        controls.desc.setValue(this.woServer.item.pt_desc1)
       

this.workOrderDetailService.getBy({wod_lot: id, wod__qadl01: false}).subscribe(
  (resp: any) => {
  
  
  this.detail  = resp.data;

  //for (var object = 0; object < this.detail.length; object++) {
    for (const object in this.detail) {
      const det = this.detail[object];
   
     /*   this.sctService.getByOne({ sct_site: det.wod_site, sct_part: det.wod_part, sct_sim: 'STDCG' }).subscribe(
          (respo: any) => {
            this.sct = respo.data
       */ 
           

    this.gridService.addItem(
          {
            id: this.dataset.length + 1,
            tr_line : this.dataset.length + 1,
            wodid:    det.id,

            tr_part    : det.wod_part,
            desc       :   det.item.pt_desc1,
            tr_um      : det.wod_um,
            tr_um_conv : 1,
            tr_qty_loc : 0,
            qty_oh     : 0, 
            tr_site    : det.wod_site,
            tr_loc     : null,
            tr_status  : null,

            tr_serial  : det.wod_serial,
            tr_expire  : null,
           
          },
          { position: "bottom" }
        );
     // })
    } 

})





          }
          else {

            alert("OF n'existe pas ou status <> 'R' ")
            controls.tr_lot.setValue(null);
            document.getElementById("id").focus();
          }
       
        
      
      });
  }

  // add new Item to Datatable
  addNewItem() {
    this.gridService.addItem(
      {
        id: this.dataset.length + 1,
        tr_line: this.dataset.length + 1,
        tr_part: "",
        cmvid: "",
        desc: "",
        tr_qty_loc: 0,
        tr_um: "",
        tr_um_conv: 1,
        tr_price: 0,
        tr_site: "",
        cmvids: "",
        tr_loc: "",
        tr_serial: null,
        tr_status: null,
        tr_expire: null,
      },
      { position: "bottom" }
    );
  }
  
  
  handleSelectedRowsChanged4(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        console.log(item);

       
        
            this.sctService.getByOne({ sct_site: item.pt_site, sct_part: item.pt_part, sct_sim: 'STDCG' }).subscribe(
              (response: any) => {
                this.sct = response.data
            
                this.locationDetailService.getByOne({ ld_site: item.pt_site, ld_loc: item.pt_loc, ld_part: item.pt_part, ld_lot: null }).subscribe(
                  (response: any) => {
                    this.lddet = response.data
                    //console.log(this.lddet.ld_qty_oh)
           if (this.lddet != null)
               {     this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-WO" }).subscribe((resstat:any)=>{
                      console.log(resstat)
                      const { data } = resstat;

                      if (data) {
                        this.stat = null
                      } else {
                        this.stat = this.lddet.ld_status
                      }
            
              updateItem.tr_part = item.pt_part;
              updateItem.desc = item.pt_desc1;
              updateItem.tr_um = item.pt_um;
              updateItem.tr_conv_um = 1;
              
              updateItem.tr_site = item.pt_site;
              updateItem.tr_loc = item.pt_loc;
              updateItem.tr_price = this.sct.sct_mtl_tl;
              
              updateItem.qty_oh =  this.lddet.ld_qty_oh;
              
              updateItem.tr_status =  this.stat;
              updateItem.tr_expire =  this.lddet.ld_expire;
              this.gridService.updateItem(updateItem);
           });
          }
          else {
            updateItem.tr_part = item.pt_part;
            updateItem.desc = item.pt_desc1;
            updateItem.tr_um = item.pt_um;
            updateItem.tr_conv_um = 1;
            
            updateItem.tr_site = item.pt_site;
            updateItem.tr_loc = item.pt_loc;
            updateItem.tr_price = this.sct.sct_mtl_tl;
            
            updateItem.qty_oh =  0;
            
            updateItem.tr_status =  null;
            updateItem.tr_expire =  null;
            this.gridService.updateItem(updateItem);


          }
          });  
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
    this.itemsService
      .getAll()
      .subscribe((response: any) => (this.items = response.data));
  }
  open4(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }
  onAlertClose($event) {
    this.hasFormErrors = false;
  }
  handleSelectedRowsChangedsite(e, args) {
      let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
      if (Array.isArray(args.rows) && this.gridObjsite) {
        args.rows.map((idx) => {
          const item = this.gridObjsite.getDataItem(idx);
          console.log(item);
  
              
          updateItem.tr_site = item.si_site;
          
          this.gridService.updateItem(updateItem);
       
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
   

    handleSelectedRowsChangedloc(e, args) {
      let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
      if (Array.isArray(args.rows) && this.gridObjloc) {
        args.rows.map((idx) => {
          const item = this.gridObjloc.getDataItem(idx);
          console.log(item);
  console.log(updateItem.tr_site )
              

          this.locationService.getByOne({ loc_loc: item.tr_loc, loc_site: updateItem.tr_site }).subscribe(
            (response: any) => {
              this.location = response.data
              if (response.data) {

                this.locationDetailService.getByOne({ ld_site: updateItem.tr_site, ld_loc: item.tr_loc, ld_part: updateItem.tr_part, ld_lot: updateItem.tr_serial }).subscribe(
                  (response: any) => {
                    this.lddet = response.data
                  //  console.log(this.lddet[0].ld_qty_oh)
           if (this.lddet){
             
                      this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-WO" }).subscribe((resstat:any)=>{
                        console.log(resstat)
                        const { data } = resstat;

                        if (data) {
                          this.stat = null
                        } else {
                          this.stat = this.lddet.ld_status
                        }
                    updateItem.tr_loc = item.loc_loc
                    updateItem.tr_status = this.stat
                    updateItem.qty_oh = this.lddet.ld_qty_oh
                    updateItem.tr_expire = this.lddet.tr_expire
                    this.gridService.updateItem(updateItem);
                    
                      });     
   
           }
           else {
            updateItem.tr_loc = item.loc_loc
            updateItem.tr_status = null
            updateItem.qty_oh = 0
            updateItem.tr_expire = null
            this.gridService.updateItem(updateItem);
           }
          })
                  }
                  else {
                    alert("Emplacement Nexiste pas")
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_loc: null, tr_status: null })
                  }
                   
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
      let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
      if (Array.isArray(args.rows) && this.gridObjlocdet) {
        args.rows.map((idx) => {
          const item = this.gridObjlocdet.getDataItem(idx);
          console.log(item);
  
              

          this.inventoryStatusService.getAllDetails({isd_status: item.ld_status, isd_tr_type: "ISS-WO" }).subscribe((res:any)=>{
            console.log(res)
            const { data } = res;
  
          if (data) {
            alert ("Mouvement Interdit Pour ce Status")
            updateItem.tr_serial = null;
            updateItem.tr_expire = null;
            updateItem.qty_oh = 0;

          }else {
            updateItem.tr_serial = item.ld_lot;
            updateItem.tr_status = item.ld_status;
            updateItem.tr_expire = item.ld_expire;
            updateItem.qty_oh = item.ld_qty_oh;
            
            this.gridService.updateItem(updateItem);
  
          }
            
          })

    


          
          
          this.gridService.updateItem(updateItem);
          
    });
 
      }
    }
    angularGridReadylocdet(angularGrid: AngularGridInstance) {
      this.angularGridlocdet = angularGrid;
      this.gridObjlocdet = (angularGrid && angularGrid.slickGrid) || {};
    }
  
    prepareGridlocdet() {
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
          id: "ld_qty_oh",
          name: "Qte",
          field: "ld_qty_oh",
          sortable: true,
          filterable: true,
          type: FieldType.float,
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
          id: "ld_expire",
          name: "Expire",
          field: "ld_expire",
          sortable: true,
          filterable: true,
          type: FieldType.string,
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
        .getBy({ ld_site:  updateItem.tr_site , ld_loc:  updateItem.tr_loc, ld_part:  updateItem.tr_part })
        .subscribe((response: any) => (this.datalocdet = response.data));
    }
    openlocdet(contentlocdet) {
      this.prepareGridlocdet();
      this.modalService.open(contentlocdet, { size: "lg" });
    }

    handleSelectedRowsChangedum(e, args) {
      let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
      if (Array.isArray(args.rows) && this.gridObjum) {
        args.rows.map((idx) => {
          const item = this.gridObjum.getDataItem(idx);
          updateItem.tr_um = item.code_value;
       
          this.gridService.updateItem(updateItem);

/*********/
console.log(updateItem.tr_part)

        this.itemsService.getBy({pt_part: updateItem.tr_part }).subscribe((resp:any)=>{
                        
          if   (updateItem.tr_um == resp.data.pt_um )  {
            
            updateItem.tr_um_conv = 1
          } else { 
            //console.log(resp.data.pt_um)



              this.mesureService.getBy({um_um: updateItem.tr_um, um_alt_um: resp.data.pt_um, um_part: updateItem.tr_part  }).subscribe((res:any)=>{
              console.log(res)
              const { data } = res;

            if (data) {
              //alert ("Mouvement Interdit Pour ce Status")
              updateItem.tr_um_conv = res.data.um_conv 
              this.angularGrid.gridService.highlightRow(1, 1500);
            } else {
              this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: updateItem.tr_um, um_part: updateItem.tr_part  }).subscribe((res:any)=>{
                console.log(res)
                const { data } = res;
                if (data) {
                  //alert ("Mouvement Interdit Pour ce Status")
                  updateItem.tr_um_conv = res.data.um_conv
                  
                } else {
                  updateItem.tr_um_conv = 1
                  updateItem.tr_um = null
          
                  alert("UM conversion manquante")
                  
                }  
              })

            }
              })

            }
            })


/***********/








        });
      }
    }
  angularGridReadyum(angularGrid: AngularGridInstance) {
      this.angularGridum = angularGrid
      this.gridObjum = (angularGrid && angularGrid.slickGrid) || {}
  }
  
  prepareGridum() {
      this.columnDefinitionsum = [
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
      ]
  
      this.gridOptionsum = {
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
          .getBy({ code_fldname: "pt_um" })
          .subscribe((response: any) => (this.ums = response.data))
  }
  openum(content) {
      this.prepareGridum()
      this.modalService.open(content, { size: "lg" })
  }


  handleSelectedRowsChangedstatus(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjstatus) {
      args.rows.map((idx) => {
        const item = this.gridObjstatus.getDataItem(idx);

        this.inventoryStatusService.getAllDetails({isd_status: item.is_status, isd_tr_type: "ISS-WO" }).subscribe((res:any)=>{
          console.log(res)
          const { data } = res;

        if (data) {
          alert ("Mouvement Interdit Pour ce Status")
        }else {
          updateItem.tr_status = item.is_status;
     
          this.gridService.updateItem(updateItem);

        }
          
        })

                });
    }
  }


angularGridReadystatus(angularGrid: AngularGridInstance) {
    this.angularGridstatus = angularGrid
    this.gridObjstatus = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridstatus() {
    this.columnDefinitionsstatus = [
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
        id: "is_status",
        name: "Status",
        field: "is_status",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "is_desc",
        name: "Designation",
        field: "is_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "is_avail",
        name: "Disponible",
        field: "is_avail",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "is_nettable",
        name: "Gerer MRP",
        field: "is_nettable",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "is_overissue",
        name: "Sortie Excedent",
        field: "is_overissue",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
  
  
    ];
  
    this.gridOptionsstatus = {
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
    this.inventoryStatusService
      .getAll()
      .subscribe((response: any) => (this.statuss = response.data));
      console.log(this.statuss)
}
openstatus(content) {
    this.prepareGridstatus()
    this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChanged2(e, args) {
  const controls = this.trForm.controls;
  if (Array.isArray(args.rows) && this.gridObj2) {
    args.rows.map((idx) => {
      const item = this.gridObj2.getDataItem(idx);
     
      this.provider = item
      controls.tr_addr.setValue(item.ad_addr || "");
     


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
      id: "ad_addr",
      name: "code",
      field: "ad_addr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_name",
      name: "Nom",
      field: "ad_name",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_phone",
      name: "Numero telephone",
      field: "ad_phone",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxable",
      name: "A Taxer",
      field: "ad_taxable",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxc",
      name: "Taxe",
      field: "ad_taxc",
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
  this.addressService
    .getAll()
    .subscribe((response: any) => (this.adresses = response.data));
}
open2(content) {
  this.prepareGrid2();
  this.modalService.open(content, { size: "lg" });
}

handleSelectedRowsChanged5(e, args) {
  const controls = this.trForm.controls;

  this.dataset=[]
  
  if (Array.isArray(args.rows) && this.gridObj5) {
    args.rows.map((idx) => {
      const item = this.gridObj5.getDataItem(idx);
      controls.tr_lot.setValue(item.id || "");
     
      controls.tr_nbr.setValue(item.wo_nbr);
      controls.tr_part.setValue(item.wo_part);
      controls.desc.setValue(item.item.pt_desc1)
     
      const id = item.id
      this.workOrderDetailService.getBy({wod_lot: id,wod__qadl01: false}).subscribe(
        (resp: any) => {
        
        
        this.detail  = resp.data;
      
        //for (var object = 0; object < this.detail.length; object++) {
          for (const object in this.detail) {
            const det = this.detail[object];
          

              
                this.gridService.addItem(
                  {
                    id: this.dataset.length + 1,
                    tr_line : this.dataset.length + 1,
                    wodid:    det.id,
        
                    tr_part    : det.wod_part,
                    desc       :   det.item.pt_desc1,
                    tr_um      : det.wod_um,
                    tr_um_conv : 1,
                    tr_qty_loc : 0,
                    qty_oh     : 0, 
                    tr_site    : det.wod_site,
                    tr_loc     : null,
                    tr_status  : null,
        
                    tr_serial  : det.wod_serial,
                    tr_expire  : null,
                   
                  },
                  { position: "bottom" }
                );
            
           } 
      
      })
      
        }
      );



    
  }
}

angularGridReady5(angularGrid: AngularGridInstance) {
  this.angularGrid5 = angularGrid;
  this.gridObj5 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGrid5() {
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
      id: "wo_nbr",
      name: "N° OF",
      field: "wo_nbr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "wo_ord_date",
      name: "Date",
      field: "wo_ord_date",
      sortable: true,
      filterable: true,
      type: FieldType.date,
    },
    {
      id: "wo_part",
      name: "Article",
      field: "wo_part",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "wo_status",
      name: "status",
      field: "wo_status",
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
  this.workOrderService
    .getBy({wo_status: "R"})
    .subscribe((response: any) => {
     // console.log(response.data)
      this.wos = response.data });
    
    
    
  }
open5(content) {
  this.prepareGrid5();
  this.modalService.open(content, { size: "lg" });
}

addsameItem(i ) {
  console.log(i)
  console.log(this.dataset)
  this.gridService.addItem(
    {
      id: this.dataset.length + 1,
      tr_line: this.dataset.length + 1,
      tr_part: this.dataset[i - 1].tr_part,
      cmvid: "",
      desc: this.dataset[i - 1].desc,
      qty_oh: 0,
      tr_um_conv: 1,      
      tr_um: this.dataset[i - 1].tr_um,
      tr_price: this.dataset[i - 1].tr_price,
      tr_site: this.dataset[i - 1].tr_site,
      tr_loc: this.dataset[i - 1].tr_loc,
      tr_serial: null,
      tr_status: null,
      
      tr_expire: null,
    },
    { position: "bottom" }
  );
}

}






