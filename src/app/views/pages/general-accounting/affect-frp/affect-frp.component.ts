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
import { round } from 'lodash';
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
  Frais,
  FraisService,
  AccountPayableService,
  PurchaseReceiveService,

} from "../../../../core/erp";
import { DecimalPipe } from "@angular/common";
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY } from "@angular/cdk/overlay/overlay-directives";

@Component({
  selector: 'kt-affect-frp',
  templateUrl: './affect-frp.component.html',
  styleUrls: ['./affect-frp.component.scss']
})
export class AffectFrpComponent implements OnInit {

  frais: Frais;
  frpForm: FormGroup;
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

  vhs: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  dataprh: [];
  columnDefinitionsprh: Column[] = [];
  gridOptionsprh: GridOption = {};
  gridObjprh: any;
  angularGridprh: AngularGridInstance;


  angularGridfrp: AngularGridInstance;
  gridfrp: any;
  gridServicefrp: GridService;
  dataViewfrp: any;
  columnDefinitionsfrp: Column[];
  gridOptionsfrp: GridOption;
  frpdataset: any[];

  amt: number;
  bool : boolean;
  row_number;
  message = "";
  details: any;
  datasetPrint = [];
  cfrpdataset = [];
  ap_cr_terms: any[] = [];
  detail = [];
 qty: number;
  user;
  bank;
  pshnbr: String;
  isExist: Boolean;
  isExistc: Boolean;
  provider;
  curr: any;  
  find: Boolean;
  rest: number;
  date: String;
  constructor(
    config: NgbDropdownConfig,
    private frpFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public  dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private fraisService: FraisService,
    private purchaseReceiveService: PurchaseReceiveService,
   
    private accountPayableService: AccountPayableService,
  
  ) {
      this.initGrid();
      this.initGridfrp();
  
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
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 50,
        maxWidth: 50,
    },
      
      {
        id: "prh_nbr",
        name: "N° RC",
        field: "prh_nbr",
        sortable: true,
        minWidth: 200,
        maxWidth: 200,
        filterable: false,
        
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
          const controls = this.frpForm.controls;
          this.row_number = args.row;
          
          
          let element: HTMLElement = document.getElementById(
            "openPrhsGrid"
          ) as HTMLElement;
          element.click();
          
        },
      },
      {
        id: "effdate",
        name: "Date",
        field: "effdate",
        sortable: true,
        minWidth: 250,
        maxWidth: 250,
        filterable: false,
        formatter: Formatters.dateIso,
        type: FieldType.dateIso,
      },
      {
        id: "amt",
        name: "Montant",
        field: "amt",
        sortable: true,
        minWidth: 200,
        maxWidth: 200,
        filterable: false,
      
      
        
      },
      
      
      
    ];

    this.gridOptions = {
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
          { columnId: 'psh_line', direction: 'ASC' }
        ],
      },*/
    };

    this.dataset = [];
  }




  gridReadyfrp(angularGrid: AngularGridInstance) {
    this.angularGridfrp = angularGrid;
    this.dataViewfrp = angularGrid.dataView;
    this.gridfrp = angularGrid.slickGrid;
    this.gridServicefrp = angularGrid.gridService;
  }

  initGridfrp() {
    this.columnDefinitionsfrp = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 50,
        maxWidth: 50,
    },
      
    {
      id: "frp_prh_nbr",
      name: "N RC",
      field: "frp_prh_nbr",
      sortable: true,
      filterable: false,
      
    }, 
    {
      id: "frp_part",
      name: "Artice",
      field: "frp_part",
      sortable: true,
      filterable: false,
      
    },
    {
      id: "frp_qty_rcv",
      name: "Qte",
      field: "frp_qty_rcv",
      sortable: true,
      filterable: false,
      
    },

    {
      id: "frp_price",
      name: "Prix",
      field: "frp_price",
      sortable: true,
      filterable: false,
      
    },
    {
      id: "amt_afct",
      name: "Montant ",
      field: "amt_afct",
      sortable: true,
      filterable: false,
      editor: {
        model: Editors.float,
        params: { decimalPlaces: 2 }
      },
      
    },
      
    ];

    this.gridOptionsfrp = {
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

    //this.dataset = [];
  }
  


 ngOnInit(): void {
    this.reset();
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.createForm();
  }

  
  //create form
  createForm() {
    this.loadingSubject.next(false);
      this.frais = new Frais();
      const date = new Date;
      
      this.frpForm = this.frpFB.group({
    //    so__chr01: [this.frais.ap__chr01],
       
        frp_inv_nbr: [this.frais.frp_inv_nbr  , Validators.required],
        
      
        frp_effdate: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
       }],
        
        amt:  [{value: 0  }],
        frp_rmks:  [this.frais.frp_rmks  ],
      
        frp_type_affect: [this.frais.frp_type_affect ],
        

      });
  
      
  
    }



    addNewItem() {
      const controls = this.frpForm.controls;
      
  
          this.gridService.addItem(
            {
              id: this.dataset.length + 1,
              frp_prh_nbr: "",
              effdate: null,
              amt: 0,
              
            },
            { position: "bottom" }
          );
    }
  
  //reste form
  reset() {
    this.frais = new Frais();
    this.createForm();
    this.dataset = [];
    
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.frpForm.controls;
    /** check form */
    if (this.frpForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }
    
   
    
    let ap = this.prepareAP()
    //this.addAP(ap, this.dataset, this.cfdataset);


  }

  prepareAP(): any {
    const controls = this.frpForm.controls;
   
    const _frais = new Frais();
   
    _frais.frp_inv_nbr = controls.frp_inv_nbr.value;
    
    _frais.frp_effdate = controls.frp_effdate.value
      ? `${controls.frp_effdate.value.year}/${controls.frp_effdate.value.month}/${controls.frp_effdate.value.day}`
      : null;

    _frais.frp_rmks = controls.frp_rmks.value; 
    _frais.frp_type_affect = controls.frp_type_affect.value; 
    
    return _frais;
  
  }
  /**
   * Add po
   *
   * @param _frais: ap
   */
  addAP(_frais: any, detail: any, cfdetail:any) {
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
     
    }
    this.loadingSubject.next(true);
    let ar = null;
    const controls = this.frpForm.controls;

  /*  this.fraisService
      .add({ accountPayable: _frais, accountPayableDetail: detail, gldetail: cfdetail })
      .subscribe(
        (reponse: any) => (ar = reponse.data),
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
          console.log(this.dataset);
          
          this.router.navigateByUrl("/account-Payable/create-account-Payable");
          this.reset()
        }
      );*/
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

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  
 

handleSelectedRowsChanged4(e, args) {
  let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
  const controls = this.frpForm.controls;
  
  if (Array.isArray(args.rows) && this.gridObj4) {
    args.rows.map((idx) => {

      
      const item = this.gridObj4.getDataItem(idx);
     
      
    //  console.log(this.invoice)
      
      
    controls.frp_inv_nbr.setValue(item.ap_nbr)  
    controls.amt.setValue(item.ap_amt)  
      
    }  
    )
  
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
      id: "ap_nbr",
      name: "Facture ",
      field: "ap_nbr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ap_effdate",
      name: "Date Effet",
      field: "ap_effdate",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ap_amt",
      name: "Montant",
      field: "ap_amt",
      sortable: true,
      filterable: true,
      type: FieldType.float,
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
  this.accountPayableService
    .getBy({ ap_type: "I", ap_open: true})
    .subscribe((response: any) => (this.vhs = response.data));
}
open4(content) {
  this.prepareGrid4();
  this.modalService.open(content, { size: "lg" });
}




handleSelectedRowsChangedprh(e, args) {
  let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjprh) {
    args.rows.map((idx) => {
      const item = this.gridObjprh.getDataItem(idx);
         
            updateItem.prh_nbr = item.prh_receiver;
            updateItem.effdate = item.prh_rcp_date;
            
            this.gridService.updateItem(updateItem);

            this.purchaseReceiveService.findBy({ prh_receiver : item.prh_receiver }).subscribe(
              (res: any) => {
               
                this.details  = res.data;
               
                //console.log(this.details)
                for (var object = 0; object < this.details.length; object++) {
                  const detail = this.details[object];
              
                 
                 this.cfrpdataset.push(
              {
                  id: this.cfrpdataset.length + 1,
                  frp_prh_nbr : detail.prh_receiver,
                  frp_part : detail.prh_part,
                  frp_qty_rcv : detail.prh_rcvd,
                  frp_price: detail.prh_pur_cost,
        
                
              },
                 // { position: "bottom" }
                  );
               
              
              }
            })
        
    });
  
}
}

angularGridReadyprh(angularGrid: AngularGridInstance) {
  this.angularGridprh = angularGrid;
  this.gridObjprh = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridprh() {
  this.columnDefinitionsprh = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "prh_receiver",
      name: "N RC",
      field: "prh_receiver",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "prh_rcp_date",
      name: "Date",
      field: "prh_rcp_date",
      sortable: true,
      filterable: true,
      type: FieldType.dateIso,
    },
    
  ];

  this.gridOptionsprh = {
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
  this.purchaseReceiveService
    .getGroup() 
    .subscribe((response: any) => (this.dataprh = response.data));
}
openprh(content) {
  this.prepareGridprh();
  this.modalService.open(content, { size: "lg" });
}





oncreateFRP() {
  const controls = this.frpForm.controls;

  console.log(this.cfrpdataset.length)
  
this.qty = 0
for (var i = 0; i < this.cfrpdataset.length; i++) {
if (controls.frp_type_affect.value == "Quantite") {
  this.qty = this.qty +  Number(this.cfrpdataset[i].frp_qty_rcv)
}
else {

  this.qty = this.qty +  Number(this.cfrpdataset[i].frp_qty_rcv) *  Number(this.cfrpdataset[i].frp_price) 

}
}
console.log(this.qty)
let afc = 0  
for (var i = 0; i < this.cfrpdataset.length; i++) {
    //console.log(this.dataset[i].prh_nbr)
    if (controls.frp_type_affect.value == "Quantite") {
      afc = Number(this.cfrpdataset[i].frp_qty_rcv) * (Number(controls.amt.value) / this.qty) 

    }
    else {
afc = Number(this.cfrpdataset[i].frp_qty_rcv) * Number(this.cfrpdataset[i].frp_price)  * Number(controls.amt.value) / Number(this.qty) 
        
}  
    this.gridServicefrp.addItem(
      {
          id: i + 1,
          frp_prh_nbr : this.cfrpdataset[i].frp_prh_nbr,
          frp_part : this.cfrpdataset[i].frp_part,
          frp_qty_rcv : this.cfrpdataset[i].frp_qty_rcv,
          frp_price: this.cfrpdataset[i].frp_price,
        amt_afct : afc,
      },
          { position: "bottom" }
          );
       
       
      }
      console.log(this.qty)
   

 /*for (var i = 0; i < this.dataset.length; i++) {
//console.log(this.dataset[i].prh_nbr)

    this.purchaseReceiveService.findBy({ prh_receiver : this.dataset[i].prh_nbr }).subscribe(
      (res: any) => {
       
        this.details  = res.data;
       
        //console.log(this.details)
        for (var object = 0; object < this.details.length; object++) {
          const detail = this.details[object];
      
         
         this.gridServicefrp.addItem(
      {
          id: i + 1,
          frp_prh_nbr : detail.prh_receiver,
          frp_part : detail.prh_part,
          frp_qty_rcv : detail.prh_rcvd,
          frp_price: detail.prh_pur_cost,

        
      },
          { position: "bottom" }
          );
       
      
      }
    })
  }
*/
  
}
}
