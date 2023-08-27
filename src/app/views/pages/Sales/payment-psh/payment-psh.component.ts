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
 
  AccountShiper,
  AccountShiperService,
  CustomerService,
  AddressService,
  DeviseService,
  CodeService,
  InvoiceOrderService,
  BankService,
  SaleOrderService,
 

} from "../../../../core/erp";
import { DecimalPipe } from "@angular/common";


@Component({
  selector: 'kt-payment-psh',
  templateUrl: './payment-psh.component.html',
  styleUrls: ['./payment-psh.component.scss']
})
export class PaymentPshComponent implements OnInit {

  accountShiper: AccountShiper;
  asForm: FormGroup;
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
  details: any [];

  bls: [];
    columnDefinitionsbl: Column[] = [];
    gridOptionsbl: GridOption = {};
    gridObjbl: any;
    angularGridbl: AngularGridInstance;
    
 
  
    banks: [];
    columnDefinitionsbank: Column[] = [];
    gridOptionsbank: GridOption = {};
    gridObjbank: any;
    angularGridbank: AngularGridInstance;
  
  
  row_number;
  message = "";
  
  datasetPrint = [];
  as_cr_method: any[] = [];
  bl: any;
  user;
  pshnbr: String;
  check;
  nbr;
  constructor(
    config: NgbDropdownConfig,
    private asFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public  dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private customerService: CustomerService,
    private bankService: BankService,
    private accountShiperService: AccountShiperService,
    private saleOrderService: SaleOrderService,
    private codeService: CodeService,
    

  ) {
    config.autoClose = true;
    this.codeService
    .getBy({ code_fldname: "cm_cr_terms" })
    .subscribe((response: any) => (this.as_cr_method = response.data));
    this.prepareGrid();
  }
  ngOnInit(): void {
    this.reset();
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.createForm();
    this.prepareGrid();
  }
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
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
     /* {
        id: "as_ship",
        name: "CMD N°",
        field: "as_ship",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },*/
      {
        id: "as_bank",
        name: "Banque",
        field: "as_bank",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "as_check",
        name: "Cheque",
        field: "as_check",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "as_effdate",
        name: "Date",
        field: "as_effdate",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "as_amt",
        name: "Montant",
        field: "as_amt",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "as_pay_method",
        name: "Type paiment",
        field: "as_pay_method",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];
  
  
    this.gridOptions = {
      asyncEditorLoading: true,
        
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
      
    
  
  
  
      dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
        var val = undefined;
        try {
          val = eval("item." + column.field);
        } catch (e) {
          // ignore
        }
        return val;
      },
  
  
  }
  
  // fill the dataset with your data
  this.dataset = []
  const date = new Date;
      console.log(date)
  //this.dataset = []
  /*this.soService.getByAll({so_ord_date: date}).subscribe(
    
      (response: any) => (this.dataset = response.data),
      
      (error) => {
          this.dataset = []
      },
      () => {}
      
  )
  console.log(this.dataset)*/
    // fill the dataset with your data
  }
  
  //create form
  createForm() {
    this.loadingSubject.next(false);
      this.accountShiper = new AccountShiper();
      const date = new Date;
      
      this.asForm = this.asFB.group({
    //    so__chr01: [this.accountShiper.as__chr01],
        as_ship:[this.accountShiper.as_ship , Validators.required],
        as_cust: [{value: this.accountShiper.as_cust , disabled: true} ],
        name: [{value:"", disabled: true}],
        prenom: [{value:"", disabled: true}],
       
        amt:[{value:0, disabled: true}],
        rest:[{value:0, disabled: true}],
       
        
      
        as_effdate: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }],
        
        as_bank: [this.accountShiper.as_bank],
       
        as_pay_method: [this.accountShiper.as_pay_method, Validators.required],
        
        as_check: [this.accountShiper.as_check ],

        as_amt: [this.accountShiper.as_amt],
        as_mrgn_amt: [this.accountShiper.as_mrgn_amt],
        as_po: [this.accountShiper.as_po],
        lib: [false],
        


      });
  
      
      
  
    }



    OnchangeBank (){

      const controls = this.asForm.controls 
      const bk_code  = controls.as_bank.value
     
      
    this.bankService.getBy({bk_code}).subscribe((res:any)=>{
        //const {data} = res.data.bank
        //console.log(res.data.bank)
        if (res.data.bank == null){ this.layoutUtilsService.showActionNotification(
            "cette banque n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
        )
        this.error = true}
        else {
            this.error = false
    
       //     this.bankService
       //   .getAllDetails({ bkd_bank: bk_code, bkd_module: "AR" })
       //   .subscribe((response: any) => {(this.as_cr_method = response.data)
       //   console.log("hhhhhhhhhhhhhhh",this.as_cr_method)
       // })    
            
        }
  
  
    },error=>console.log(error))
  }  
  //reste form
  reset() {
    this.accountShiper = new AccountShiper();
    this.createForm();
    
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.asForm.controls;
    /** check form */
    if (this.asForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }

   
    let as = this.prepareAS()
    this.addAS(as);


  }

  prepareAS(): any {
    
    const controls = this.asForm.controls;
   
     const _as = new AccountShiper();
      _as.as_ship = controls.as_ship.value;
      _as.as_cust = controls.as_cust.value;
      _as.as_curr = "DA";
      
      
      _as.as_effdate = controls.as_effdate.value
        ? `${controls.as_effdate.value.year}/${controls.as_effdate.value.month}/${controls.as_effdate.value.day}`
        : null;
  
       
      
      _as.as_type = "P";
     
      _as.as_pay_method = controls.as_pay_method.value;
      _as.as_check = controls.as_check.value;
    
      _as.as_amt = controls.as_amt.value;
      _as.as_applied = controls.as_amt.value;
      _as.as_po = controls.as_po.value;
                      
      _as.as_mrgn_amt  = controls.as_mrgn_amt.value;
     
      if (controls.lib.value == true) {
        _as.as_open = true
      }
      else {
        _as.as_open = false
      }

     return _as;
    
  
  }
  /**
   * Add po
   *
   * @param _as: as
   */
  addAS(_as: AccountShiper) {
    this.loadingSubject.next(true);
    let as = null;
    const controls = this.asForm.controls;

    this.accountShiperService
      .add(_as )
      .subscribe(
        (reponse: any) => (as = reponse.data),
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
          
          this.router.navigateByUrl("/Sales/payment-psh");
          this.reset()
        }
      );
  }
 
  


  onChangeBL() {
    const controls = this.asForm.controls;
    const as_nbr = controls.as_ship.value;
    
    this.accountShiperService.getBy({ as_nbr, as_type : "I" }).subscribe(
      (res: any) => {
      //  console.log(res);
        const { data } = res.data;

        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "ce BL n'existe pas ou bien payé totalement!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
          controls.as_ship.setValue(null);
          document.getElementById("check").focus();
          document.getElementById("bl").focus();
        } else {
          this.error = false;
          
          controls.as_ship.setValue(data.as_nbr || "");
          controls.as_cust.setValue(data.as_cust || "");
         
          controls.as_curr.setValue(data.as_curr || "");
          controls.amt.setValue(data.as_amt || "");
          controls.rest.setValue(Number(data.as_amt) - Number(data.as_applied) || "");
        
      controls.as_pay_method.setValue(data.as_pay_method || "");
     
      this.customerService.getBy({cm_addr: data.as_cust}).subscribe((response: any)=>{
                    
                    
      
        controls.name.setValue(response.data.address.ad_name || "");
        controls.as_bank.setValue(response.data.cm_bank || "");
        controls.as_pay_method.setValue(response.data.cm_pay_method|| "");
      
        
       // this.bankService
       // .getAllDetails({ bkd_bank: response.data.cm_bank, bkd_module: "AR" })
       // .subscribe((response: any) => {(this.as_cr_method = response.data)
     
     //   })
       
       
     

      });    
    
  //  (error) => console.log(error)
    }

  });    
    
  }

  
  

  onChangeCheck() {
    const controls = this.asForm.controls;
    const as_check = controls.as_check.value;
    const as_bank = controls.as_bank.value;
    const as_pay_method = controls.as_pay_method.value;

    
    this.accountShiperService.getBy({ as_check,as_bank, as_pay_method, as_type : "P" }).subscribe(
      (res: any) => {
        this.check = res.data[0];
        
        if (this.check != null) {
    
          this.layoutUtilsService.showActionNotification(
            "ce Cheque Existe Deja",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
          controls.as_check.setValue(null);
          document.getElementById("check").focus();
          
        }
        
     

      });    
    
  //  (error) => console.log(error)
  

    
    
  }
  onChangeAmt() {
    const controls = this.asForm.controls;
  
  
    if (Number(controls.as_amt.value) > Number(controls.rest.value)  ) {
    
          this.layoutUtilsService.showActionNotification(
            "Montant du paiement doit etre inferieur ou egale au montant BL",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
          controls.as_amt.setValue(0);
          document.getElementById("amt").focus();
          
        }
    
    
  }

  onChangeRemise() {
    const controls = this.asForm.controls;
  
  
    if (Number(controls.as_mrgn_amt.value) > Number(controls.rest.value)  ) {
    
          this.layoutUtilsService.showActionNotification(
            "Montant du Remise doit etre inferieur ou egale au montant BL",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
          controls.as_amt.setValue(0);
          document.getElementById("as_mrgn_amt").focus();
          
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

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  
 
handleSelectedRowsChangedbl(e, args) {
  const controls = this.asForm.controls;
  if (Array.isArray(args.rows) && this.gridObjbl) {
    args.rows.map((idx) => {
      const item = this.gridObjbl.getDataItem(idx);
      console.log(item)
      
      this.bl = item;
      controls.as_ship.setValue(item.so_nbr || "");
      controls.as_cust.setValue(item.so_cust || "");
     // controls.as_curr.setValue(item.so_curr || "");
      controls.amt.setValue(item.so__dec01 );
       controls.rest.setValue(Number(item.so__dec01) - Number(item.so__dec02) || "");
      controls.as_pay_method.setValue(item.so_cr_terms || "");
     
      this.customerService.getBy({cm_addr: item.so_cust}).subscribe((response: any)=>{
                    
                    
      
        controls.name.setValue(response.data.address.ad_name || "");
        controls.prenom.setValue(response.data.address.ad_name_control || "");


        this.accountShiperService.getBy({as_ship: item.so_nbr}).subscribe(
          (response: any) =>  { 
    
    this.details = response.data
    var i = 1;
    for (let det of this.details) {
      det.id = i
      i = i + 1

    }
            this.dataset = this.details,
         
         
      
         (error) => {
          
              this.dataset = []
          },
          () => {}
         
        })  
        
     })
      
     
     
  })
}
}

angularGridReadybl(angularGrid: AngularGridInstance) {
  this.angularGridbl = angularGrid;
  this.gridObjbl = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridbl() {
  this.columnDefinitionsbl = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "so_nbr",
      name: "CMD N°",
      field: "so_nbr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "so_cust",
      name: "Client",
      field: "so_cust",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "so_ord_date",
      name: "Date",
      field: "so_ord_date",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "so_amt",
      name: "Montant",
      field: "so_amt",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "so_tax_amt",
      name: "TVA",
      field: "so_tax_amt",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "so_trl1_amt",
      name: "Timbre",
      field: "so_trl1_amt",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionsbl = {
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
  this.saleOrderService
    .getByAll({so_stat: "O", })
    .subscribe((response: any) => (this.bls = response.data));
}
openbl(content) {
  this.prepareGridbl();
  this.modalService.open(content, { size: "lg" });
}



handleSelectedRowsChangedbank(e, args) {
  const controls = this.asForm.controls;
  if (Array.isArray(args.rows) && this.gridObjbank) {
    args.rows.map((idx) => {
      const item = this.gridObjbank.getDataItem(idx);
      controls.as_bank.setValue(item.bk_code || "");
      controls.bank_name.setValue(item.address.ad_name || "");
      //controls.ap_entity.setValue(item.bk_entity || "");

     // this.bankService.getAR({bk_code: item.bk_code}).subscribe((res:any)=>{
       // console.log(res.data)
          //  controls.ap_dy_code.setValue(res.data.details[0].bkd_dy_code || "")
           // controls.as_pay_method.setValue(res.data.details[0].bkd_pay_method || "")
                     
         //   console.log(res.data.details)
       //     this.as_cr_method = res.data.details

     //     });        
    });
  }
}

angularGridReadybank(angularGrid: AngularGridInstance) {
  this.angularGridbank = angularGrid;
  this.gridObjbank = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridbank() {
  this.columnDefinitionsbank = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "bk_code",
      name: "code",
      field: "bk_code",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "address.ad_name",
      name: "Designation",
      field: "address.ad_name",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "bk_curr",
      name: "Devise",
      field: "bk_curr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "bk_entity",
      name: "Entité",
      field: "bk_entity",
      sortable: true,
      filterable: true,
      type: FieldType.boolean,
    },
  ];

  this.gridOptionsbank = {
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
  this.bankService
    .getAll()
    .subscribe((response: any) => (this.banks = response.data));
}
openbank(content) {
  this.prepareGridbank();
  this.modalService.open(content, { size: "lg" });
}

}
