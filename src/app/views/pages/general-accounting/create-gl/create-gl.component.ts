import { Component, OnInit } from "@angular/core"
import {
    NgbDropdownConfig,
    NgbTabChangeEvent,
    NgbTabsetConfig,
    NgbModal,
} from "@ng-bootstrap/ng-bootstrap"

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
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
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

import { GeneralLedger, GeneralLedgerService, DeviseService, AccountService, SubaccountService, CostcenterService, 
         DaybookService, ProjectService, EntityService } from "../../../../core/erp"
@Component({
  selector: 'kt-create-gl',
  templateUrl: './create-gl.component.html',
  styleUrls: ['./create-gl.component.scss']
})
export class CreateGlComponent implements OnInit {

  gl: GeneralLedger
  glForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  isExist = false
  error = false;
  msg: String;

  data: []
  columnDefinitions3: Column[] = []
  gridOptions3: GridOption = {}
  gridObj3: any
  angularGrid3: AngularGridInstance
  selectedField = ""
 
  subs: []
  columnDefinitions4: Column[] = []
  gridOptions4: GridOption = {}
  gridObj4: any
  angularGrid4: AngularGridInstance
  
  ccs: []
  columnDefinitions5: Column[] = []
  gridOptions5: GridOption = {}
  gridObj5: any
  angularGrid5: AngularGridInstance

  pms: []
  columnDefinitions6: Column[] = []
  gridOptions6: GridOption = {}
  gridObj6: any
  angularGrid6: AngularGridInstance

  ens: []
  columnDefinitions7: Column[] = []
  gridOptions7: GridOption = {}
  gridObj7: any
  angularGrid7: AngularGridInstance


  devises: [];
  columnDefinitionscurr: Column[] = [];
  gridOptionscurr: GridOption = {};
  gridObjcurr: any;
  angularGridcurr: AngularGridInstance;

  journals: [];
  columnDefinitionsjournal: Column[] = [];
  gridOptionsjournal: GridOption = {};
  gridObjjournal: any;
  angularGridjournal: AngularGridInstance;

  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  row_number;
  date: String;
  entity: String;
  message = "";
  constructor(
      config: NgbDropdownConfig,
      private glFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private generalLedgerService: GeneralLedgerService,
      private deviseService       : DeviseService,
      private accountService      : AccountService,
      private subaccountService   : SubaccountService,
      private costcenterService   : CostcenterService, 
      private daybookService      : DaybookService,   
      private projectService      : ProjectService,
      private entityService       : EntityService,  
      private layoutUtilsService: LayoutUtilsService,
      private modalService: NgbModal,
      
  ) {
      config.autoClose = true
      
      this.initGrid();
  }

  GridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    this.dataView = angularGrid.dataView
    this.grid = angularGrid.slickGrid
    this.gridService = angularGrid.gridService
}

  ngOnInit(): void {
    this.entityService.getBy({en_primary: true }).subscribe((resp:any)=>{

        console.log(resp.data)
        if (resp.data) {

       this.entity = resp.data[0].en_entity;
      }
      
      });
    

      this.loading$ = this.loadingSubject.asObservable()
      this.loadingSubject.next(false)
      this.createForm()
  }
  //create form
  createForm() {
    this.loadingSubject.next(false)
    const date = new Date()
      this.gl = new GeneralLedger()
      this.glForm = this.glFB.group({
        glt_effdate: [{
            year:date.getFullYear(),
            month: date.getMonth()+1,
            day: date.getDate()
          }],
        glt_curr: ["DA", Validators.required],  
        glt_ex_rate: ["1", Validators.required],  
        glt_ex_rate2: ["1", Validators.required],  
        glt_batch: [this.gl.glt_batch, Validators.required], 
        glt_dy_code: [this.gl.glt_dy_code],  
      //  glt_ref: [this.gl.glt_ref, Validators.required],
          
      })
  }
  
  onChangeCode() {
      const controls = this.glForm.controls
      this.generalLedgerService
          .getNewId({})
          .subscribe((response: any) => {
              if (response.data) {
                 // this.isExist = true
                  console.log(response.data)
              } else {
                  //controls.si_desc.enable()
                 
                  console.log(response.data)
              }
             
       })
     
    }

    changeCurr(){
        const controls = this.glForm.controls // chof le champs hada wesh men form rah
        const cu_curr  = controls.glt_curr.value
    
        const date = new Date()
    
        this.date = controls.glt_effdate.value
          ? `${controls.glt_effdate.value.year}/${controls.glt_effdate.value.month}/${controls.glt_effdate.value.day}`
          : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    
         
        this.deviseService.getBy({cu_curr}).subscribe((res:any)=>{
            const {data} = res
            console.log(res)
            if (!data){  
                alert("Devise n'existe pas  ")
                controls.glt_curr.setValue(null);
                document.getElementById("glt_curr").focus();
                this.error = true
            }
            else {
                this.error = false;
         
                if (cu_curr == 'DA'){
                  controls.glt_ex_rate.setValue(1)
                  controls.glt_ex_rate2.setValue(1)
    
                } else {
    
                  console.log(this.date)
                this.deviseService.getExRate({exr_curr1:cu_curr, exr_curr2:'DA', date: this.date /* `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`*/ }).subscribe((res:any)=>{
                  controls.glt_ex_rate.setValue(res.data.exr_rate)
                   controls.glt_ex_rate2.setValue(res.data.exr_rate2)
                  })
         
                  }
                 
         
            }
    
    
        },error=>console.log(error))
    }
    changeRateCurr(){
        const controls = this.glForm.controls // chof le champs hada wesh men form rah
        const cu_curr  = controls.glt_curr.value
      
        const date = new Date()
      
        this.date = controls.glt_effdate.value
          ? `${controls.glt_effdate.value.year}/${controls.glt_effdate.value.month}/${controls.glt_effdate.value.day}`
          : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      
          if (cu_curr == 'DA'){
            controls.glt_ex_rate.setValue(1)
            controls.glt_ex_rate2.setValue(1)
      
          } else {
                this.deviseService.getExRate({exr_curr1:cu_curr, exr_curr2:'DA', date: this.date /* `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`*/ }).subscribe((res:any)=>{
                  
      
                   controls.glt_ex_rate.setValue(res.data.exr_rate)
                   controls.glt_ex_rate2.setValue(res.data.exr_rate2)
                  })
         
          }
                 
                
        
      }
      

    
  //reste form
  reset() {
      this.gl = new GeneralLedger()
      this.dataset = []
      this.createForm()
      this.hasFormErrors = false
  }
  // save data
  onSubmit() {
      this.hasFormErrors = false
      const controls = this.glForm.controls
      /** check form */
      if (this.glForm.invalid) {
          Object.keys(controls).forEach((controlName) =>
              controls[controlName].markAsTouched()
          )
          console.log(this.hasFormErrors)
          this.hasFormErrors = true
          console.log(this.hasFormErrors)
          return
      }
      if(this.dataset.length == 0) {
        this.message = "Ecriture comptable vide.";
        this.hasFormErrors = true;
  
        return;
     
  
      }
      for (var i = 0; i < this.dataset.length; i++) {
      
       if (this.dataset[i].glt_acct == "" || this.dataset[i].glt_acct == null  ) {
        this.message = "Le compte ne peut pas etre vide";
        this.hasFormErrors = true;
        return;
   
       }
       
       if (this.dataset[i].glt_amt == 0 ) {
        this.message = "Le Montant ne peut pas etre 0";
        this.hasFormErrors = true;
        return;
   
       }

      }
      var mnt = 0
      for (var i = 0; i < this.dataset.length; i++) {
      
       
       if (this.dataset[i].glt_amt > 0 ) {
        mnt = mnt + this.dataset[i].glt_amt;
       }

      }
      if (mnt  != Number(controls.glt_batch.value) ) {
        this.message = "Le Montant des lignes ne correspond pas au control";
        this.hasFormErrors = true;
        return;
   
       }
       var ctr = 0
       for (var i = 0; i < this.dataset.length; i++) {
      
       
        
         ctr = ctr + this.dataset[i].glt_amt;
        
 
       }
       if (ctr  != 0 ) {
        this.message = "La Somme des Lignes n'est pas égale à 0";
        this.hasFormErrors = true;
        return;
   
       }


      console.log(this.hasFormErrors)
      // tslint:disable-next-line:prefer-const
      let gl = this.prepareGl()
      this.addGl(gl,this.dataset)
  }
  /**
   * Returns object for saving
   */
  prepareGl(): GeneralLedger {
      const controls = this.glForm.controls
      const _gl = new GeneralLedger()
      _gl.glt_effdate  = controls.glt_effdate.value
        ? `${controls.glt_effdate.value.year}/${controls.glt_effdate.value.month}/${controls.glt_effdate.value.day}`
        : null
        
      _gl.glt_tr_type  = "JL"
      _gl.glt_curr     = controls.glt_curr.value;
      _gl.glt_ex_rate  = controls.glt_ex_rate.value;
      _gl.glt_ex_rate2 = controls.glt_ex_rate2.value;
      _gl.glt_dy_code  = controls.glt_dy_code.value;
      _gl.glt_batch    = controls.glt_batch.value;
      
      return _gl
  }
  /**
   * Add code
   *
   * @param _code: CodeModel
   */
  addGl(_gl: GeneralLedger, details : any) {
    for (let data of details) {
        delete data.id;
        delete data.cmvid;
      }
      this.loadingSubject.next(true)
      this.generalLedgerService.add({ generalLedger: _gl, Detail: details}).subscribe(
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
              this.reset();
              this.router.navigateByUrl("/general-accounting/create-gl")
          }
      )
  }

  /**
   * Go back to the list
   *
   */
  goBack() {
      this.loadingSubject.next(false)
      const url = `/`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
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
        id: "glt_line",
        name: "Ligne",
        field: "glt_line",
        minWidth: 50,
        maxWidth: 50,
        selectable: true,
      },
      {
        id: "glt_acct",
        name: "Compte",
        field: "glt_acct",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
        },

        onCellChange: (e: Event, args: OnEventArgs) => {
          const controls = this.glForm.controls;
          this.accountService.getBy({ac_code: args.dataContext.glt_acct }).subscribe((resp:any)=>{

            console.log(resp.data)
            if (!resp.data) {

            alert("Compte N'existe pas")
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , glt_acct: null })
          } else {
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , glt_desc: resp.data.ac_desc })
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
            "openAccsGrid"
            ) as HTMLElement;
            element.click();
      },
    },
      {
        id: "glt_desc",
        name: "Description",
        field: "glt_desc",
        sortable: true,
        width: 180,
        filterable: false,
      },
      
      {
        id: "glt_sub",
        name: "Sous Compte",
        field: "glt_sub",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
        },

        onCellChange: (e: Event, args: OnEventArgs) => {
          const controls = this.glForm.controls;
          this.subaccountService.getBy({sb_sub: args.dataContext.glt_sub }).subscribe((resp:any)=>{

            console.log(resp.data)
            if (resp.data.length == 0) {

            alert("Sous Compte N'existe pas")
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , glt_sub: null })
          } 
          else {
            this.subaccountService.getByDet({sb_sub: args.dataContext.glt_sub }).subscribe((resp:any)=>{

                console.log(resp.data.details)
                console.log(args.dataContext.glt_acct)
                var bool = false
                for (var j = 0; j < resp.data.details.length; j++) {
      
                    if (resp.data.details[j].sbd_acc_beg <=  args.dataContext.glt_acct && resp.data.details[j].sbd_acc_end >=  args.dataContext.glt_acct ) {
                     
                        console.log("hhhhhhhhhhhhhhh", resp.data.details[j].sbd_acc_beg, resp.data.details[j].sbd_acc_end, args.dataContext.glt_acct)
                        bool = true
                        break
                    }
             
                   }
                   if (!bool) {

                    
                    alert("Compte n' appartient pas a la plage de Sous Compte ")
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , glt_sub: null })
                   }
                   
            });
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
          "openSubsGrid"
          ) as HTMLElement;
          element.click();
      },
    },
    {
        id: "glt_cc",
        name: "Centre de Coût",
        field: "glt_cc",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
        },

        onCellChange: (e: Event, args: OnEventArgs) => {
          this.costcenterService.getBy({cc_ctr: args.dataContext.glt_cc }).subscribe((resp:any)=>{

            console.log(resp.data)
            if (resp.data.length == 0) {

            alert("Centre de Coût N'existe pas")
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , glt_cc: null })
          }
          else {

            this.costcenterService.getByDet({cc_ctr: args.dataContext.glt_cc }).subscribe((resp:any)=>{

                console.log(resp.data.subdetails)
                console.log(resp.data.accdetails)
                console.log(args.dataContext.glt_acct)
                var bool = false
                for (var j = 0; j < resp.data.accdetails.length; j++) {
      
                    if (resp.data.accdetails[j].ccd1_acc_beg <=  args.dataContext.glt_acct && resp.data.accdetails[j].ccd1_acc_end >=  args.dataContext.glt_acct ) {
                     
                        
                        bool = true
                        break
                    }
             
                   }

                   if (!bool) {

                    
                    alert("Compte n' appartient pas a la plage de centre de Coût ")
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , glt_cc: null })
                   }
                   
                   else {

                    bool = false
                    for (var j = 0; j < resp.data.subdetails.length; j++) {
      
                        if (resp.data.subdetails[j].ccd2_sub_beg <=  args.dataContext.glt_sub && resp.data.subdetails[j].ccd2_sub_end >=  args.dataContext.glt_sub ) {
                         
                            
                            bool = true
                            break
                        }
                 
                       }
    
                       if (!bool) {

                    
                        alert("Sous Compte n' appartient pas a la plage de centre de Coût ")
                        this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , glt_cc: null })
                       }

                   }
            });



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
          "openCcsGrid"
          ) as HTMLElement;
          element.click();
      },
    },
    {
        id: "glt_project",
        name: "Projet",
        field: "glt_project",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
        },

        onCellChange: (e: Event, args: OnEventArgs) => {
          this.projectService.getBy({pm_code: args.dataContext.glt_project }).subscribe((resp:any)=>{

            console.log(resp.data)
            if (!resp.data.project) {

            alert("Projet N'existe pas")
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , glt_project: null })
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
          "openPmsGrid"
          ) as HTMLElement;
          element.click();
      },
    },
    {
        id: "glt_entity",
        name: "Entité",
        field: "glt_entity",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
        },

        onCellChange: (e: Event, args: OnEventArgs) => {
          this.entityService.getBy({en_entity: args.dataContext.glt_entity }).subscribe((resp:any)=>{

            console.log(resp.data)
            if (resp.data.length == 0) {

            alert("Entité N'existe pas")
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , glt_entity: null })
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
            "openEnsGrid"
            ) as HTMLElement;
            element.click();
        },
      },
      {
        id: "glt_amt",
        name: "Montant",
        field: "glt_amt",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
            model: Editors.float,
            params: { decimalPlaces: 2 }
          },

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
addNewItem() {

    this.gridService.addItem(
      {
        id: this.dataset.length + 1,
        glt_line: this.dataset.length + 1,
        glt_acct    : "",
        cmvid      : "",
        glt_desc   : "",
        glt_sub    : "",
        glt_cc     : "",
        glt_project: "",
        glt_entity : this.entity,
        glt_amt    : 0 ,
        
      },
      { position: "bottom" }
    );
  }
 

  handleSelectedRowsChangedcurr(e, args) {
    const controls = this.glForm.controls;
    if (Array.isArray(args.rows) && this.gridObjcurr) {
      args.rows.map((idx) => {
        const item = this.gridObjcurr.getDataItem(idx);
        controls.glt_curr.setValue(item.cu_curr || "");
          const date = new Date()
          this.date = controls.glt_effdate.value
          ? `${controls.glt_effdate.value.year}/${controls.glt_effdate.value.month}/${controls.glt_effdate.value.day}`
          : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
          if (item.cu_curr == 'DA'){
            controls.glt_ex_rate.setValue(1)
            controls.glt_ex_rate2.setValue(1)

          } else {
          this.deviseService.getExRate({exr_curr1:item.cu_curr,exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
            
             controls.glt_ex_rate.setValue(res.data.exr_rate)
             controls.glt_ex_rate2.setValue(res.data.exr_rate2)
            
          })
        }
        

      });
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
        id: "cu_iglt_curr",
        name: "Devise Iso",
        field: "cu_iglt_curr",
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

  onChangeJournal() {
    const controls  = this.glForm.controls
    this.daybookService
        .getByOne({
              dy_dy_code: controls.glt_dy_code.value,
              
        })
        .subscribe((response: any) => {
          //  const {data} = response.data;
            console.log(response.data)
            if (!response.data) {
              alert("Journal n'existe pas")
  
               controls.glt_dy_code.setValue(null) 
               document.getElementById("glt_dy_code").focus(); 
            }             
      })
  }
  handleSelectedRowsChangedjournal(e, args) {
    const controls = this.glForm.controls;
    if (Array.isArray(args.rows) && this.gridObjjournal) {
      args.rows.map((idx) => {
        const item = this.gridObjjournal.getDataItem(idx);
     
        controls.glt_dy_code.setValue(item.dy_dy_code || "");
       
      });
    }
  }
  
  angularGridReadyjournal(angularGrid: AngularGridInstance) {
    this.angularGridjournal = angularGrid;
    this.gridObjjournal = (angularGrid && angularGrid.slickGrid) || {};
  }
  
  prepareGridjournal() {
    this.columnDefinitionsjournal = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
    },
    {
        id: "dy_dy_code",
        name: "Code",
        field: "dy_dy_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
    },
    {
        id: "dy_desc",
        name: "Description",
        field: "dy_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
    },
    {
        id: "dy_type",
        name: "Type",
        field: "dy_type",
        sortable: true,
        width: 200,
        filterable: true,
        type: FieldType.string,
    },
    {
      id: "dy_next_pgdet",
      name: "Page suivante Journal",
      field: "dy_next_pgdet",
      sortable: true,
      width: 200,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "dy_next_pgcen",
      name: "Page suivante centrale",
      field: "dy_next_pgcen",
      sortable: true,
      width: 200,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "dy_last_entdet",
      name: "Dernière entrée Journal",
      field: "dy_last_entdet",
      sortable: true,
      width: 200,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "dy_last_entcen",
      name: "Dernière entrée centrale",
      field: "dy_last_entcen",
      sortable: true,
      width: 200,
      filterable: true,
      type: FieldType.string,
    },
  
    ];
  
    this.gridOptionsjournal = {
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
    this.daybookService
      .getAll()
      .subscribe((response: any) => (this.journals = response.data));
  }
  openjournal(content) {
    this.prepareGridjournal();
    this.modalService.open(content, { size: "lg" });
  }

  
  handleSelectedRowsChanged3(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj3) {
      args.rows.map((idx) => {
        const item = this.gridObj3.getDataItem(idx);
        console.log(item);

         updateItem.glt_acct = item.ac_code;
         updateItem.glt_desc = item.ac_desc;
        this.gridService.updateItem(updateItem);
        
        })
      
      
    }
  }


  angularGridReady3(angularGrid: AngularGridInstance) {
    this.angularGrid3 = angularGrid
    this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {}
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
            id: "ac_code",
            name: "Compte",
            field: "ac_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "ac_desc",
            name: "Designation",
            field: "ac_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "ac_type",
            name: "Type",
            field: "ac_type",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "ac_curr",
          name: "Devise",
          field: "ac_curr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "ac_stat_acc",
          name: "Compte Statique",
          field: "ac_stat_acc",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },

    ]

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
        checkboxSelector: {
        },
        multiSelect: false,
        rowSelectionOptions: {
            selectActiveRow: true,
        },
    }

    // fill the dataset with your data
    this.accountService
        .getAll()
        .subscribe((response: any) => (this.data = response.data))
}
open3(content) {
    this.prepareGrid3()
    this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChanged4(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        console.log(item);

        
         this.subaccountService.getByDet({sb_sub: item.sb_sub }).subscribe((resp:any)=>{

            
            var bool = false
            for (var j = 0; j < resp.data.details.length; j++) {
  
                if (resp.data.details[j].sbd_acc_beg <= updateItem.glt_acct && resp.data.details[j].sbd_acc_end >=  updateItem.glt_acct ) {
                 
                    
                    bool = true
                    break
                }
         
               }
               if (!bool) {

                
                alert("Compte n' appartient pas a la plage de Sous Compte ")
                updateItem.glt_sub = null;
               }
               else {
                updateItem.glt_sub = item.sb_sub;

               }
               
        });
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
            id: "sb_sub",
            name: "Sous Compte",
            field: "sb_sub",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "sb_desc",
            name: "Designation",
            field: "sb_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "sb_active",
          name: "Actif",
          field: "sb_active",
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
        },
        multiSelect: false,
        rowSelectionOptions: {
            selectActiveRow: true,
        },
    }

    // fill the dataset with your data
    this.subaccountService
        .getAll()
        .subscribe((response: any) => (this.subs = response.data))
}
open4(content) {
    this.prepareGrid4()
    this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChanged5(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj5) {
      args.rows.map((idx) => {
        const item = this.gridObj5.getDataItem(idx);
        console.log(item);

         updateItem.glt_cc = item.cc_ctr;




         this.costcenterService.getByDet({cc_ctr: item.cc_ctr }).subscribe((resp:any)=>{

            
            var bool = false
            for (var j = 0; j < resp.data.accdetails.length; j++) {
  
                if (resp.data.accdetails[j].ccd1_acc_beg <=  updateItem.glt_acct && resp.data.accdetails[j].ccd1_acc_end >=  updateItem.glt_acct ) {
                 
                    
                    bool = true
                    break
                }
         
               }

               if (!bool) {

                
                alert("Compte n' appartient pas a la plage de centre de Coût ")
                updateItem.glt_cc = null;

               }
               
               else {

                bool = false
                for (var j = 0; j < resp.data.subdetails.length; j++) {
  
                    if (resp.data.subdetails[j].ccd2_sub_beg <=  updateItem.glt_sub && resp.data.subdetails[j].ccd2_sub_end >=  updateItem.glt_sub ) {
                     
                        
                        bool = true
                        break
                    }
             
                   }

                   if (!bool) {

                
                    alert("Sous Compte n' appartient pas a la plage de centre de Coût ")
                    updateItem.glt_cc = null;

                   }
                   else {
                    updateItem.glt_cc = item.cc_ctr;

                   }

               }
        });



        this.gridService.updateItem(updateItem);
        
        })
      
      
    }
  }


  angularGridReady5(angularGrid: AngularGridInstance) {
    this.angularGrid5 = angularGrid
    this.gridObj5 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid5() {
    this.columnDefinitions5 = [
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
            id: "cc_ctr",
            name: "Centre de Coût",
            field: "cc_ctr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "cc_desc",
            name: "Designation",
            field: "cc_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "cc_active",
          name: "Actif",
          field: "cc_active",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        
    ]

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
        },
        multiSelect: false,
        rowSelectionOptions: {
            selectActiveRow: true,
        },
    }

    // fill the dataset with your data
    this.costcenterService
        .getAll()
        .subscribe((response: any) => (this.ccs = response.data))
}
open5(content) {
    this.prepareGrid5()
    this.modalService.open(content, { size: "lg" })
}



handleSelectedRowsChanged6(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj6) {
      args.rows.map((idx) => {
        const item = this.gridObj6.getDataItem(idx);
        console.log(item);

         updateItem.glt_project = item.pm_code;
        this.gridService.updateItem(updateItem);
        
        })
      
      
    }
  }
  angularGridReady6(angularGrid: AngularGridInstance) {
    this.angularGrid6 = angularGrid
    this.gridObj6 = (angularGrid && angularGrid.slickGrid) || {}
  }
  
  
  prepareGrid6() {
    this.columnDefinitions6 = [
        {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
        {
            id: "pm_code",
            name: "Code Projet",
            field: "pm_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "pm_desc",
            name: "Designation",
            field: "pm_desc",
            sortable: true,
            width: 120,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "pm_cust",
          name: "Client",
          field: "pm_cust",
          sortable: true,
          width: 80,
          filterable: true,
          type: FieldType.string,
      },
      
        
    ];
  
    this.gridOptions6 = {
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
    this.projectService
        .getAll()
        .subscribe((response: any) => (this.pms = response.data))
  }
  open6(content) {
   
    this.prepareGrid6()
    this.modalService.open(content, { size: "lg" })
  }
  



  handleSelectedRowsChanged7(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj7) {
      args.rows.map((idx) => {
        const item = this.gridObj7.getDataItem(idx);
        console.log(item);

         updateItem.glt_entity = item.en_entity;
        this.gridService.updateItem(updateItem);
        
        })
      
      
    }
  }
  angularGridReady7(angularGrid: AngularGridInstance) {
    this.angularGrid7 = angularGrid
    this.gridObj7 = (angularGrid && angularGrid.slickGrid) || {}
  }
  
  
  prepareGrid7() {
    this.columnDefinitions7 = [

        {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
      },
      {
          id: "en_entity",
          name: "Code Entitee",
          field: "en_entity",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "en_name",
          name: "Designation",
          field: "en_name",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "en_primary",
        name: "Principale",
        field: "en_primary",
        sortable: true,
        filterable: true,
        type: FieldType.boolean,
      },
      {
          id: "en_type",
          name: "Type",
          field: "en_type",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "en_curr",
        name: "Devise",
        field: "en_curr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "en_adj_bs",
        name: "Rég FX",
        field: "en_adj_bs",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "en_addr",
        name: "Adresse de lq Société",
        field: "en_addr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ]
      this.gridOptions7 = {
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
    this.entityService
        .getAll()
        .subscribe((response: any) => (this.ens = response.data))
  }
  open7(content) {
   
    this.prepareGrid7()
    this.modalService.open(content, { size: "lg" })
  }
  
}