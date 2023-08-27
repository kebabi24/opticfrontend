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

import { Location, LocationService, CodeService, SiteService, InventoryStatusService, ProjectService } from "../../../../core/erp"

@Component({
    selector: "kt-create-loc",
    templateUrl: "./create-loc.component.html",
    styleUrls: ["./create-loc.component.scss"],
    providers: [NgbDropdownConfig, NgbTabsetConfig],
})
export class CreateLocComponent implements OnInit {
    location: Location
    locationForm: FormGroup
    hasFormErrors = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    loc_type: any[] = []
    isExist = false

    datasite: []
    columnDefinitionssite: Column[] = []
    gridOptionssite: GridOption = {}
    gridObjsite: any
    angularGridsite: AngularGridInstance
    selectedField = ""

    datastatus: []
    columnDefinitionsstatus: Column[] = []
    gridOptionsstatus: GridOption = {}
    gridObjstatus: any
    angularGridstatus: AngularGridInstance

    datapm: []
    columnDefinitionspm: Column[] = []
    gridOptionspm: GridOption = {}
    gridObjpm: any
    angularGridpm: AngularGridInstance
    
    data: []
    columnDefinitions3: Column[] = []
    gridOptions3: GridOption = {}
    gridObj3: any
    angularGrid3: AngularGridInstance
    error = false;

    constructor(
        config: NgbDropdownConfig,
        private locationFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private locationService: LocationService,
        private siteService: SiteService,
        private inventoryStatusService: InventoryStatusService,
        private projectService : ProjectService,
        private modalService: NgbModal,
        private codeService: CodeService
    ) {
        config.autoClose = true
        this.codeService
            .getBy({ code_fldname: "loc_type" })
            .subscribe((response: any) => (this.loc_type = response.data))
    }

    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.createForm()
    }
    //create form
    createForm() {
        this.loadingSubject.next(false)
        this.location = new Location()
        this.locationForm = this.locationFB.group({
            loc_site: [this.location.loc_site, Validators.required],
            loc_loc: [this.location.loc_loc, Validators.required],
            loc_desc: [{ value: this.location.loc_desc, disabled: !this.isExist },  Validators.required ],
            loc_status: [{ value: this.location.loc_status,disabled: !this.isExist }, Validators.required],
            loc_project: [{ value: this.location.loc_project, disabled: !this.isExist }],
            loc_perm: [{ value: this.location.loc_perm, disabled: !this.isExist }],
            loc_type: [{ value: this.location.loc_type , disabled: !this.isExist }],
            loc_single: [{ value: this.location.loc_single, disabled: !this.isExist }],
            loc__qad01: [{ value: this.location.loc__qad01, disabled: !this.isExist }],
            loc_cap: [{ value: this.location.loc_cap, disabled: !this.isExist }],
            loc_cap_um: [{ value: this.location.loc_cap_um, disabled: !this.isExist }],
            loc_xfer_ownership: [{ value: this.location.loc_xfer_ownership, disabled: !this.isExist }],
        })
    }

    onChangeCode() {
        const controls = this.locationForm.controls
        this.locationService
            .getBy({
                  loc_site: controls.loc_site.value,
                  loc_loc: controls.loc_loc.value,

            })
            .subscribe((response: any) => {
                if (response.data.length) {
                    this.isExist = true
                    console.log(response.data.length)
                } else {
                    controls.loc_desc.enable()
                    controls.loc_status.enable()
                    controls.loc_project.enable()
                    controls.loc_perm.enable()
                    controls.loc_type.enable()
                    controls.loc_single.enable()
                    controls.loc__qad01.enable()
                    controls.loc_cap.enable()
                    controls.loc_cap_um.enable()
                    controls.loc_xfer_ownership.enable()

                }
         })
      }
    //reste form
    reset() {
        this.location = new Location()
        this.createForm()
        this.hasFormErrors = false
    }
    // save data
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.locationForm.controls
        /** check form */
        if (this.locationForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )

            this.hasFormErrors = true
            return
        }

        // tslint:disable-next-line:prefer-const
        let location = this.prepateLocation()
        this.addLocation(location)
    }
    /**
     * Returns object for saving
     */
    prepateLocation(): Location {
        const controls = this.locationForm.controls
        const _location = new Location()
        _location.loc_site = controls.loc_site.value
        _location.loc_loc = controls.loc_loc.value
        _location.loc_desc = controls.loc_desc.value
        _location.loc_status = controls.loc_status.value
        _location.loc_project = controls.loc_project.value
        _location.loc_perm = controls.loc_perm.value
        _location.loc_type = controls.loc_type.value
        _location.loc_single = controls.loc_single.value
        _location.loc__qad01 = controls.loc__qad01.value
        _location.loc_cap = controls.loc_cap.value
        _location.loc_cap_um = controls.loc_cap_um.value
        _location.loc_xfer_ownership = controls.loc_xfer_ownership.value

        return _location
    }
    /**
     * Add code
     *
     * @param _code: CodeModel
     */
    addLocation(_location: Location) {
        this.loadingSubject.next(true)
        this.locationService.add(_location).subscribe(
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
    handleSelectedRowsChangedsite(e, args) {
        const controls = this.locationForm.controls
       
        if (Array.isArray(args.rows) && this.gridObjsite) {
            args.rows.map((idx) => {
                const item = this.gridObjsite.getDataItem(idx)
                // TODO : HERE itterate on selected field and change the value of the selected field
                switch (this.selectedField) {
                    case "loc_site": {
                        controls.loc_site.setValue(item.si_site || "")
                        break
                    }    
                    default:
                        break
                }
            })
        }
    }
    angularGridReadysite(angularGrid: AngularGridInstance) {
        this.angularGridsite = angularGrid
        this.gridObjsite = (angularGrid && angularGrid.slickGrid) || {}
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
            
        ]

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
            },
            multiSelect: false,
            rowSelectionOptions: {
                selectActiveRow: true,
            },
        }

        // fill the dataset with your data
        this.siteService
            .getAll()
            .subscribe((response: any) => (this.datasite = response.data))
    }
    opensite(contentsite, field) {
        this.selectedField = field
        this.prepareGridsite()
        this.modalService.open(contentsite, { size: "lg" })
    }
    



    changeUm() {
        const controls = this.locationForm.controls; // chof le champs hada wesh men form rah
    
        let obj = {};
          
          const code_value = controls.loc_cap_um.value;
          obj = {
            code_value,
            code_fldname: 'pt_um',
          };
        
    
        this.codeService.getBy(obj).subscribe(
          (res: any) => {
            const { data } = res;
            const message = "Cette UM n'existe pas!";
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
    
    changeStatus(field) {
        const controls = this.locationForm.controls; // chof le champs hada wesh men form rah
      
        let is_status: any;
        if (field == "loc_status") {
         
           is_status = controls.loc_status.value;
          
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
      

    handleSelectedRowsChangedstatus(e, args) {
        const controls1 = this.locationForm.controls;
        
        if (Array.isArray(args.rows) && this.gridObjstatus) {
          args.rows.map((idx) => {
            const item = this.gridObjstatus.getDataItem(idx);
            // TODO : HERE itterate on selected field and change the value of the selected field
            switch (this.selectedField) {
              case "loc_status": {
                controls1.loc_status.setValue(item.is_status || "");
                break;
              }
              
              default:
                break;
            }
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
          .subscribe((response: any) => (this.datastatus = response.data));
    }
    openstatus(content, field) {
        this.selectedField = field
        this.prepareGridstatus()
        this.modalService.open(content, { size: "lg" })
    }


    handleSelectedRowsChanged3(e, args) {
        const controls = this.locationForm.controls
        
        if (Array.isArray(args.rows) && this.gridObj3) {
            args.rows.map((idx) => {
                const item = this.gridObj3.getDataItem(idx)
                // TODO : HERE itterate on selected field and change the value of the selected field
                switch (this.selectedField) {
                   
                    case "pt_um": {
                        controls.loc_cap_um.setValue(item.code_value || "")
                        break    
                    }
                    case "loc_type": {
                        controls.loc_cap_um.setValue(item.code_value || "")
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
        this.codeService
            .getBy({ code_fldname: this.selectedField })
            .subscribe((response: any) => (this.data = response.data))
      }
      open3(content, field) {
        this.selectedField = field
        this.prepareGrid3()
        this.modalService.open(content, { size: "lg" })
      }
      
      
      


      handleSelectedRowsChangedpm(e, args) {
        const controls = this.locationForm.controls
       
        if (Array.isArray(args.rows) && this.gridObjpm) {
            args.rows.map((idx) => {
                const item = this.gridObjpm.getDataItem(idx)
                // TODO : HERE itterate on selected field and change the value of the selected field
                        controls.loc_project.setValue(item.pm_code || "")
                
            })
          }

      }

    angularGridReadypm(angularGrid: AngularGridInstance) {
        this.angularGridpm = angularGrid
        this.gridObjpm = (angularGrid && angularGrid.slickGrid) || {}
    }

    prepareGridpm() {
        this.columnDefinitionspm = [
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
                id: "pm_code",
                name: "Code",
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
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "pm_cust",
                name: "Client",
                field: "pm_cust",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            
        ]

        this.gridOptionspm = {
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
            .subscribe((response: any) => (this.datapm = response.data))
    }
    openpm(content) {
        
        this.prepareGridpm()
        this.modalService.open(content, { size: "lg" })
    }
    

}
