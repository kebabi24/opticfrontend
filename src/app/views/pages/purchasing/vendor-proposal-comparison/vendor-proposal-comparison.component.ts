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
    VendorProposal,
    RequisitionService,
    SequenceService,
    ProviderService,
    UsersService,
    ItemService,
    VendorProposalService,
    CodeService,
} from "../../../../core/erp"
@Component({
  selector: 'kt-vendor-proposal-comparison',
  templateUrl: './vendor-proposal-comparison.component.html',
  styleUrls: ['./vendor-proposal-comparison.component.scss']
})
export class VendorProposalComparisonComponent implements OnInit {

     vpForm: FormGroup

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

    message;
    
    requisitions: [];
    columnDefinitions5: Column[] = [];
    gridOptions5: GridOption = {};
    gridObj5: any;
    angularGrid5: AngularGridInstance;

    constructor(
        config: NgbDropdownConfig,
        private reqFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private modalService: NgbModal,
        private layoutUtilsService: LayoutUtilsService,
        private requisitonService: RequisitionService,
        private vendorProposalService: VendorProposalService,
        private providersService: ProviderService,
        private userService: UsersService,
        private seqeuncesService: SequenceService,
        private itemsService: ItemService,
        private codeService: CodeService
    ) {
        config.autoClose = true
        this.initGrid()
        this.vpForm = reqFB.group({
          vp_rqm_nbr:['']
        })
        
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
                formatter: Formatters.infoIcon,
                minWidth: 30,
                maxWidth: 30,
                onCellClick : (e:Event, args: OnEventArgs) => {
                    this.router.navigateByUrl(`purchasing/create-po/${args.dataContext.id}`)
                }
                
            },

            {
                id: "vp_nbr",
                name: "Devis",
                field: "vp_nbr",
                minWidth: 80,
                maxWidth: 80,
                selectable: true,
            },
            {
                id: "vp_vend",
                name: "Fournisseur",
                field: "vp_vend",
                sortable: true,
                width: 50,
                filterable: false,
                
            },

            {
                id: "vp_vend_lead",
                name: "Delai de livraison",
                field: "vp_vend_lead",
                sortable: true,
                width: 80,
                filterable: false,
                
            },
            {
                id: "vp_pay_meth",
                name: "Methode de paiment ",
                field: "vp_pay_meth",
                sortable: true,
                width: 80,
                filterable: false,
                type: FieldType.float,
                
            },
            {
              id: "dec01",
              name: "Delai de paiement ",
              field: "dec01",
              sortable: true,
              width: 80,
              filterable: false,
              type: FieldType.float,
              
          },
            {
              id: "vp_total_price",
              name: "Prix total ",
              field: "vp_total_price",
              sortable: true,
              width: 80,
              filterable: false,
              type: FieldType.float,
              
          },
        ]

        this.gridOptions = {
            asyncEditorLoading: false,
            editable: true,
            enableColumnPicker: true,
            enableCellNavigation: true,
            enableSorting: true,
           
            enableRowSelection: true,
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

        this.dataset = []
    }
    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
    }

   
    //reste form
    reset() {
        this.hasFormErrors = false
    }

    goBack() {
        this.loadingSubject.next(false)
        const url = `/`
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
    }

   

    onChange() {
        const controls = this.vpForm.controls
        const vp_rqm_nbr = controls.vp_rqm_nbr.value
        this.vendorProposalService.findBy({ vp_rqm_nbr }).subscribe(
            (res: any) => {
                this.dataset = res.data
            },
            (error) => {
                this.message = `Demande avec ce numero ${vp_rqm_nbr} n'existe pas`
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
            const vp_rqm_nbr = item.rqm_nbr
            this.vendorProposalService.findBy({ vp_rqm_nbr }).subscribe(
                (res: any) => {
                    this.dataset = res.data
                },
                (error) => {
                    this.message = `Demande avec ce numero ${vp_rqm_nbr} n'existe pas`
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
        this.requisitonService
          .getByAll({ rqm_aprv_stat: "3", rqm_open: true })
          .subscribe((response: any) => (this.requisitions = response.data));
      }
      open5(content) {
        this.prepareGrid5();
        this.modalService.open(content, { size: "lg" });
      }

}
