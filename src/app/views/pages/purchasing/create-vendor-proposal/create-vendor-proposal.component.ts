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
import { FormGroup, FormBuilder, Validators, NgControlStatus } from "@angular/forms"
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
import {
    VendorProposal,
    RequisitionService,
    SequenceService,
    ProviderService,
    UsersService,
    ItemService,
    VendorProposalService,
    CodeService,
    DeviseService
} from "../../../../core/erp"
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY } from "@angular/cdk/overlay/overlay-directives"

@Component({
    selector: "kt-create-vendor-proposal",
    templateUrl: "./create-vendor-proposal.component.html",
    styleUrls: ["./create-vendor-proposal.component.scss"],
})
export class CreateVendorProposalComponent implements OnInit {
    vendorProposal: VendorProposal
    vpForm: FormGroup
    hasFormErrors = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>

    error = false
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

    devises: [];
    columnDefinitionscurr: Column[] = [];
    gridOptionscurr: GridOption = {};
    gridObjcurr: any;
    angularGridcurr: AngularGridInstance;

    requisitions: [];
    columnDefinitions5: Column[] = [];
    gridOptions5: GridOption = {};
    gridObj5: any;
    angularGrid5: AngularGridInstance;
    row_number
    message = ""
    date: string;

    paymentMethods: any[] = []
    total:any = 0;
curr: String;
    constructor(
        config: NgbDropdownConfig,
        private vpFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private modalService: NgbModal,
        private layoutUtilsService: LayoutUtilsService,
        private requisitonService: RequisitionService,
        private vendorProposalService: VendorProposalService,
        private requisitionService: RequisitionService,
        private providersService: ProviderService,
        private userService: UsersService,
        private seqeuncesService: SequenceService,
        private itemsService: ItemService,
        private deviseService: DeviseService,
        private codeService: CodeService
    ) {
        config.autoClose = true
        this.initGrid()
        this.codeService
            .getBy({ code_fldname: "vd_cr_terms" })
            .subscribe((response: any) => (this.paymentMethods = response.data))
    }
    gridReady(angularGrid: AngularGridInstance) {
        this.angularGrid = angularGrid
        this.dataView = angularGrid.dataView
        this.grid = angularGrid.slickGrid
        this.gridService = angularGrid.gridService
    }

    initGrid() {
       // const controls = this.vpForm.controls
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
                        this.angularGrid.gridService.deleteItem(
                            args.dataContext
                        )
                    }
                },
            },

            {
                id: "vpd_line",
                name: "Ligne",
                field: "vpd_line",
                minWidth: 50,
                maxWidth: 50,
                selectable: true,
            },
            {
                id: "vpd_part",
                name: "Article",
                field: "vpd_part",
                sortable: true,
                width: 50,
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
                    this.row_number = args.row
                    let element: HTMLElement = document.getElementById(
                        "openItemsGrid"
                    ) as HTMLElement
                    element.click()
                },
            },
            {
                id: "vpd_vend_part",
                name: "Description Fournisseur",
                field: "vpd_vend_part",
                sortable: true,
                width: 80,
                filterable: false,
                editor: {
                    model: Editors.text,
                },
            },
            {
                id: "vpd_q_qty",
                name: "QTE",
                field: "vpd_q_qty",
                sortable: true,
                width: 80,
                filterable: false,
                type: FieldType.float,
                editor: {
                    model: Editors.float,
                    params:{decimalPlaces:2}

                },
                onCellChange : (e: Event, args: OnEventArgs)=>{
                  this.total += (args.dataContext.vpd_q_qty * args.dataContext.vpd_q_price )
                }
            },
            {
                id: "vpd_um",
                name: "UM",
                field: "vpd_um",
                sortable: true,
                width: 80,
                filterable: false,
            },
            {
                id: "vpd_q_price",
                name: "Prix offre",
                field: "vpd_q_price",
                sortable: true,
                width: 80,
                filterable: false,
                type: FieldType.float,
                editor: {
                    model: Editors.float,
                    params:{decimalPlaces:2}

                },
                onCellChange : (e: Event, args: OnEventArgs)=>{
                  this.total +=  (args.dataContext.vpd_q_qty * args.dataContext.vpd_q_price)
                }
            },
            {
                id: "vpd_mfgr_part",
                name: "Observation",
                field: "vpd_mfgr_part",
                sortable: true,
                width: 80,
                filterable: false,
                editor: {
                    model: Editors.text,
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
    }

    //create form
    createForm() {
        this.loadingSubject.next(false)
        this.vendorProposal = new VendorProposal()
        this.vpForm = this.vpFB.group({
            vp_rqm_nbr: [this.vendorProposal.vp_rqm_nbr],
            vp_nbr: [this.vendorProposal.vp_nbr],
            vp_vend: [this.vendorProposal.vp_vend],
            vp_curr: [this.vendorProposal.vp_curr],

            vp_ex_rate : [this.vendorProposal.vp_ex_rate],
            vp_ex_rate2: [this.vendorProposal.vp_ex_rate2],

            vp_date: [this.vendorProposal.vp_date],
            vp_q_date: [this.vendorProposal.vp_q_date],
            vp_pay_meth: [this.vendorProposal.vp_pay_meth],
            dec01: [{value: this.vendorProposal.dec01, disabled :true}],
            
            vp_vend_lead: [this.vendorProposal.vp_vend_lead],
            vp_comment: [this.vendorProposal.vp_comment],
        })
    }

    onChangePay() {
        const controls = this.vpForm.controls
        this.codeService
            .getBy({code_fldname: "vd_cr_terms",  code_value: controls.vp_pay_meth.value})
            .subscribe((response: any) => {
                console.log(response.data)
                if (response.data.length == 0) {
                    alert("Methode nexiste pas")
                    controls.vp_pay_meth.setValue("")
                    console.log(response.data.length)
                    document.getElementById("paymeth").focus();
                } 
                else {
                    controls.dec01.setValue(response.data[0].dec01)
                    
                }
            })
    }

    //reste form
    reset() {
        this.vendorProposal = new VendorProposal()
        this.createForm()
        this.hasFormErrors = false
    }
    // save data
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.vpForm.controls
        /** check form */
        if (this.vpForm.invalid) {
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
        // tslint:disable-next-line:prefer-const
        let req = this.prepareReq()
        for (let data of this.dataset) {
            delete data.id
            delete data.cmvid
            delete data.desc
        }
        this.addVp(req, this.dataset)
    }

    onChangeVend() {
        const controls = this.vpForm.controls; // chof le champs hada wesh men form rah
        const vd_addr = controls.vp_vend.value;
        const date = new Date()
  
        this.date = controls.vp_q_date.value
        ? `${controls.vp_q_date.value.year}/${controls.vp_q_date.value.month}/${controls.vp_q_date.value.day}`
        : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  
  
        this.providersService.getBy({ vd_addr }).subscribe(
          (res: any) => {
            console.log(res);
            const { data } = res;
    
            if (!data) {
              this.layoutUtilsService.showActionNotification(
                "ce fournisseur n'existe pas!",
                MessageType.Create,
                10000,
                true,
                true
              );
              this.error = true;
            } else {
              this.error = false;
              controls.vp_vend.setValue(data.vd_addr || "");
              controls.vp_curr.setValue(data.vd_curr || "");
            
             
              this.deviseService.getBy({cu_curr:data.vd_curr}).subscribe((resc:any)=>{  
                this.curr = resc.data
             })
              if (data.vd_curr == 'DA'){
                controls.vp_ex_rate.setValue(1)
                controls.vp_ex_rate2.setValue(1)
  
              } else {
  
              this.deviseService.getExRate({exr_curr1:data.vd_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
                
                 controls.vp_ex_rate.setValue(res.data.exr_rate)
                 controls.vp_ex_rate2.setValue(res.data.exr_rate2)
                })
  
                }
  
            }
             
          },
          (error) => console.log(error)
        );
      }
    /**
     *
     * Returns object for saving
     */
    prepareReq(): any {
        const controls = this.vpForm.controls
        const _vp = new VendorProposal()
        _vp.vp_rqm_nbr = controls.vp_rqm_nbr.value
        _vp.vp_nbr = controls.vp_nbr.value
        _vp.vp_vend = controls.vp_vend.value
        _vp.vp_date = controls.vp_date.value
            ? `${controls.vp_date.value.year}/${controls.vp_date.value.month}/${controls.vp_date.value.day}`
            : null
        _vp.vp_q_date = controls.vp_q_date.value
            ? `${controls.vp_q_date.value.year}/${controls.vp_q_date.value.month}/${controls.vp_q_date.value.day}`
            : null
        _vp.vp_pay_meth = controls.vp_pay_meth.value
        _vp.vp_vend_lead = controls.vp_vend_lead.value
        _vp.vp_comment = controls.vp_comment.value
        _vp.vp_total_price = round(this.total *  Number(controls.vp_ex_rate2.value) / Number(controls.vp_ex_rate.value),2)
        _vp.vp_curr = controls.vp_curr.value
        _vp.vp_ex_rate = controls.vp_ex_rate.value
        _vp.vp_ex_rate2 = controls.vp_ex_rate2.value
        _vp.dec01 = controls.dec01.value
        return _vp
    }
    /**
     * Add req
     *
     * @param _vp: req
     */
    addVp(_vp: any, detail: any) {
        this.loadingSubject.next(true)
        this.vendorProposalService
            .add({ vendorProposal: _vp, vendorProposalDetail: detail })
            .subscribe(
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

    changeCurr(){
        const controls = this.vpForm.controls // chof le champs hada wesh men form rah
        const cu_curr  = controls.vp_curr.value
    
        const date = new Date()
    
        this.date = controls.vp_q_date.value
          ? `${controls.vp_q_date.value.year}/${controls.vp_q_date.value.month}/${controls.vp_q_date.value.day}`
          : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    
         
        this.deviseService.getBy({cu_curr}).subscribe((res:any)=>{
            const {data} = res
            console.log(res)
            if (!data){ this.layoutUtilsService.showActionNotification(
                "cette devise n'existe pas!",
                MessageType.Create,
                10000,
                true,
                true
            )
        this.error = true}
            else {
              this.curr = res.data
                this.error = false;
         
                if (cu_curr == 'DA'){
                  controls.vp_ex_rate.setValue(1)
                  controls.vp_ex_rate2.setValue(1)
    
                } else {
    
                this.deviseService.getExRate({exr_curr1:cu_curr, exr_curr2:'DA', date: this.date /* `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`*/ }).subscribe((res:any)=>{
                   controls.vp_ex_rate.setValue(res.data.exr_rate)
                   controls.vp_ex_rate2.setValue(res.data.exr_rate2)
                  })
         
                  }
                 
         
            }
    
    
        },error=>console.log(error))
    }

    changeRateCurr(){
        const controls = this.vpForm.controls // chof le champs hada wesh men form rah
        const cu_curr  = controls.vp_curr.value
      
        const date = new Date()
      
        this.date = controls.vp_q_date.value
          ? `${controls.vp_q_date.value.year}/${controls.vp_q_date.value.month}/${controls.vp_q_date.value.day}`
          : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      
          if (cu_curr == 'DA'){
            controls.vp_ex_rate.setValue(1)
            controls.vp_ex_rate2.setValue(1)
      
          } else {
                this.deviseService.getExRate({exr_curr1:cu_curr, exr_curr2:'DA', date: this.date /* `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`*/ }).subscribe((res:any)=>{
                  
      
                   controls.vp_ex_rate.setValue(res.data.exr_rate)
                   controls.vp_ex_rate2.setValue(res.data.exr_rate2)
                  })
         
          }
                 
                
        
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
        this.gridService.addItem(
            {
                id: this.dataset.length + 1,
                vpd_line: this.dataset.length + 1,
                vpd_part: "",
                cmvid: "",
                vpd_vend_part: "",
                vpd_q_qty: 0,
                vpd_um: "",
                vpd_q_price: "",
                vpd_mfgr_part: "",
            },
            { position: "bottom" }
        )
    }

    handleSelectedRowsChanged2(e, args) {
        const controls = this.vpForm.controls;
        if (Array.isArray(args.rows) && this.gridObj2) {
          args.rows.map((idx) => {
            const item = this.gridObj2.getDataItem(idx);
            console.log(item)
            const date = new Date()
    
            this.date = controls.vp_q_date.value
            ? `${controls.vp_q_date.value.year}/${controls.vp_q_date.value.month}/${controls.vp_q_date.value.day}`
            : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      
    
            controls.vp_vend.setValue(item.vd_addr || "");
            controls.vp_curr.setValue(item.vd_curr || "");
           
            this.deviseService.getBy({cu_curr:item.vd_curr}).subscribe((res:any)=>{  
              this.curr = res.data
           })
     
           
            if (item.vd_curr == 'DA'){
              controls.vp_ex_rate.setValue(1)
              controls.vp_ex_rate2.setValue(1)
    
            } else {
             
              this.deviseService.getExRate({exr_curr1:item.vd_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{  
               controls.vp_ex_rate.setValue(res.data.exr_rate)
               controls.vp_ex_rate2.setValue(res.data.exr_rate2)
              
            })
                }
    
    
          });
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
                field: "address.ad_name",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "ad_phone",
                name: "Numero telephone",
                field: "address.ad_phone",
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

        // fill the dataset with your data
        this.providersService
            .getAll()
            .subscribe((response: any) => (this.providers = response.data))
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
                updateItem.vpd_part = item.pt_part
                updateItem.vpd_um = item.pt_um
                this.gridService.updateItem(updateItem)
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
    onChange() {
        const controls = this.vpForm.controls
        const rqm_nbr = controls.vp_rqm_nbr.value
        this.requisitonService.findBy({ rqm_nbr }).subscribe(
            (res: any) => {
                const { requisition, details } = res.data
                controls.vp_vend.setValue(requisition.vp_vend) 
                details.map((value) => {
                    this.gridService.addItem(
                        {
                            id: this.dataset.length + 1,
                            vpd_line: this.dataset.length + 1,
                            vpd_part: value.rqd_part,
                            cmvid: "",
                            vpd_vend_part: "",
                            vpd_q_qty: value.rqd_req_qty,
                            vpd_um: value.rqd_um,
                            vpd_q_price: "",
                            vpd_mfgr_part: "",
                        },
                        { position: "bottom" }
                    )
                })
            },
            (error) => {
                this.message = `Demande avec ce numero ${rqm_nbr} n'existe pas`
                this.hasFormErrors = true
            },
            () => {}
        )
    }

   

    handleSelectedRowsChanged5(e, args) {
        const controls = this.vpForm.controls;
        if (Array.isArray(args.rows) && this.gridObj5) {
          args.rows.map((idx) => {
            const item = this.gridObj5.getDataItem(idx);
            controls.vp_rqm_nbr.setValue(item.rqm_nbr || "");
            const rqm_nbr = item.rqm_nbr
            this.requisitonService.findBy({ rqm_nbr }).subscribe(
                (res: any) => {
                    const { requisition, details } = res.data
                    controls.vp_vend.setValue(requisition.rqm_vend) 
                    details.map((value) => {
                        this.gridService.addItem(
                            {
                                id: this.dataset.length + 1,
                                vpd_line: this.dataset.length + 1,
                                vpd_part: value.rqd_part,
                                cmvid: "",
                                vpd_vend_part: "",
                                vpd_q_qty: value.rqd_req_qty,
                                vpd_um: value.rqd_um,
                                vpd_q_price: "",
                                vpd_mfgr_part: "",
                            },
                            { position: "bottom" }
                        )
                    })
                },
                (error) => {
                    this.message = `Demande avec ce numero ${rqm_nbr} n'existe pas`
                    this.hasFormErrors = true
                },
                () => {}
            )
          });

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
        };
    
        // fill the dataset with your data
        this.requisitionService
          .getByAll({ rqm_aprv_stat: "3", rqm_open: true })
          .subscribe((response: any) => (this.requisitions = response.data));
      }
      open5(content) {
        this.prepareGrid5();
        this.modalService.open(content, { size: "lg" });
      }

      handleSelectedRowsChangedcurr(e, args) {
        const controls = this.vpForm.controls;
        if (Array.isArray(args.rows) && this.gridObjcurr) {
          args.rows.map((idx) => {
            const item = this.gridObjcurr.getDataItem(idx);
            controls.vp_curr.setValue(item.cu_curr || "");
            if(item.cu_curr != 'DA'){
              const date = new Date()
              this.date = controls.vp_q_date.value
              ? `${controls.vp_q_date.value.year}/${controls.vp_q_date.value.month}/${controls.vp_q_date.value.day}`
              : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
              if (item.cu_curr == 'DA'){
                controls.vp_ex_rate.setValue(1)
                controls.vp_ex_rate2.setValue(1)
    
              } else {
              this.deviseService.getExRate({exr_curr1:item.cu_curr,exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
                
                 controls.vp_ex_rate.setValue(res.data.exr_rate)
                 controls.vp_ex_rate2.setValue(res.data.exr_rate2)
                
              })
            }
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
    }
