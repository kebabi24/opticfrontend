import { Component, OnInit } from "@angular/core"
import {
    NgbDropdownConfig,
    NgbTabChangeEvent,
    NgbTabsetConfig,
    NgbModal,
} from "@ng-bootstrap/ng-bootstrap"

// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Editor,
    Editors,
    AngularGridInstance,
    FieldType, GridService
} from "angular-slickgrid"

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

import { Site, SiteService, AccountService , InventoryStatusService, EntityService} from "../../../../core/erp"

@Component({
    selector: "kt-create-site",
    templateUrl: "./create-site.component.html",
    styleUrls: ["./create-site.component.scss"],
    providers: [NgbDropdownConfig, NgbTabsetConfig],
})
export class CreateSiteComponent implements OnInit {
    site: Site
    siteForm: FormGroup
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
   
    fieldcode = "";

    datastatus: [];
    columnDefinitionsstatus: Column[] = [];
    gridOptionsstatus: GridOption = {};
    gridObjstatus: any;
    angularGridstatus: AngularGridInstance;
    dataentity: [];
    columnDefinitionsentity: Column[] = [];
    gridOptionsentity: GridOption = {};
    gridObjentity: any;
    angularGridentity: AngularGridInstance;


    constructor(
        config: NgbDropdownConfig,
        private siteFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private inventoryStatusService: InventoryStatusService,
        private accountService: AccountService,
        private entityService: EntityService,
        private layoutUtilsService: LayoutUtilsService,
        private modalService: NgbModal,
        private siteService: SiteService
    ) {
        config.autoClose = true
    }

    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.createForm()
    }
    //create form
    createForm() {
      this.loadingSubject.next(false)
        this.site = new Site()
        this.siteForm = this.siteFB.group({
            si_site: [this.site.si_site, Validators.required],
            si_desc: [{ value: this.site.si_desc, disabled: !this.isExist },  Validators.required ],
            si_entity: [{ value: this.site.si_entity, disabled: !this.isExist }],
            si_default: [{ value: this.site.si_default, disabled: !this.isExist }],
            si_status: [{ value: this.site.si_status, disabled: !this.isExist }],
            si_xfer_cc: [{ value: this.site.si_xfer_cc, disabled: !this.isExist }],
            si_xfer_sub: [{ value: this.site.si_xfer_sub, disabled: !this.isExist }],
            si_xfer_acct: [{ value: this.site.si_xfer_acct, disabled: !this.isExist }],
            si_auto_loc: [{ value: this.site.si_auto_loc, disabled: !this.isExist }],
            si_xfer_ownership: [{ value: this.site.si_xfer_ownership, disabled: !this.isExist }],

        })
    }
    
    onChangeCode() {
        const controls = this.siteForm.controls
        this.siteService
            .getBy({
                  si_site: controls.si_site.value,
                  

            })
            .subscribe((response: any) => {
                if (response.data.length) {
                    this.isExist = true
                    console.log(response.data.length)
                } else {
                    controls.si_desc.enable()
                    controls.si_status.enable()
                    controls.si_default.enable()
                    controls.si_entity.enable()
                  
                    controls.si_xfer_acct.enable()
                    controls.si_xfer_sub.enable()
                    controls.si_xfer_cc.enable()
                    controls.si_auto_loc.enable()
                    controls.si_xfer_ownership.enable()

                }
               
         })
       
      }


      changeStatus(field) {
        const controls = this.siteForm.controls; // chof le champs hada wesh men form rah
    
        let is_status: any;
        if (field == "is_status") {
         
           is_status = controls.si_status.value;
          
        }
       
    
        this.inventoryStatusService.getBy({is_status}).subscribe(
          (res: any) => {
            const { data } = res;
            const message = "Ce code status n'existe pas!";
            if (!data.length) {
              this.layoutUtilsService.showActionNotification(
                message,
                MessageType.Create,
                10000,
                true,
                true
              );
              this.error = true;
            } else {
              this.error = false;
            }
          },
          (error) => console.log(error)
        );
      }
    
    //reste form
    reset() {
        this.site = new Site()
        this.createForm()
        this.hasFormErrors = false
    }
    // save data
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.siteForm.controls
        /** check form */
        if (this.siteForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )

            this.hasFormErrors = true
            return
        }

        // tslint:disable-next-line:prefer-const
        let site = this.prepareSite()
        this.addSite(site)
    }
    /**
     * Returns object for saving
     */
    prepareSite(): Site {
        const controls = this.siteForm.controls
        const _site = new Site()
        _site.si_site = controls.si_site.value
        _site.si_desc= controls.si_desc.value
        _site.si_entity= controls.si_entity.value
        _site.si_default= controls.si_default.value
        _site.si_status= controls.si_status.value
        _site.si_xfer_cc= controls.si_xfer_cc.value
        _site.si_xfer_sub= controls.si_xfer_sub.value
        _site.si_xfer_acct= controls.si_xfer_acct.value
        _site.si_auto_loc= controls.si_auto_loc.value
        _site.si_xfer_ownership= controls.si_xfer_ownership.value
        return _site
    }
    /**
     * Add code
     *
     * @param _code: CodeModel
     */
    addSite(_site: Site) {
        this.loadingSubject.next(true)
        this.siteService.add(_site).subscribe(
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
                this.router.navigateByUrl("/")
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




    handleSelectedRowsChangedstatus(e, args) {
        const controls1 = this.siteForm.controls;
        
        if (Array.isArray(args.rows) && this.gridObjstatus) {
          args.rows.map((idx) => {
            const item = this.gridObjstatus.getDataItem(idx);
            // TODO : HERE itterate on selected field and change the value of the selected field
            switch (this.selectedField) {
              case "si_status": {
                controls1.si_status.setValue(item.is_status || "");
                break;
              }
              
              default:
                break;
            }
          });
        }
      }
    

    angularGridReadystatus(angularGrid: AngularGridInstance) {
        this.angularGridstatus = angularGrid;
        this.gridObjstatus = (angularGrid && angularGrid.slickGrid) || {};
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
          .subscribe((response: any) => (this.datastatus = response.data));
      }
      openstatus(content, field) {
        this.selectedField = field;
        this.prepareGridstatus();
        this.modalService.open(content, { size: "lg" });
      }

      changeEntity(field) {
        const controls = this.siteForm.controls; // chof le champs hada wesh men form rah
      
        let en_entity: any;
        if (field == "si_entity") {
         
           en_entity = controls.si_entity.value;
          
        }
       
      
        this.entityService.getBy({en_entity}).subscribe(
          (res: any) => {
            const { data } = res;
            const message = "Cette Entitee n'existe pas!";
            if (!data.length) {
              this.layoutUtilsService.showActionNotification(
                message,
                MessageType.Create,
                10000,
                true,
                true
              );
              this.error = true;
            } else {
              this.error = false;
            }
          },
          (error) => console.log(error)
        );
      }
      

      changeAcct (field){

        const controls1 = this.siteForm.controls 
        let ac_code : any
        if (field=="si_xfer_acct") {
           ac_code  = controls1.si_xfer_acct.value
        
        }
        
      this.accountService.getBy({ac_code}).subscribe((res:any)=>{
          const {data} = res
          console.log(res)
          if (!data){ this.layoutUtilsService.showActionNotification(
              "ce compte n'existe pas!",
              MessageType.Create,
              10000,
              true,
              true
          )
          this.error = true}
          else {
              this.error = false
          }
    
    
      },error=>console.log(error))
    }
    
    

    handleSelectedRowsChanged3(e, args) {
        const controls1 = this.siteForm.controls
        
    
        if (Array.isArray(args.rows) && this.gridObj3) {
            args.rows.map((idx) => {
                const item = this.gridObj3.getDataItem(idx)
                // TODO : HERE itterate on selected field and change the value of the selected field
                switch (this.selectedField) {
                  case "si_xfer_acct": {
                      controls1.si_xfer_acct.setValue(item.ac_code || "")
                      break
                  }    
                  
                    default:
                        break
                }
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
    open3(content, field) {
        this.selectedField = field
        this.prepareGrid3()
        this.modalService.open(content, { size: "lg" })
    }
    

    handleSelectedRowsChangedentity(e, args) {
        const controls1 = this.siteForm.controls
        
      
        if (Array.isArray(args.rows) && this.gridObjentity) {
            args.rows.map((idx) => {
                const item = this.gridObjentity.getDataItem(idx)
                // TODO : HERE itterate on selected field and change the value of the selected field
                switch (this.selectedField) {
                  case "si_entity": {
                      controls1.si_entity.setValue(item.en_entity || "")
                      break
                  }    
                  
                    default:
                        break
                }
            })
        }
      }
      angularGridReadyentity(angularGrid: AngularGridInstance) {
        this.angularGridentity = angularGrid
        this.gridObjentity = (angularGrid && angularGrid.slickGrid) || {}
      }
      
      prepareGridentity() {
        this.columnDefinitionsentity = [
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
                id: "en_entity",
                name: "Entitee",
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
              id: "en_type",
              name: "Type",
              field: "en_type",
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
            
      
        ]
      
        this.gridOptionsentity = {
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
            .subscribe((response: any) => (this.dataentity = response.data))
           
      }
      openentity(content, field) {
        this.selectedField = field
        this.prepareGridentity()
        this.modalService.open(content, { size: "lg" })
      }
      

}
