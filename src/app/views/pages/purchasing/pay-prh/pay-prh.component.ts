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
 
  AccountPayable,
  AccountPayableService,
  ProviderService,
  AddressService,
  DeviseService,
  CodeService,
  InvoiceOrderService,
  BankService,
  SequenceService,
  

} from "../../../../core/erp";
import { DecimalPipe } from "@angular/common";


@Component({
  selector: 'kt-pay-prh',
  templateUrl: './pay-prh.component.html',
  styleUrls: ['./pay-prh.component.scss']
})
export class PayPrhComponent implements OnInit {

  accountPayable: AccountPayable;
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
  ap_cr_method: any[] = [];
  bl: any;
  user;
  pshnbr: String;
  check;
  nbr;
  seq;
  prhnbr;
  constructor(
    config: NgbDropdownConfig,
    private asFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public  dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private providerService: ProviderService,
    private bankService: BankService,
    private accountPayableService: AccountPayableService,
    private sequenceService: SequenceService,
    private codeService: CodeService,
    

  ) {
    config.autoClose = true;
    this.codeService
    .getBy({ code_fldname: "vd_cr_terms" })
    .subscribe((response: any) => (this.ap_cr_method = response.data));
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
        id: "ap_ship",
        name: "CMD N°",
        field: "ap_ship",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },*/
      {
        id: "ap_bank",
        name: "Banque",
        field: "ap_bank",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ap_check",
        name: "Cheque",
        field: "ap_check",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ap_effdate",
        name: "Date",
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
        type: FieldType.string,
      },
      {
        id: "ap_pay_method",
        name: "Type paiment",
        field: "ap_pay_method",
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
      this.accountPayable = new AccountPayable();
      const date = new Date;
      
      this.asForm = this.asFB.group({
    //    so__chr01: [this.accountPayable.ap__chr01],
      //  ap_ship:[this.accountPayable.ap_ship , Validators.required],
        ap_vend: [ this.accountPayable.ap_vend , Validators.required ],
        name: [{value:"", disabled: true}],
        ap_curr: [{value: this.accountPayable.ap_curr , disabled: true}],
        amt:[{value:0, disabled: true}],
        
        
      
        ap_effdate: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }],
        
        ap_bank: [this.accountPayable.ap_bank],
       
        ap_pay_method: [this.accountPayable.ap_pay_method, Validators.required],
        
        ap_check: [this.accountPayable.ap_check ],

        ap_amt: [this.accountPayable.ap_amt],
       
        ap_po: [this.accountPayable.ap_po],
        


      });
  
      
      
  
    }



    OnchangeBank (){

      const controls = this.asForm.controls 
      const bk_code  = controls.ap_bank.value
     
      
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
       //   .subscribe((response: any) => {(this.ap_cr_method = response.data)
       //   console.log("hhhhhhhhhhhhhhh",this.ap_cr_method)
       // })    
            
        }
  
  
    },error=>console.log(error))
  }  
  //reste form
  reset() {
    this.accountPayable = new AccountPayable();
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

    this.sequenceService.getByOne({ seq_type: "AP", seq_profile: this.user.usrd_profile }).subscribe(
      (response: any) => {
    this.seq = response.data
    console.log(this.seq)   
        if (this.seq) {
         this.prhnbr = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`
         console.log(this.seq.seq_prefix)
         console.log(this.seq.seq_curr_val)
         
        console.log(this.prhnbr)
         const id = Number(this.seq.id)
      let obj = { }
      obj = {
        seq_curr_val: Number(this.seq.seq_curr_val )+1
      }
      this.sequenceService.update(id , obj ).subscribe(
        (reponse) => console.log("response", Response),
        (error) => {
          this.message = "Erreur modification Sequence";
          this.hasFormErrors = true;
          return;
     
        
        },
        )
      }else {
        this.message = "Parametrage Monquant pour la sequence";
        this.hasFormErrors = true;
        return;
   
       }

      
    
    let as = this.prepareAS()
    this.addAS(as,this.prhnbr);

      })
  }

  prepareAS(): any {
    
    const controls = this.asForm.controls;
   
     const _as = new AccountPayable();
    
      _as.ap_vend = controls.ap_vend.value;
      _as.ap_curr = controls.ap_curr.value;
      
      
      _as.ap_effdate = controls.ap_effdate.value
        ? `${controls.ap_effdate.value.year}/${controls.ap_effdate.value.month}/${controls.ap_effdate.value.day}`
        : null;
  
       
      
      _as.ap_type = "P";
     
      _as.ap_pay_method = controls.ap_pay_method.value;
      _as.ap_check = controls.ap_check.value;
      _as.ap_bank = controls.ap_bank.value;
    
      _as.ap_amt = - Number(controls.ap_amt.value);
      _as.ap_applied = - Number(controls.ap_amt.value);
      _as.ap_base_amt = - Number(controls.ap_amt.value);
      _as.ap_po = controls.ap_po.value;
                      
    
     
     
     return _as;
    
  
  }
  /**
   * Add po
   *
   * @param _as: as
   */
  addAS(_as: AccountPayable,prhnbr) {
    this.loadingSubject.next(true);
    let as = null;
    const controls = this.asForm.controls;

    this.accountPayableService
      .add({_as,prhnbr} )
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
 
  


  
  

  onChangeCheck() {
    const controls = this.asForm.controls;
    const ap_check = controls.ap_check.value;
    const ap_bank = controls.ap_bank.value;
    const ap_pay_method = controls.ap_pay_method.value;

    
    this.accountPayableService.getBy({ ap_check,ap_bank, ap_pay_method, ap_type : "P" }).subscribe(
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
          controls.ap_check.setValue(null);
          document.getElementById("check").focus();
          
        }
        
     

      });    
    
  //  (error) => console.log(error)
  

    
    
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
     
      controls.ap_vend.setValue(item.vd_addr || "");
      controls.ap_curr.setValue(item.vd_curr || "");
      controls.amt.setValue(item.vd_balance || "");
      controls.ap_pay_method.setValue(item.vd_cr_terms || "");
      controls.name.setValue(item.address.ad_name || "");
        //controls.ap_bank.setValue(response.data.cm_bank || "");

      
     
     
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
      id: "vd_addr",
      name: "Code Fournisseur",
      field: "vd_addr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "address.ad_name",
      name: "Fournisseur",
      field: "address.ad_name",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "vd_type",
      name: "Type",
      field: "vd_type",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "vd_balance",
      name: "Solde",
      field: "vd_balance",
      sortable: true,
      filterable: true,
      type: FieldType.float,
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
      controls.ap_bank.setValue(item.bk_code || "");
      controls.bank_name.setValue(item.address.ad_name || "");
      //controls.ap_entity.setValue(item.bk_entity || "");

     // this.bankService.getAR({bk_code: item.bk_code}).subscribe((res:any)=>{
       // console.log(res.data)
          //  controls.ap_dy_code.setValue(res.data.details[0].bkd_dy_code || "")
           // controls.ap_pay_method.setValue(res.data.details[0].bkd_pay_method || "")
                     
         //   console.log(res.data.details)
       //     this.ap_cr_method = res.data.details

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
