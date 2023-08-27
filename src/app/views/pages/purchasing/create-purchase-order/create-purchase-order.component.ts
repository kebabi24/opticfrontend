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
import { Requisition, RequisitionService, SequenceService, ProviderService, UsersService, ItemService } from "../../../../core/erp"
import { AlertComponent } from "../../../partials/content/crud"
import { sequence } from "@angular/animations"

@Component({
    selector: "kt-create-purchase-order",
    templateUrl: "./create-purchase-order.component.html",
    styleUrls: ["./create-purchase-order.component.scss"],
})
export class CreatePurchaseOrderComponent implements OnInit {
    requisition: Requisition
    reqForm: FormGroup
    hasFormErrors = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>

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

    providers: []
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

    row_number;
    user
    message=''

    constructor(
        config: NgbDropdownConfig,
        private reqFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private modalService: NgbModal,
        private layoutUtilsService: LayoutUtilsService,
        private requisitonService: RequisitionService,
        private providersService: ProviderService,
        private userService: UsersService,
        private sequencesService: SequenceService,
        private itemsService: ItemService
    ) {
        config.autoClose = true
        this.initGrid()
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
                    if (confirm('Êtes-vous sûr de supprimer cette ligne?')) {
                        this.angularGrid.gridService.deleteItem(args.dataContext);
                      }
                  }
            },
            
            {
                id: "rqd_line",
                name: "Ligne",
                field: "rqd_line",
                minWidth: 50,
                maxWidth: 50,
                selectable: true,
            },
            {
                id: "rqd_part",
                name: "Article",
                field: "rqd_part",
                sortable: true,
                width: 50,
                filterable: false,
                editor: {
                    model: Editors.text,
                },
                onCellChange: (e: Event, args: OnEventArgs) => {
                 
                    const controls = this.reqForm.controls 
                    this.itemsService.getBy({pt_part: args.dataContext.rqd_part }).subscribe((resp:any)=>{
                        
                      if (resp.data.length != 0) {
          
          
                        if (resp.data[0].pt_buyer !== controls.rqm_category.value ) {
                          alert("Access Interdit pour cet article")
                          this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , rqd_part: null })
          
          
                        } else {
          
                        this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data[0].pt_desc1 , rqd_um:resp.data[0].pt_um})
          
                        }
                
                
                   }  else {
                      alert("Article Nexiste pas")
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , rqd_part: null })
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
                width: 80,
                filterable: false,
                
            },
            {
                id: "rqd_req_qty",
                name: "QTE",
                field: "rqd_req_qty",
                sortable: true,
                width: 80,
                filterable: false,
                type: FieldType.float,
                editor: {
                    model: Editors.float,
                    params:{decimalPlaces:2}
                },
            },
            {
                id: "rqd_um",
                name: "UM",
                field: "rqd_um",
                sortable: true,
                width: 80,
                filterable: false,
                
            },
            {
                id: "rqd_cc",
                name: "Centre de cout",
                field: "rqd_cc",
                sortable: true,
                width: 80,
                filterable: false,
                editor: {
                    model: Editors.text,
                },
                
            },
            {
                id: "rqd_desc",
                name: "Observation",
                field: "rqd_desc",
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
        this.user =  JSON.parse(localStorage.getItem('user'))
    }

    //create form
    createForm() {
        this.loadingSubject.next(false)
        this.requisition = new Requisition()
        const date = new Date;
        this.reqForm = this.reqFB.group({
          rqm_category: [this.requisition.rqm_category , Validators.required],
          rqm_nbr: [this.requisition.rqm_nbr ],
          rqm_vend: [this.requisition.rqm_vend ],
          rqm_req_date:[{
            year:date.getFullYear(),
            month: date.getMonth()+1,
            day: date.getDate()
          }],
          rqm_need_date: [{
            year:date.getFullYear(),
            month: date.getMonth()+1,
            day: date.getDate()
          }], 
          
          
          rqm_rqby_userid: [this.requisition.rqm_rqby_userid],
          rqm_reason: [this.requisition.rqm_reason ],
          rqm_status: [this.requisition.rqm_status ],
          rqm_rmks: [this.requisition.rqm_rmks ],
        })
    }


    onChangeSeq() {
        const controls = this.reqForm.controls
        this.sequencesService
            .getBy({seq_seq: controls.rqm_category.value, seq_type: 'RQ', seq_profile: this.user.usrd_profile})
            .subscribe((response: any) => {
                console.log(response)
                if (response.data.length == 0) {
                    alert("Sequence nexiste pas")
                    controls.rqm_category.setValue("")
                    console.log(response.data.length)
                    document.getElementById("SEQUENCE").focus();
                } 
            })
    }
    
    //reste form
    reset() {
        this.requisition = new Requisition()
        this.createForm()
        this.hasFormErrors = false
    }
    
    // save data
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.reqForm.controls
        /** check form */
        if (this.reqForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )
            this.message = 'Modifiez quelques éléments et réessayez de soumettre.'
            this.hasFormErrors = true

            return
        }

        if (!this.dataset.length){
            this.message = 'La liste des article ne peut pas etre vide'
            this.hasFormErrors = true

            return
        }
        // tslint:disable-next-line:prefer-const
        let req = this.prepareReq()
        for(let data of this.dataset){
          delete data.id
          delete data.cmvid
          delete data.desc
        }
        this.addReq(req, this.dataset)
    }
    
    /**
     *
     * Returns object for saving
     */
    prepareReq(): any {
        const controls = this.reqForm.controls
        const _req = new Requisition()
        _req.rqm_category =  controls.rqm_category.value
          _req.rqm_nbr=  controls.rqm_nbr.value
          _req.rqm_vend =  controls.rqm_vend.value
          _req.rqm_req_date=  controls.rqm_req_date.value ? `${controls.rqm_req_date.value.year}/${controls.rqm_req_date.value.month}/${controls.rqm_req_date.value.day}`: null
          _req.rqm_need_date=  controls.rqm_need_date.value ? `${controls.rqm_need_date.value.year}/${controls.rqm_need_date.value.month}/${controls.rqm_need_date.value.day}`: null
          _req.rqm_rqby_userid=  controls.rqm_rqby_userid.value
          _req.rqm_reason=  controls.rqm_reason.value
          _req.rqm_status=  controls.rqm_status.value
          _req.rqm_rmks=  controls.rqm_rmks.value
          _req.rqm_open= true
          _req.rqm_aprv_stat = '0'
        return _req
    }
    /**
     * Add req
     *
     * @param _req: req
     */
    addReq(_req: any, detail:any) {
        this.loadingSubject.next(true)
        this.requisitonService.add({ requisition: _req, requisitionDetail: detail }).subscribe(
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

    // add new Item to Datatable
    addNewItem() {
        this.gridService.addItem({
            id: this.dataset.length + 1,
            rqd_line: this.dataset.length + 1,
            rqd_part: "",
            cmvid: "",
            desc: "",
            rqd_req_qty: 0,
            rqd_um: "",
            rqd_cc: "",
            rqd_desc: "",
        },{position:"bottom"})
    }

    handleSelectedRowsChanged(e, args) {
        const controls = this.reqForm.controls
        if (Array.isArray(args.rows) && this.gridObj1) {
            args.rows.map((idx) => {
                const item = this.gridObj1.getDataItem(idx)
                controls.rqm_category.setValue(item.seq_seq || "")
            })
        }
    }

    angularGridReady(angularGrid: AngularGridInstance) {
        this.angularGrid1 = angularGrid
        this.gridObj1 = (angularGrid && angularGrid.slickGrid) || {}
    }

    prepareGrid1() {
        this.columnDefinitions1 = [
            {
                id: "id",
                name: "id",
                field: "id",
                sortable: true,
                minWidth: 80,
                maxWidth: 80,
            },
            {
                id: "seq_seq",
                name: "code sequence",
                field: "seq_seq",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "seq_desc",
                name: "description",
                field: "seq_desc",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "seq_appr1",
                name: "approbateur 1",
                field: "seq_appr1",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "seq_appr2",
                name: "approbateur 2",
                field: "seq_appr2",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "seq_appr3",
                name: "approbateur 3",
                field: "seq_appr3",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
        ]

        this.gridOptions1 = {
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
       
        this.sequencesService
            .getBy({seq_type: 'RQ', seq_profile: this.user.usrd_profile})
            .subscribe((response: any) => (this.sequences = response.data))
           
    }
    open(content) {
        this.prepareGrid1()
        this.modalService.open(content, { size: "lg" })
    }
    handleSelectedRowsChanged2(e, args) {
        const controls = this.reqForm.controls
        if (Array.isArray(args.rows) && this.gridObj2) {
            args.rows.map((idx) => {
                const item = this.gridObj2.getDataItem(idx)
                controls.rqm_vend.setValue(item.vd_addr || "")
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
                id: "vd_addr",
                name: "code",
                field: "vd_addr",
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
        this.providersService
            .getAll()
            .subscribe((response: any) => (this.providers = response.data))
    }
    open2(content) {
        this.prepareGrid2()
        this.modalService.open(content, { size: "lg" })
    }

    handleSelectedRowsChanged3(e, args) {
        const controls = this.reqForm.controls
        if (Array.isArray(args.rows) && this.gridObj3) {
            args.rows.map((idx) => {
                const item = this.gridObj3.getDataItem(idx)
                console.log(item)
                controls.rqm_rqby_userid.setValue(item.usrd_code || "")
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
                name: "id",
                field: "id",
                sortable: true,
                minWidth: 80,
                maxWidth: 80,
            },
            {
                id: "usrd_code",
                name: "code user",
                field: "usrd_code",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "usrd_name",
                name: "nom",
                field: "usrd_name",
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
        this.userService
            .getAllUsers()
            .subscribe((response: any) => (this.users = response.data))
    }
    open3(content) {
        this.prepareGrid3()
        this.modalService.open(content, { size: "lg" })
    }

    handleSelectedRowsChanged4(e, args) {
        let updateItem = this.gridService.getDataItemByRowIndex(this.row_number)
        if (Array.isArray(args.rows) && this.gridObj4) {
            args.rows.map((idx) => {
                const item = this.gridObj4.getDataItem(idx)
                console.log(item)
                updateItem.rqd_part = item.pt_part
                updateItem.desc = item.pt_desc1
                updateItem.rqd_um = item.pt_um
                this.gridService.updateItem(updateItem);

            })
        }
    }

    angularGridReady4(angularGrid: AngularGridInstance) {
        this.angularGrid4 = angularGrid
        this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {}
    }

    prepareGrid4() {
        const controls = this.reqForm.controls
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
            .getBy ({pt_buyer: controls.rqm_category.value })
            .subscribe((response: any) => (this.items = response.data))
         
    }
    open4(content) {
        this.prepareGrid4()
        this.modalService.open(content, { size: "lg" })
    }
    onAlertClose($event) {
        this.hasFormErrors = false
    }

}
