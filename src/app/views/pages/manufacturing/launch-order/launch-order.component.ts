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
  WorkOrderDetail,
  WorkOrderDetailService,
  WorkOrderService,
  LocationService,
  SiteService,
  SequenceService,
  LocationDetailService,
  PsService,
  BomService,
  printLp
} from "../../../../core/erp";

import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";


@Component({
  selector: 'kt-launch-order',
  templateUrl: './launch-order.component.html',
  styleUrls: ['./launch-order.component.scss']
})
export class LaunchOrderComponent implements OnInit {
  
  wodForm: FormGroup;
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
  provider: any;
  
 
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


  devises: [];
  columnDefinitionscurr: Column[] = [];
  gridOptionscurr: GridOption = {};
  gridObjcurr: any;
  angularGridcurr: AngularGridInstance;

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


  row_number;
  message = "";
  woServer;
  location: any;
  datasetPrint = [];
  seq: any;
  user;
  lpnbr: String;
  stat: String;
  details: any;
  ld: any;
  bom: any;

  constructor(
    config: NgbDropdownConfig,
    private wodFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private workOrderService: WorkOrderService,
    private workOrderDetailService: WorkOrderDetailService,
    private psService: PsService,
    private itemsService: ItemService,
    private bomService: BomService,
    private locationDetailService: LocationDetailService,
    private sequenceService: SequenceService,

    private locationService: LocationService,
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
        
      },
     

      {
        id: "wod_line",
        name: "Ligne",
        field: "wod_line",
        minWidth: 50,
        maxWidth: 50,
        selectable: true,
      },
      {
        id: "wod_part",
        name: "Article",
        field: "wod_part",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
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
        id: "wod_qty_req",
        name: "QTE Requise",
        field: "wod_qty_req",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        
      },
      {
        id: "wod_um",
        name: "UM",
        field: "wod_um",
        sortable: true,
        width: 80,
        filterable: false,
        
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
        id: "wod_ref",
        name: "Réference",
        field: "wod_ref",
        sortable: true,
        width: 80,
        filterable: false,
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
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.createForm();
    
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    
    const date = new Date()
    this.wodForm = this.wodFB.group({
      wod_lot: "",
      wod_nbr: [{value:"", disabled: true}],
      part: [{value:"", disabled: true}],
      descr: [{value:"", disabled: true}],
      wod__qadt01: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      routing: "",
      site: [{value:"", disabled: true}],
      bom: "",
      qte: 0,
      batch: [{value:0, disabled: true}],
     
    });
  }
  //reste form
  reset() {
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.wodForm.controls;
    if (this.wodForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }

    if (!this.dataset.length) {
      this.message = "La liste des article ne peut pas etre vide ";
      this.hasFormErrors = true;

      return;
    }



    this.sequenceService.getByOne({ seq_type: "LP", seq_profile: this.user.usrd_profile }).subscribe(
      (response: any) => {
    this.seq = response.data
    console.log(this.seq)   
        if (this.seq) {
         this.lpnbr = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`
         console.log(this.seq.seq_prefix)
         console.log(this.seq.seq_curr_val)
         
        console.log(this.lpnbr)
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

      
     
    // tslint:disable-next-line:prefer-const
   
    let wod = this.prepare()
    this.addIt( wod,this.dataset, this.lpnbr);
  })



    // tslint:disable-next-line:prefer-const
   // let pr = this.prepare()
    //this.addIt( this.dataset,pr);
  }

  prepare(){
    const controls = this.wodForm.controls;
    const _wod = new WorkOrderDetail();
    _wod.wod_nbr = controls.wod_nbr.value
    _wod.wod_lot = controls.wod_lot.value
    _wod.wod__qadt01 = controls.wod__qadt01.value
    ? `${controls.wod__qadt01.value.year}/${controls.wod__qadt01.value.month}/${controls.wod__qadt01.value.day}`
    : null
    return _wod
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
  addIt( _wod: any, detail: any , lpnbr) {
    console.log("kamel",detail)
    for (let data in detail) {
      delete this.dataset[data].id;
   //   delete this.dataset[data].cmvid;
    }
    this.loadingSubject.next(true);
    
    const controls = this.wodForm.controls
   

    const wodnbr   = controls.wod_nbr.value
    const wodlot  = controls.wod_lot.value
    const part    = controls.part.value
    const descr   = controls.descr.value
    const routing = controls.bom.value
    const gamme   = controls.routing.value
    const qte     = controls.qte.value     

    this.workOrderDetailService
      .add({ _wod, detail,lpnbr})
      .subscribe(
       (reponse: any) => ( _wod = reponse.data),
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
        // console.log(this.provider, poNbr, this.dataset);
         // if(controls.print.value == true) printReceive(this.provider, this.dataset, poNbr);
         this.printpdf(lpnbr,wodnbr,wodlot,part,descr,routing,gamme,qte)
        // printLp( this.dataset, lpnbr,wodnbr,wodlot,part,descr,routing,gamme,qte );
          this.router.navigateByUrl("/");
        }
      );
  }
  onChangeOA() {
    this.dataset=[]
    const controls = this.wodForm.controls;
    const id = controls.wod_lot.value;
    
    this.workOrderService.getByOne({ id }).subscribe(
      (res: any) => {
      
                
        this.woServer = res.data;
        
        controls.wod_lot.setValue(this.woServer.id);
        controls.wod_nbr.setValue(this.woServer.wo_nbr);
        controls.part.setValue(this.woServer.wo_part);
        controls.descr.setValue(this.woServer.item.pt_desc1)
        controls.site.setValue(this.woServer.wo_site);
        controls.routing.setValue(this.woServer.wo_routing);
        controls.bom.setValue(this.woServer.wo_bom_code);
        const bom_parent = this.woServer.wo_bom_code;
        
        this.bomService.getBy({bom_parent}).subscribe((response: any)=>{
        console.log(response.data.bom_batch)
        
          controls.batch.setValue(response.data.bom_batch);
        })
       
        
      /*  this.psService.getBy({ps_parent}).subscribe((response: any)=>{
                
          this.details  = response.data;
         
          console.log(this.details);

          for (var object = 0; object < this.details.length; object++) {
            // console.log(this.details[object]);
             // const detail = this.details[object];
             
            var qty = Number(this.details[object].ps_qty_per) * Number () ;
            let obj = {}
            obj = {ld_part:this.details[object].ps_comp}
             this.locationDetailService.getByFifo({ obj, qty  }).subscribe((resp: any)=>{
             
              console.log(resp.data)
  
              this.ld  = resp.data;
           
              for (var object = 0; object < this.ld.length; object++) {
                 this.gridService.addItem(
                    {
        
                      
                      id: this.dataset.length + 1,
                      wod_line: this.dataset.length + 1,
                      wod_part: this.ld[object].ld_part,
                      desc: this.ld[object].pt_desc1,
                      wod_um: this.ld[object].pt_um,
                      wod_qty_req: this.ld[object].ld_qty_oh,
                      
                      wod_site: this.ld[object].ld_site,
                      wod_loc: this.ld[object].ld_loc,
                      wod_serial: this.ld[object].ld_lot,
                      wod_ref: this.ld[object].ld_ref,                 
                    },
                    { position: "bottom" }
                  );
                  }
         
         
                })
                  }
        }); */
      });
  }

  
 


  onChangeqte() {
    this.dataset=[]
    const controls = this.wodForm.controls;
    const qte = controls.qte.value;
    
       
       
        const ps_parent = controls.bom.value;
        
        this.psService.getBy({ps_parent}).subscribe((response: any)=>{
                
          this.details  = response.data;
         
          console.log(this.details);

          for (var object = 0; object < this.details.length; object++) {
            // console.log(this.details[object]);
             // const detail = this.details[object];
             
            var qty = Number(this.details[object].ps_qty_per) * Number (qte) / Number(controls.batch.value) ;
            let obj = {}
            obj = {ld_part:this.details[object].ps_comp}
             this.locationDetailService.getByFifo({ obj, qty  }).subscribe((resp: any)=>{
             
              console.log(resp.data)
  
              this.ld  = resp.data;
           
              for (var object = 0; object < this.ld.length; object++) {
                 this.gridService.addItem(
                    {
        
                      
                      id: this.dataset.length + 1,
                      wod_line: this.dataset.length + 1,
                      wod_part: this.ld[object].ld_part,
                      desc: this.ld[object].pt_desc1,
                      wod_um: this.ld[object].pt_um,
                      wod_qty_req: this.ld[object].ld_qty_oh,
                      
                      wod_site: this.ld[object].ld_site,
                      wod_loc: this.ld[object].ld_loc,
                      wod_serial: this.ld[object].ld_lot,
                      wod_ref: this.ld[object].ld_ref,         
                      
                     
                    },
                    { position: "bottom" }
                  );
                  }
         
         
                })
                  }
        });
      
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
  
  
  
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  handleSelectedRowsChanged5(e, args) {
    const controls = this.wodForm.controls;

    this.dataset=[]
    
    if (Array.isArray(args.rows) && this.gridObj5) {
      args.rows.map((idx) => {
        const item = this.gridObj5.getDataItem(idx);
        controls.wod_lot.setValue(item.id || "");
       
        controls.wod_nbr.setValue(item.wo_nbr);
        controls.part.setValue(item.wo_part);
        controls.descr.setValue(item.item.pt_desc1)

        controls.site.setValue(item.wo_site);
        controls.routing.setValue(item.wo_routing);
        controls.bom.setValue(item.wo_bom_code);
        const bom_parent = item.wo_bom_code;
        
        this.bomService.getBy({bom_parent}).subscribe((response: any)=>{
        console.log(response.data.bom_batch)
        
          controls.batch.setValue(response.data.bom_batch);
        })
          /*  this.psService.getBy({ps_parent}).subscribe((response: any)=>{
                    
                    
              this.details = response.data;
            //const det1 = this.details[object]s;
            
console.log(this.details)

            this.details  = response.data;
         
            for (var object = 0; object < this.details.length; object++) {
          // console.log(this.details[object]);
           // const detail = this.details[object];
           
          var qty = this.details[object].ps_qty_per;
          let obj = {}
          obj = {ld_part:this.details[object].ps_comp}
           this.locationDetailService.getByFifo({ obj, qty  }).subscribe((resp: any)=>{
           
            console.log(resp.data)

            this.ld  = resp.data;
         
            for (var object = 0; object < this.ld.length; object++) {
               this.gridService.addItem(
                  {
      
                    
                    id: this.dataset.length + 1,
                    wod_line: this.dataset.length + 1,
                    wod_part: this.ld[object].ld_part,
                    desc: this.ld[object].pt_desc1,
                    wod_um: this.ld[object].pt_um,
                    wod_qty_req: this.ld[object].ld_qty_oh,
                    
                    wod_site: this.ld[object].ld_site,
                    wod_loc: this.ld[object].ld_loc,
                    wod_serial: this.ld[object].ld_lot,
                    wod_ref: this.ld[object].ld_ref,                 
                  },
                  { position: "bottom" }
                );
                }
       
       
              })
                }
          //  
        }
      
        ); */
       
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
      .getAll()
      .subscribe((response: any) => {
       // console.log(response.data)
        this.wos = response.data });
      
      
      
    }
  open5(content) {
    this.prepareGrid5();
    this.modalService.open(content, { size: "lg" });
  }




  printpdf(nbr,wodlot,wodnbr,part,descr,routing,gamme,qte) {
    //const controls = this.totForm.controls 
    const controlss = this.wodForm.controls 
    console.log("pdf")
    var doc = new jsPDF();
   
   // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
    var img = new Image()
    img.src = "./assets/media/logos/company.png";
    doc.addImage(img, 'png', 5, 5, 210, 30)
    doc.setFontSize(12);
    doc.text( 'LP N° : ' + nbr  , 70, 40);
    doc.setFontSize(8);
    
        doc.text('Id OF       : ' + wodlot, 20 , 50 )
        doc.text('N° OF       : ' + wodnbr, 20 , 55)
        doc.text('Article     : ' + part, 20 , 60)
        doc.text('Designation : ' + descr, 20 , 65)

        doc.text('Nomenclature: ' + routing, 20 , 70)

        doc.text('Gamme       : ' + gamme, 20 , 75)
        doc.text('Quantité    : ' + qte, 20 , 80)

      
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
    doc.text('Site', 132 , 88.5);
    doc.line(140, 85, 140, 90);
    doc.text('Empl', 142 , 88.5);
    doc.line(153, 85, 153, 90);
    doc.text('Lot/Serie', 158 , 88.5);
    doc.line(180, 85, 180, 90);
    doc.text('Réference', 182 , 88.5);
    doc.line(200, 85, 200, 90);
    var i = 95;
    doc.setFontSize(6);
    for (let j = 0; j < this.dataset.length  ; j++) {
      
      if ((j % 35 == 0) && (j != 0) ) {
  doc.addPage();
        doc.addImage(img, 'png', 5, 5, 210, 30)
        doc.setFontSize(12);
        doc.text( 'LP N° : ' + nbr  , 70, 40);
        doc.setFontSize(8);
     
        doc.text('Id OF       : ' + wodlot, 20 , 50 )
        doc.text('N° OF       : ' + wodnbr, 20 , 55)
        doc.text('Article     : ' + part, 20 , 60)
        doc.text('Designation : ' + descr, 20 , 65)

        doc.text('Nomenclature: ' + routing, 20 , 70)

        doc.text('Gamme       : ' + gamme, 20 , 75)
        doc.text('Quantité    : ' + qte, 20 , 80)


      



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
        doc.text('Site', 132 , 88.5);
        doc.line(140, 85, 140, 90);
        doc.text('Empl', 142 , 88.5);
        doc.line(153, 85, 153, 90);
        doc.text('Lot/Série', 152 , 88.5);
        doc.line(180, 85, 180, 90);
        doc.text('Réf', 182 , 88.5);
        doc.line(200, 85, 200, 90);
        i = 95;
        doc.setFontSize(6);
  
      }
  
  
  
      if (this.dataset[j].desc.length > 35) {
        let desc1 = this.dataset[j].desc.substring(35)
        let ind = desc1.indexOf(' ')
        desc1 = this.dataset[j].desc.substring(0, 35  + ind)
        let desc2 = this.dataset[j].desc.substring(35+ind)
  
        doc.line(10, i - 5, 10, i );
        doc.text(String(("000"+ this.dataset[j].wod_line)).slice(-3), 12.5 , i  - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.dataset[j].wod_part, 25 , i  - 1);
        doc.line(45, i - 5 , 45, i );
        doc.text(desc1, 47 , i  - 1);
        doc.line(100, i - 5, 100, i );
        doc.text( String(Number(this.dataset[j].wod_qty_req).toFixed(2)), 118 , i  - 1 , { align: 'right' });
        doc.line(120, i - 5 , 120, i );
        doc.text(this.dataset[j].wod_um, 123 , i  - 1);
        doc.line(130, i - 5, 130, i );
        doc.text( String((this.dataset[j].wod_site)), 132 , i  - 1 );
        doc.line(140, i - 5, 140, i );
        doc.text(String(this.dataset[j].wod_loc)  , 141 , i  - 1);
        doc.line(153, i - 5 , 153, i );
       if(this.dataset[j].wod_serial != null) { doc.text(String(this.dataset[j].wod_serial)  , 156 , i  - 1)};
        doc.line(180, i - 5 , 180, i );
        if(this.dataset[j].wod_ref != null) {doc.text(String(this.dataset[j].wod_ref ), 182 , i  - 1)};
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
        doc.line(140, i - 5, 140, i );
        doc.line(153, i - 5 , 153, i );
        doc.line(180, i - 5 , 180, i );
        doc.line(200, i-5 , 200, i );
        doc.line(10, i, 200, i );
  
        i = i + 5 ;
        
      } else {
  
  
      
      doc.line(10, i - 5, 10, i );
      doc.text(String(("000"+ this.dataset[j].wod_line)).slice(-3), 12.5 , i  - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.dataset[j].wod_part, 25 , i  - 1);
      doc.line(45, i - 5 , 45, i );
      doc.text(this.dataset[j].desc, 47 , i  - 1);
      doc.line(100, i - 5, 100, i );
      doc.text( String(Number(this.dataset[j].wod_qty_req).toFixed(2)), 118 , i  - 1 , { align: 'right' });
      doc.line(120, i - 5 , 120, i );
      doc.text(this.dataset[j].wod_um, 123 , i  - 1);
      doc.line(130, i - 5, 130, i );
      doc.text( String(this.dataset[j].wod_site), 132 , i  - 1 );
      doc.line(140, i - 5, 140, i );
      doc.text(String(this.dataset[j].wod_loc)  , 141 , i  - 1);
      doc.line(153, i - 5 , 153, i );
      if(this.dataset[j].wod_serial != null) {doc.text(String(this.dataset[j].wod_serial) , 156 , i  - 1)};
      doc.line(180, i - 5 , 180, i );
      if (this.dataset[j].wod_ref) {doc.text(String(this.dataset[j].wod_ref ), 182 , i  - 1)};
      doc.line(200, i-5 , 200, i );
      doc.line(10, i, 200, i );
      i = i + 5;
      }
    }
    
   // doc.line(10, i - 5, 200, i - 5);
  
   doc.setFontSize(10);
   
   
         // window.open(doc.output('bloburl'), '_blank');
      //window.open(doc.output('blobUrl'));  // will open a new tab
      var blob = doc.output("blob");
      window.open(URL.createObjectURL(blob));
  
    }
  
}
