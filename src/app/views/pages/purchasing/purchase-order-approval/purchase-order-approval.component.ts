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
import {
    Requisition,
    RequisitionService,
    SequenceService,
    ProviderService,
    UsersService,
    ItemService,
} from "../../../../core/erp"

@Component({
    selector: "kt-purchase-order-approval",
    templateUrl: "./purchase-order-approval.component.html",
    styleUrls: ["./purchase-order-approval.component.scss"],
})
export class PurchaseOrderApprovalComponent implements OnInit {
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

    requisitions: []
    columnDefinitions5: Column[] = []
    gridOptions5: GridOption = {}
    gridObj5: any
    angularGrid5: AngularGridInstance

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

    row_number
    message = ""
    requistionServer
    level1: Boolean = true
    level2: Boolean = true
    level3: Boolean = true
    res : any
    user;
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
        private seqeuncesService: SequenceService,
        private itemsService: ItemService
    ) {
        config.autoClose = true
        this.initGrid()
        this.user = JSON.parse(localStorage.getItem('user'))
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
            },

            {
                id: "desc",
                name: "Description",
                field: "item.pt_desc1",
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
            },
            {
                id: "rqd_desc",
                name: "Observation",
                field: "rqd_desc",
                sortable: true,
                width: 80,
                filterable: false,
            },
        ]

        this.gridOptions = {
            asyncEditorLoading: false,
            enableColumnPicker: true,
            enableCellNavigation: true,
            enableRowSelection: true,
            dataItemColumnValueExtractor: function getItemColumnValue(
                item,
                column
            ) {
                var val = undefined
                try {
                    val = eval("item." + column.field)
                } catch (e) {
                    // ignore
                }
                return val
            },
        }

        this.dataset = []
    }
    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.createForm()
    }

    //create form
    createForm() {
        this.loadingSubject.next(false)
        this.requisition = new Requisition()
        this.reqForm = this.reqFB.group({
            rqm_category: [
                { value: this.requisition.rqm_category, disabled: true },
            ],
            rqm_nbr: [this.requisition.rqm_nbr],
            rqm_vend: [{ value: this.requisition.rqm_vend, disabled: true }],
            rqm_req_date: [
                { value: this.requisition.rqm_req_date, disabled: true },
            ],
            rqm_need_date: [
                { value: this.requisition.rqm_need_date, disabled: true },
            ],
            rqm_rqby_userid: [
                { value: this.requisition.rqm_rqby_userid, disabled: true },
            ],
            rqm_reason: [
                { value: this.requisition.rqm_reason, disabled: true },
            ],
            rqm_status: [
                { value: this.requisition.rqm_status, disabled: true },
            ],
            rqm_rmks: [{ value: this.requisition.rqm_rmks, disabled: true }],
            appr : ['0']
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
            this.message =
                "Modifiez quelques éléments et réessayez de soumettre."
            this.hasFormErrors = true

            return
        }

        if (!this.dataset.length) {
            this.message = "La liste des article ne peut pas etre vide"
            this.hasFormErrors = true

            return
        }
        let value = ''
        const appr = controls.appr.value
        const {sequence:{seq_appr1,seq_appr2,seq_appr3, seq_appr1_lev,seq_appr2_lev,seq_appr3_lev},rqm_aprv_stat} = this.requistionServer

        if(appr=='1'){
            const {usrd_code} = this.user
            if(usrd_code == seq_appr1) value = seq_appr1_lev
            if(usrd_code == seq_appr2) value = seq_appr2_lev
            if(usrd_code == seq_appr3) value = seq_appr3_lev

        }
        if(appr=='2'){
            value = '-1'
        }
        if(appr=='3'){
            if(rqm_aprv_stat == seq_appr2_lev) value = seq_appr1_lev
            if(rqm_aprv_stat == seq_appr3_lev) value = seq_appr2_lev
        }
        console.log(value)
        this.requisitonService
            .update({ rqm_aprv_stat: value }, this.requistionServer.id)
            .subscribe((res) => {
                const url = `/`
                this.router.navigateByUrl(url, {
                    relativeTo: this.activatedRoute,
                })
            })
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
        this.seqeuncesService
            .getAll()
            .subscribe((response: any) => (this.sequences = response.data))
    }
    open(content) {
        this.prepareGrid1()
        this.modalService.open(content, { size: "lg" })
    }

    onAlertClose($event) {
        this.hasFormErrors = false
    }

    onChangeReqNbr() {
        const controls = this.reqForm.controls
        const rqm_nbr = controls.rqm_nbr.value
        this.requisitonService.findBy({ rqm_nbr }).subscribe(
            (res: any) => {
                const { requisition, details } = res.data
                this.requistionServer = requisition
                this.dataset = details
                controls.rqm_category.setValue(requisition.rqm_category)
                controls.rqm_vend.setValue(requisition.rqm_vend)
                
                const date = new Date(requisition.reqm_req_date)
                date.setDate(date.getDate() )
                
                controls.rqm_req_date.setValue({
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate(),
                })
                const daten = new Date(requisition.rqm_need_date)
                daten.setDate(daten.getDate() )
                
                controls.rqm_need_date.setValue({
                    year: daten.getFullYear(),
                    month: daten.getMonth() + 1,
                    day: daten.getDate(),
                })
                controls.rqm_rqby_userid.setValue(requisition.rqm_rqby_userid)
                controls.rqm_reason.setValue(requisition.rqm_reason)
                controls.rqm_status.setValue(requisition.rqm_status)
                controls.rqm_rmks.setValue(requisition.rqm_rmks)
                // controls.level1.setValue(
                //     true
                //         ? requisition.rqm_aprv_stat ==
                //               requisition.sequence.seq_appr1_lev
                //         : false
                // )
                // controls.level2.setValue(
                //     true
                //         ? requisition.rqm_aprv_stat ==
                //               requisition.sequence.seq_appr2_lev
                //         : false
                // )
                // controls.level3.setValue(
                //     true
                //         ? requisition.rqm_aprv_stat ==
                //               requisition.sequence.seq_appr3_lev
                //         : false
                // )
                // if (
                //     requisition.rqm_aprv_stat ==
                //     requisition.sequence.seq_appr2_lev
                // )
                //     controls.level1.disable()
            },
            (error) => {
                this.message = `Demande avec ce numero ${rqm_nbr} n'existe pas`
                this.hasFormErrors = true
            },
            () => {}
        )
    }
    
    onChange(value) {
        console.log(value)
        const controls = this.reqForm.controls
        switch (value) {
            case "1":
                controls.level2.setValue(false)
                controls.level3.setValue(false)
                break
            case "2":
                controls.level1.setValue(false)
                controls.level3.setValue(false)
                break
            case "3":
                controls.level2.setValue(false)
                controls.level1.setValue(false)
                break

            default:
                break
        }
    }


    handleSelectedRowsChanged5(e, args) {
        const controls = this.reqForm.controls
       
        if (Array.isArray(args.rows) && this.gridObj5) {
            args.rows.map((idx) => {
                const item = this.gridObj5.getDataItem(idx)
                
                
                controls.rqm_nbr.setValue(item.rqm_nbr || "")

                //const controls = this.reqForm.controls
                const rqm_nbr = controls.rqm_nbr.value
                this.requisitonService.findBy({ rqm_nbr }).subscribe(
                    (res: any) => {
                        const { requisition, details } = res.data
                        this.requistionServer = requisition
                        this.dataset = details
                        controls.rqm_category.setValue(requisition.rqm_category)
                        controls.rqm_vend.setValue(requisition.rqm_vend)
                        const date = new Date(requisition.rqm_req_date)
                        date.setDate(date.getDate() )
                        
                        controls.rqm_req_date.setValue({
                            year: date.getFullYear(),
                            month: date.getMonth() + 1,
                            day: date.getDate(),
                        })
                        const daten = new Date(requisition.rqm_need_date)
                        daten.setDate(daten.getDate() )
                        
                        controls.rqm_need_date.setValue({
                            year: daten.getFullYear(),
                            month: daten.getMonth() + 1,
                            day: daten.getDate(),
                        })
                        controls.rqm_rqby_userid.setValue(requisition.rqm_rqby_userid)
                        controls.rqm_reason.setValue(requisition.rqm_reason)
                        controls.rqm_status.setValue(requisition.rqm_status)
                        controls.rqm_rmks.setValue(requisition.rqm_rmks)
                        // controls.level1.setValue(
                        //     true
                        //         ? requisition.rqm_aprv_stat ==
                        //               requisition.sequence.seq_appr1_lev
                        //         : false
                        // )
                        // controls.level2.setValue(
                        //     true
                        //         ? requisition.rqm_aprv_stat ==
                        //               requisition.sequence.seq_appr2_lev
                        //         : false
                        // )
                        // controls.level3.setValue(
                        //     true
                        //         ? requisition.rqm_aprv_stat ==
                        //               requisition.sequence.seq_appr3_lev
                        //         : false
                        // )
                        // if (
                        //     requisition.rqm_aprv_stat ==
                        //     requisition.sequence.seq_appr2_lev
                        // )
                        //     controls.level1.disable()
                    },
                    (error) => {
                        this.message = `Demande avec ce numero ${rqm_nbr} n'existe pas`
                        this.hasFormErrors = true
                    },
                    () => {}
                )





//                controls.rqm_rqby_userid.setValue(item.rqm_rqby_userid || "")
  //              controls.rqm_category.setValue(item.rqm_category || "")

    //            controls.rqm_req_date.setValue({
     //               year: new Date(item.rqm_req_date).getFullYear(),
      //              month: new Date(item.rqm_req_date).getMonth() + 1,
      //             day: new Date(item.rqm_req_date).getDate(),
       //        }|| "")
        //        controls.rqm_need_date.setValue({
        //            year: new Date(item.rqm_need_date).getFullYear(),
         //           month: new Date(item.rqm_need_date).getMonth() + 1,
         //           day: new Date(item.rqm_need_date).getDate(),
          //      }|| "")
                
         //       controls.rqm_reason.setValue(item.rqm_reason || "")
          //      controls.rqm_status.setValue(item.rqm_status || "")
           //     controls.rqm_rmks.setValue(item.rqm_rmks || "")
            



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
                name: "id",
                field: "id",
                sortable: true,
                minWidth: 80,
                maxWidth: 80,
            },
            {
                id: "rqm_nbr",
                name: "N° Demande",
                field: "rqm_nbr",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "rqm_req_date",
                name: "Date",
                field: "rqm_req_date",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "rqm_total",
                name: "Total",
                field: "rqm_total",
                sortable: true,
                filterable: true,
                type: FieldType.float,
            },
            {
                id: "rqm_status",
                name: "status",
                field: "rqm_status",
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
        this.requisitonService
            .getNotByAll({})
           //.getAll() 
           .subscribe((response: any) => (this.requisitions = response.data))
    }
    open5(content) {
        this.prepareGrid5()
        this.modalService.open(content, { size: "lg" })
    }

    


}
