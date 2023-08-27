import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"

// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Editor,
    Editors,
    AngularGridInstance,
    GridService,
    Formatters,
    FieldType,
    OnEventArgs,
} from "angular-slickgrid"
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
import { round } from 'lodash';
// Layout
import {
    SubheaderService,
    LayoutConfigService,
} from "../../../../core/_base/layout"
// CRUD
import {
    LayoutUtilsService,
    TypesUtilsService,
    MessageType,
} from "../../../../core/_base/crud"
import { MatDialog } from "@angular/material/dialog"
import {
    NgbModal,
    NgbActiveModal,
    ModalDismissReasons,
    NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap"
import { Quote, QuoteService, CustomerService, UsersService, ItemService, CodeService, DeviseService, printOc, } from "../../../../core/erp"
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";

@Component({
  selector: 'kt-create-quote',
  templateUrl: './create-quote.component.html',
  styleUrls: ['./create-quote.component.scss']
})
export class CreateQuoteComponent implements OnInit {
    quote: Quote
    qoForm: FormGroup
    totForm: FormGroup
    hasFormErrors = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>

    error = false;

    angularGrid: AngularGridInstance
    grid: any
    gridService: GridService
    dataView: any
    columnDefinitions: Column[]
    gridOptions: GridOption
    dataset: any[]

    sequences: []
    columnDefinitions1: Column[] = []
    gridOptions1: GridOption = {}
    gridObj1: any
    angularGrid1: AngularGridInstance

    customers: []
    columnDefinitions2: Column[] = []
    gridOptions2: GridOption = {}
    gridObj2: any
    angularGrid2: AngularGridInstance

    users: []
    columnDefinitions3: Column[] = []
    gridOptions3: GridOption = {}
    gridObj3: any
    angularGrid3: AngularGridInstance

    items: []
    columnDefinitions4: Column[] = []
    gridOptions4: GridOption = {}
    gridObj4: any
    angularGrid4: AngularGridInstance

    devises: [];
    columnDefinitionscurr: Column[] = [];
    gridOptionscurr: GridOption = {};
    gridObjcurr: any;
    angularGridcurr: AngularGridInstance;
    customer
    row_number;
    message=''
    taxable: boolean;
// selects
    qo_cr_terms: any[] = [];
    curr;
  
    constructor(
        config: NgbDropdownConfig,
        private qoFB: FormBuilder,
        private totFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public  dialog: MatDialog,
        private modalService: NgbModal,
        private layoutUtilsService: LayoutUtilsService,
        private quoteService: QuoteService,
        private customersService: CustomerService,
        private userService: UsersService,
        private deviseService: DeviseService,
        private codeService: CodeService,
        private itemsService: ItemService
    ) {
        config.autoClose = true
        this.initGrid()
        this.codeService
        .getBy({ code_fldname: "cm_cr_terms" })
        .subscribe((response: any) => (this.qo_cr_terms = response.data));
      
    }
    gridReady(angularGrid: AngularGridInstance) {
        this.angularGrid = angularGrid
        this.dataView = angularGrid.dataView
        this.grid = angularGrid.slickGrid
        this.gridService = angularGrid.gridService
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
                    if (confirm('étes-vous sur de supprimer cette ligne?')) {
                        this.angularGrid.gridService.deleteItem(args.dataContext);
                      }
                  }
            },
            
            {
                id: "qod_line",
                name: "Ligne",
                field: "qod_line",
                minWidth: 50,
                maxWidth: 50,
                selectable: true,
            },
            {
                id: "qod_part",
                name: "Article",
                field: "qod_part",
                sortable: true,
                width: 50,
                filterable: false,
                editor: {
                    model: Editors.text,
                },
                onCellChange: (e: Event, args: OnEventArgs) => {
                  console.log(args.dataContext.qod_part)
                  const controls = this.qoForm.controls 
                  this.itemsService.getByOne({pt_part: args.dataContext.qod_part }).subscribe((resp:any)=>{
        
                    if (resp.data) {
                      console.log(resp.data)
                                  
            
                      if (controls.so_taxable.value == false) {this.taxable = false} else { this.taxable = resp.data.pt_taxable}
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 ,
                        qod_um:resp.data.pt_um,  qod_price: resp.data.pt_price, qod_disc_pct:0, qod_tax_code:resp.data.pt_taxc, qod_taxc: resp.data.taxe.tx2_tax_pct, qod_taxable: this.taxable})
                       
                       
                                      
              
                 }  else {
                    alert("Article Nexiste pas")
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , qod_part: null })
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
                    this.row_number = args.row
                    let element: HTMLElement = document.getElementById('openItemsGrid') as HTMLElement;
                    element.click();
                  }
            },
            {
                id: "desc",
                name: "Description",
                field: "desc",
                sortable: true,
                width: 120,
                filterable: false,
                
            },
            {
                id: "qod_qty_ord",
                name: "QTE",
                field: "qod_qty_ord",
                sortable: true,
                width: 80,
                filterable: false,
                type: FieldType.float,
                editor: {
                    model: Editors.float,
                },
                onCellChange: (e: Event, args: OnEventArgs) => {
  
                  
       
                  this.calculatetot();
              }
            },
            {
                id: "qod_um",
                name: "UM",
                field: "qod_um",
                sortable: true,
                width: 50,
                filterable: false,
                
            },
            {
                id: "qod_price",
                name: "Prix Un",
                field: "qod_price",
                sortable: true,
                width: 80,
                filterable: false,
                editor: {
                    model: Editors.float,
                },
                onCellChange: (e: Event, args: OnEventArgs) => {
  
                  
       
                  this.calculatetot();
              }  
            },
            {
                id: "qod_disc_pct",
                name: "% remise",
                field: "qod_disc_pct",
                sortable: true,
                width: 80,
                filterable: false,
                editor: {
                    model: Editors.float,
                },  
                onCellChange: (e: Event, args: OnEventArgs) => {
  
                  
       
                  this.calculatetot();
              } 
            },
            {
                id: "qod_taxable",
                name: "A Taxer",
                field: "qod_taxable",
                sortable: true,
                width: 80,
                filterable: false,
                editor: {
                    model: Editors.checkbox
                  },
                  formatter: Formatters.checkmark,
                  cannotTriggerInsert: true,
                  onCellChange: (e: Event, args: OnEventArgs) => {
  
                 
                    this.calculatetot();
                }
            },
            
            {
              id: "qod_tax_code",
              name: "Code de Taxe",
              field: "qod_tax_code",
              sortable: true,
              width: 80,
              filterable: false,
              
            },

            {
              id: "qod_taxc",
              name: "Taux Taxe",
              field: "qod_taxc",
              sortable: true,
              width: 80,
              filterable: false,
              editor: {
                  model: Editors.text,
                },
                formatter: Formatters.percentComplete,
                onCellChange: (e: Event, args: OnEventArgs) => {

                  
       
                  this.calculatetot();
              }
          },
            {
                id: "qod_desc",
                name: "Observation",
                field: "qod_desc",
                sortable: true,
                width: 80,
                filterable: false,
                editor: {
                    model: Editors.longText,
                },
            },
            
        ]

        this.gridOptions = {
            asyncEditorLoading: false,
            editable: true,
            enableColumnPicker: true,
            enableCellNavigation: true,
            enableRowSelection: true,
        }

        this.dataset = []
    }
    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.createForm()
        this.createtotForm();
    }

    //create form
    createForm() {
        this.loadingSubject.next(false)
        this.quote = new Quote()
        const date = new Date()
        
     
        
        this.qoForm = this.qoFB.group({
          
          qo_cust: [this.quote.qo_cust ],
          qo_exp_date: [{
            year:date.getFullYear(),
            month: date.getMonth()+1,
            day: date.getDate()
          }],
          qo_ord_date: [{
            year:date.getFullYear(),
            month: date.getMonth()+1,
            day: date.getDate()
          }],
          qo_due_date: [{
            year:date.getFullYear(),
            month: date.getMonth()+1,
            day: date.getDate()
          }],
          qo_po: [this.quote.qo_po ],
          qo_cr_terms: [this.quote.qo_cr_terms ],
          qo_curr: [this.quote.qo_curr ],
          qo_taxable: [this.quote.qo_taxable ],
          qo_userid: [this.quote.qo_userid],
          qo_div: [this.quote.qo_div ],
          qo_stat: [this.quote.qo_stat ],
          qo_rmks: [this.quote.qo_rmks ],
          print:[true]
        })
    }
    createtotForm() {
      this.loadingSubject.next(false);
      //this.saleOrder = new SaleOrder();
     // const date = new Date;
      
      this.totForm = this.totFB.group({
    //    so__chr01: [this.saleOrder.so__chr01],
        tht: [{value: 0.00 , disabled: true}],
        tva: [{value: 0.00 , disabled: true}],
        timbre: [{value: 0.00 , disabled: true}],
        ttc: [{value: 0.00 , disabled: true}],
      });
  
      
      
  
    }
   
    //reste form
    reset() {
        this.quote = new Quote()
        this.createForm()
        this.createtotForm()
        this.hasFormErrors = false
    }
    // save data
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.qoForm.controls
        /** check form */
        if (this.qoForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )
            this.message = 'Modifiez quelques �l�ments et r�essayez de soumettre.'
            this.hasFormErrors = true

            return
        }

        if (!this.dataset.length){
            this.message = 'La liste des article ne peut pas etre vide'
            this.hasFormErrors = true

            return
        }
        // tslint:disable-next-line:prefer-const
        let qo = this.prepareQuote()
        for(let data of this.dataset){
          delete data.id
          delete data.cmvid
         // delete data.desc
        }
        this.addQo(qo, this.dataset)
    }
    
    /**
     *
     * Returns object for saving
     */
    prepareQuote(): any {
        const controls = this.qoForm.controls
        const _quote = new Quote()
    
          _quote.qo_cust =  controls.qo_cust.value
          _quote.qo_ord_date=  controls.qo_ord_date.value ? `${controls.qo_ord_date.value.year}/${controls.qo_ord_date.value.month}/${controls.qo_ord_date.value.day}`: null
          _quote.qo_exp_date=  controls.qo_exp_date.value ? `${controls.qo_exp_date.value.year}/${controls.qo_exp_date.value.month}/${controls.qo_exp_date.value.day}`: null
          _quote.qo_due_date=  controls.qo_due_date.value ? `${controls.qo_due_date.value.year}/${controls.qo_due_date.value.month}/${controls.qo_due_date.value.day}`: null
          _quote.qo_rmks=  controls.qo_rmks.value
          _quote.qo_curr=  controls.qo_curr.value
          _quote.qo_cr_terms=  controls.qo_cr_terms.value
          _quote.qo_taxable=  controls.qo_taxable.value
          _quote.qo_relee= false
          
        return _quote
    }
    /**
     * Add Quote
     *
     * @param _quote: Quote
     */
    addQo(_qo: any, detail: any) {
        for (let data of detail) {
          delete data.id;
          delete data.cmvid;
          
        }
        this.loadingSubject.next(true);
        let qo = null;
        const controls = this.qoForm.controls;
    
        this.quoteService
          .add({ quoteOrder: _qo, quoteOrderDetail: detail })
          .subscribe(
            (reponse: any) => (qo = reponse.data),
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

              if(controls.print.value == true) this.printpdf(qo.qo_nbr) //printOc(this.customer, this.dataset,qo);
              this.router.navigateByUrl("/");
            }
          );
      }
      
    /**
     * Go back to the list
     *
     */
    onChangeCust() {
        const controls = this.qoForm.controls; // chof le champs hada wesh men form rah
        const cm_addr = controls.qo_cust.value;
       
  
        this.customersService.getBy({ cm_addr }).subscribe(
          (res: any) => {
            console.log(res);
            const { data } = res;
    
            if (!data) {
              this.layoutUtilsService.showActionNotification(
                "ce Client n'existe pas!",
                MessageType.Create,
                10000,
                true,
                true
              );
              this.error = true;
            } else {
              this.error = false;
              controls.qo_cust.setValue(res.data.cm_addr || "");
              controls.qo_cr_terms.setValue(res.data.cm_cr_terms || "");
              controls.qo_curr.setValue(res.data.cm_curr || "");
              controls.qo_taxable.setValue(res.data.address.ad_taxable || "");
           
              this.customer = res.data;            
               
              this.deviseService.getBy({ cu_curr: res.data.cm_curr }).subscribe(
                (res: any) => {
                  console.log(res);
                  const { data } = res;
            if(data) {
    
              this.curr = data;
            }
          })
            }
             
          },
          (error) => console.log(error)
        );
      }
    
    goBack() {
        this.loadingSubject.next(false)
        const url = `/`
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
    }

    // add new Item to Datatable
    addNewItem() {
        this.gridService.addItem({
            id: this.dataset.length + 1,
            qod_line: this.dataset.length + 1,
            qod_part: "",
            cmvid: "",
            desc: "",
            qod_qty_ord: 0,
            qod_um: "",
            qod_price: 0,
            qod_disc_pct: 0,
            qod_ar_cc: "",
            qod_desc: "",
        },{position:"bottom"})
    }

    handleSelectedRowsChanged2(e, args) {
        const controls = this.qoForm.controls
        if (Array.isArray(args.rows) && this.gridObj2) {
            args.rows.map((idx) => {
                const item = this.gridObj2.getDataItem(idx)
                controls.qo_cust.setValue(item.cm_addr || "")
                controls.qo_cr_terms.setValue(item.cm_cr_terms || "");
                controls.qo_curr.setValue(item.cm_curr || "");
                controls.qo_taxable.setValue(item.address.ad_taxable || "");
                
              
                this.customer = item;
                this.deviseService.getBy({ cu_curr: item.cm_curr }).subscribe(
                  (res: any) => {
                    console.log(res);
                    const { data } = res;
              if(data) {
      
                this.curr = data;
              }
            })
                console.log(this.customer)
            })
        }
    }

    angularGridReady2(angularGrid: AngularGridInstance) {
        this.angularGrid2 = angularGrid
        this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {}
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
                name: "Fournisseur",
                field: 'address.ad_name',
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "ad_phone",
                name: "Numero telephone",
                field: 'address.ad_phone',
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            
        ]

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
              }
        }

        // fill the dataset with your data
        this.customersService
            .getAll()
            .subscribe((response: any) => (this.customers = response.data))
    }
    open2(content) {
        this.prepareGrid2()
        this.modalService.open(content, { size: "lg" })
    }

 
    handleSelectedRowsChanged4(e, args) {
        let updateItem = this.gridService.getDataItemByRowIndex(this.row_number)
        if (Array.isArray(args.rows) && this.gridObj4) {
            args.rows.map((idx) => {
                const item = this.gridObj4.getDataItem(idx)
                console.log(item)
                updateItem.qod_part = item.pt_part
                updateItem.desc = item.pt_desc1
                updateItem.qod_um = item.pt_um
                updateItem.qod_price = item.pt_price
                updateItem.qod_taxable = item.pt_taxable
                updateItem.qod_tax_code = item.pt_taxc
                
                updateItem.qod_taxc = item.taxe.tx2_tax_pct
                
                this.gridService.updateItem(updateItem);

            })
        }
    }

    angularGridReady4(angularGrid: AngularGridInstance) {
        this.angularGrid4 = angularGrid
        this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {}
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
        ]

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
        }

        // fill the dataset with your data
        this.itemsService
            .getAll()
            .subscribe((response: any) => (this.items = response.data))
    }
    open4(content) {
        this.prepareGrid4()
        this.modalService.open(content, { size: "lg" })
    }
    onAlertClose($event) {
        this.hasFormErrors = false
    }
    handleSelectedRowsChangedcurr(e, args) {
        const controls = this.qoForm.controls
        if (Array.isArray(args.rows) && this.gridObjcurr) {
            args.rows.map((idx) => {
                const item = this.gridObjcurr.getDataItem(idx)
                controls.qo_curr.setValue(item.cu_curr || "")
                this.curr = item
            })
        }
      }
    
      angularGridReadycurr(angularGrid: AngularGridInstance) {
        this.angularGridcurr = angularGrid;
        this.gridObjcurr = (angularGrid && angularGrid.slickGrid) || {};
      }
    
      prepareGridcurr() {
        this.columnDefinitionscurr = [
          {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
          },
          {
            id: "cu_curr",
            name: "code",
            field: "cu_curr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "cu_desc",
            name: "Designation",
            field: "cu_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "cu_rnd_mthd",
            name: "Methode Arrondi",
            field: "cu_rnd_mthd",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "cu_active",
            name: "Actif",
            field: "cu_active",
            sortable: true,
            filterable: true,
            type: FieldType.boolean,
          },
          {
            id: "cu_iso_curr",
            name: "Devise Iso",
            field: "cu_iso_curr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
        ];
    
        this.gridOptionscurr = {
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
        this.deviseService
          .getAll()
          .subscribe((response: any) => (this.devises = response.data));
      }
      opencurr(content) {
        this.prepareGridcurr();
        this.modalService.open(content, { size: "lg" });
      }
      calculatetot(){
        const controls = this.totForm.controls 
         const controlsso = this.qoForm.controls 
         let tht = 0
         let tva = 0
         let timbre = 0
         let ttc = 0
         for (var i = 0; i < this.dataset.length; i++) {
           console.log(this.dataset[i]  )
           tht += round((this.dataset[i].qod_price * ((100 - this.dataset[i].qod_disc_pct) / 100 ) *  this.dataset[i].qod_qty_ord),2)
           if(controlsso.qo_taxable.value == true) tva += round((this.dataset[i].qod_price * ((100 - this.dataset[i].qod_disc_pct) / 100 ) *  this.dataset[i].qod_qty_ord) * (this.dataset[i].qod_taxc ? this.dataset[i].qod_taxc / 100 : 0),2)
          
        
           
      
           console.log(tva)
           if(controlsso.qo_cr_terms.value == "ES") { timbre = round((tht + tva) / 100,2);
             if (timbre > 10000) { timbre = 10000} } 
        
         }
       ttc = round(tht + tva + timbre,2)
     console.log(tht,tva,timbre,ttc)
     controls.tht.setValue(tht.toFixed(2));
     controls.tva.setValue(tva.toFixed(2));
     controls.timbre.setValue(timbre.toFixed(2));
     controls.ttc.setValue(ttc.toFixed(2));
     
}


printpdf(nbr) {
  const controls = this.totForm.controls 
  const controlss = this.qoForm.controls 
  console.log("pdf")
  var doc = new jsPDF();
 
 // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
  var img = new Image()
  img.src = "./assets/media/logos/company.png";
  doc.addImage(img, 'png', 5, 5, 210, 30)
  doc.setFontSize(12);
  doc.text( 'Devis N° : ' + nbr  , 70, 40);
  doc.setFontSize(8);
  console.log(this.customer.address.ad_misc2_id)
  doc.text('Code Client : ' + this.customer.cm_addr, 20 , 50 )
  doc.text('Nom             : ' + this.customer.address.ad_name, 20 , 55)
  doc.text('Adresse       : ' + this.customer.address.ad_line1, 20 , 60)
  if (this.customer.address.ad_misc2_id != null) {doc.text('MF          : ' + this.customer.address.ad_misc2_id, 20 , 65)}
      if (this.customer.address.ad_gst_id != null) {doc.text('RC          : ' + this.customer.address.ad_gst_id, 20 , 70)}
      if (this.customer.address.ad_pst_id) {doc.text('AI            : ' + this.customer.address.ad_pst_id, 20 , 75)}
      if (this.customer.address.ad_misc1_id != null) {doc.text('NIS         : ' + this.customer.address.ad_misc1_id, 20 , 80)}
    
  doc.line(10, 85, 200, 85);
  doc.line(10, 90, 200, 90);
  doc.line(10, 85, 10, 90);
  doc.text('LN', 12.5 , 88.5);
  doc.line(20, 85, 20, 90);
  doc.text('Code Article', 25 , 88.5);
  doc.line(45, 85, 45, 90);
  doc.text('Désignation', 67.5 , 88.5);
  doc.line(100, 85, 100, 90);
  doc.text('QTE', 107 , 88.5);
  doc.line(120, 85, 120, 90);
  doc.text('UM', 123 , 88.5);
  doc.line(130, 85, 130, 90);
  doc.text('PU', 138 , 88.5);
  doc.line(150, 85, 150, 90);
  doc.text('TVA', 152 , 88.5);
  doc.line(160, 85, 160, 90);
  doc.text('REM', 162 , 88.5);
  doc.line(170, 85, 170, 90);
  doc.text('THT', 181 , 88.5);
  doc.line(200, 85, 200, 90);
  var i = 95;
  doc.setFontSize(6);
  for (let j = 0; j < this.dataset.length  ; j++) {
    console.log("hkjhhkjhk", this.dataset[j].desc.length) 
    console.log("hnaaaaaaaaaaaaaaaaaaaaaaa")
    if ((j % 30 == 0) && (j != 0) ) {
doc.addPage();
      doc.addImage(img, 'png', 5, 5, 210, 30)
      doc.setFontSize(12);
      doc.text( 'Devis N° : ' + nbr  , 70, 40);
      doc.setFontSize(8);
      doc.text('Code Client : ' + this.customer.cm_addr, 20 , 50 )
      doc.text('Nom             : ' + this.customer.address.ad_name, 20 , 55)
      doc.text('Adresse       : ' + this.customer.address.ad_line1, 20 , 60)
      if (this.customer.address.ad_misc2_id != null) {doc.text('MF          : ' + this.customer.address.ad_misc2_id, 20 , 65)}
      if (this.customer.address.ad_gst_id != null) {doc.text('RC          : ' + this.customer.address.ad_gst_id, 20 , 70)}
      if (this.customer.address.ad_pst_id) {doc.text('AI            : ' + this.customer.address.ad_pst_id, 20 , 75)}
      if (this.customer.address.ad_misc1_id != null) {doc.text('NIS         : ' + this.customer.address.ad_misc1_id, 20 , 80)}
    
      doc.line(10, 85, 200, 85);
      doc.line(10, 90, 200, 90);
      doc.line(10, 85, 10, 90);
      doc.text('LN', 12.5 , 88.5);
      doc.line(20, 85, 20, 90);
      doc.text('Code Article', 25 , 88.5);
      doc.line(45, 85, 45, 90);
      doc.text('Désignation', 67.5 , 88.5);
      doc.line(100, 85, 100, 90);
      doc.text('QTE', 107 , 88.5);
      doc.line(120, 85, 120, 90);
      doc.text('UM', 123 , 88.5);
      doc.line(130, 85, 130, 90);
      doc.text('PU', 138 , 88.5);
      doc.line(150, 85, 150, 90);
      doc.text('TVA', 152 , 88.5);
      doc.line(160, 85, 160, 90);
      doc.text('REM', 162 , 88.5);
      doc.line(170, 85, 170, 90);
      doc.text('THT', 181 , 88.5);
      doc.line(200, 85, 200, 90);
      i = 95;
      doc.setFontSize(6);

    }


    console.log("hkjhhkjhk", String(this.dataset[j].desc).length)

    if (String(this.dataset[j].desc).length > 35) {
      let desc1 = this.dataset[j].desc.substring(35)
      let ind = desc1.indexOf(' ')
      desc1 = this.dataset[j].desc.substring(0, 35  + ind)
      let desc2 = this.dataset[j].desc.substring(35+ind)

      doc.line(10, i - 5, 10, i );
      doc.text(String(("000"+ this.dataset[j].qod_line)).slice(-3), 12.5 , i  - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.dataset[j].qod_part, 25 , i  - 1);
      doc.line(45, i - 5 , 45, i );
      doc.text(desc1, 47 , i  - 1);
      doc.line(100, i - 5, 100, i );
      doc.text( String(this.dataset[j].qod_qty_ord.toFixed(2)), 118 , i  - 1 , { align: 'right' });
      doc.line(120, i - 5 , 120, i );
      doc.text(this.dataset[j].qod_um, 123 , i  - 1);
      doc.line(130, i - 5, 130, i );
      doc.text( String(Number(this.dataset[j].qod_price).toFixed(2)), 148 , i  - 1 , { align: 'right' });
      doc.line(150, i - 5, 150, i );
      doc.text(String(this.dataset[j].qod_taxc) + "%" , 153 , i  - 1);
      doc.line(160, i - 5 , 160, i );
      doc.text(String(this.dataset[j].qod_disc_pct) + "%" , 163 , i  - 1);
      doc.line(170, i - 5 , 170, i );
      doc.text(String((this.dataset[j].qod_price *
              ((100 - this.dataset[j].qod_disc_pct) / 100) *
              this.dataset[j].qod_qty_ord).toFixed(2)), 198 , i  - 1,{ align: 'right' });
      doc.line(200, i-5 , 200, i );
     // doc.line(10, i, 200, i );

      i = i + 5;

      doc.text(desc2, 47 , i  - 1);
      
      doc.line(10, i - 5, 10, i );
      doc.line(20, i - 5, 20, i);
      doc.line(45, i - 5 , 45, i );
      doc.line(100, i - 5, 100, i );
      doc.line(120, i - 5 , 120, i );
      doc.line(130, i - 5, 130, i );
      doc.line(150, i - 5, 150, i );
      doc.line(160, i - 5 , 160, i );
      doc.line(170, i - 5 , 170, i );
      doc.line(200, i-5 , 200, i );
      doc.line(10, i, 200, i );

      i = i + 5 ;
      
    } else {


    
    doc.line(10, i - 5, 10, i );
    doc.text(String(("000"+ this.dataset[j].qod_line)).slice(-3), 12.5 , i  - 1);
    doc.line(20, i - 5, 20, i);
    doc.text(this.dataset[j].qod_part, 25 , i  - 1);
    doc.line(45, i - 5 , 45, i );
    doc.text(this.dataset[j].desc, 47 , i  - 1);
    doc.line(100, i - 5, 100, i );
    doc.text( String(this.dataset[j].qod_qty_ord.toFixed(2)), 118 , i  - 1 , { align: 'right' });
    doc.line(120, i - 5 , 120, i );
    doc.text(this.dataset[j].qod_um, 123 , i  - 1);
    doc.line(130, i - 5, 130, i );
    doc.text( String(Number(this.dataset[j].qod_price).toFixed(2)), 148 , i  - 1 , { align: 'right' });
    doc.line(150, i - 5, 150, i );
    doc.text(String(this.dataset[j].qod_taxc) + "%" , 153 , i  - 1);
    doc.line(160, i - 5 , 160, i );
    doc.text(String(this.dataset[j].qod_disc_pct) + "%" , 163 , i  - 1);
    doc.line(170, i - 5 , 170, i );
    doc.text(String((this.dataset[j].qod_price *
      ((100 - this.dataset[j].qod_disc_pct) / 100) *
      this.dataset[j].qod_qty_ord).toFixed(2)), 198 , i  - 1,{ align: 'right' });
    doc.line(200, i-5 , 200, i );
    doc.line(10, i, 200, i );
    i = i + 5;
    }
  }
  
 // doc.line(10, i - 5, 200, i - 5);

 doc.line(130, i + 7,  200, i + 7  );
 doc.line(130, i + 14, 200, i + 14 );
 doc.line(130, i + 21, 200, i + 21 );
 doc.line(130, i + 28, 200, i + 28 );
 doc.line(130, i + 35, 200, i + 35 );
 doc.line(130, i + 7,  130, i + 35  );
 doc.line(160, i + 7,  160, i + 35  );
 doc.line(200, i + 7,  200, i + 35  );
 doc.setFontSize(10);
 
 doc.text('Total HT', 140 ,  i + 12 , { align: 'left' });
 doc.text('TVA', 140 ,  i + 19 , { align: 'left' });
 doc.text('Timbre', 140 ,  i + 26 , { align: 'left' });
 doc.text('Total TC', 140 ,  i + 33 , { align: 'left' });

 
 doc.text(String(Number(controls.tht.value).toFixed(2)), 198 ,  i + 12 , { align: 'right' });
 doc.text(String(Number(controls.tva.value).toFixed(2)), 198 ,  i + 19 , { align: 'right' });
 doc.text(String(Number(controls.timbre.value).toFixed(2)), 198 ,  i + 26 , { align: 'right' });
 doc.text(String(Number(controls.ttc.value).toFixed(2)), 198 ,  i + 33 , { align: 'right' });

 doc.setFontSize(8);
    let mt = NumberToLetters(
      Number(controls.ttc.value).toFixed(2),this.curr.cu_desc)

      if (mt.length > 95) {
        let mt1 = mt.substring(90)
        let ind = mt1.indexOf(' ')
       
        mt1 = mt.substring(0, 90  + ind)
        let mt2 = mt.substring(90+ind)
   
        doc.text( "Arretée la présente Commande a la somme de :" + mt1  , 20, i + 53)
        doc.text(  mt2  , 20, i + 60)
      } else {
        doc.text( "Arretée la présente Commande a la somme de :" + mt  , 20, i + 53)

      }
    // window.open(doc.output('bloburl'), '_blank');
    //window.open(doc.output('blobUrl'));  // will open a new tab
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));

  }
}
