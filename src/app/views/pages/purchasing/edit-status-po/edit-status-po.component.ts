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
    PurchaseOrder,
    PurchaseOrderService,
    ProviderService,
    UsersService,
    AddressService,
    ItemService,
} from "../../../../core/erp"

@Component({
  selector: 'kt-edit-status-po',
  templateUrl: './edit-status-po.component.html',
  styleUrls: ['./edit-status-po.component.scss']
})
export class EditStatusPoComponent implements OnInit {

  purchaseOrder: PurchaseOrder
  poForm: FormGroup
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

  pos: []
  columnDefinitions5: Column[] = []
  gridOptions5: GridOption = {}
  gridObj5: any
  angularGrid5: AngularGridInstance

  items: []
  columnDefinitions4: Column[] = []
  gridOptions4: GridOption = {}
  gridObj4: any
  angularGrid4: AngularGridInstance

  row_number
  message = ""
  poServer
 provider: any
  res : any
  user;
  constructor(
      config: NgbDropdownConfig,
      private poFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private modalService: NgbModal,
      private layoutUtilsService: LayoutUtilsService,
      private purchaseOrderService: PurchaseOrderService,
      private providersService: ProviderService,
      private userService: UsersService,
      private addressService: AddressService,
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
              id: "pod_line",
              name: "Ligne",
              field: "pod_line",
              minWidth: 50,
              maxWidth: 50,
              selectable: true,
          },
          {
              id: "pod_part",
              name: "Article",
              field: "pod_part",
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
              id: "pod_qty_ord",
              name: "QTE",
              field: "pod_qty_ord",
              sortable: true,
              width: 80,
              filterable: false,
              type: FieldType.float,
          },
          {
              id: "pod_um",
              name: "UM",
              field: "pod_um",
              sortable: true,
              width: 80,
              filterable: false,
          },
          {
            id: "pod_price",
            name: "Prix UN",
            field: "pod_price",
            sortable: true,
            width: 80,
            filterable: false,
            type: FieldType.float,
        },
        
          {
              id: "pod_cc",
              name: "Centre de cout",
              field: "pod_cc",
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
      this.purchaseOrder = new PurchaseOrder()
      
      this.poForm = this.poFB.group({
          po_nbr: [this.purchaseOrder.po_nbr],
          po_vend: [{ value: this.purchaseOrder.po_vend, disabled: true }],
          name: [{value: '', disabled: true}],
          po_ord_date: [
              { value: this.purchaseOrder.po_ord_date, disabled: true },
          ],
          po_stat: [
              { value: this.purchaseOrder.po_stat },
          ],
          po_rmks: [{ value: this.purchaseOrder.po_rmks, disabled: true }],
          
      })
  }
  //reste form
  reset() {
      this.purchaseOrder = new PurchaseOrder()
      this.createForm()
      this.hasFormErrors = false
  }
  // save data
  onSubmit() {
      this.hasFormErrors = false
      const controls = this.poForm.controls
      /** check form */
      if (this.poForm.invalid) {
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
      this.purchaseOrderService
          .update({ po_stat: controls.po_stat.value }, this.poServer.id)
          .subscribe( //(res) => {

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
                    "Modification Status avec succès",
                    MessageType.Create,
                    10000,
                    true,
                    true
                )
                this.loadingSubject.next(false)
                this.router.navigateByUrl("/purchasing/edit-status-po")
              
            }
        )


            //  const url = `/`
              //this.router.navigateByUrl(url, {
                //  relativeTo: this.activatedRoute,
              //})
         // })
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

  
  onAlertClose($event) {
      this.hasFormErrors = false
  }

  onChangePoNbr() {
      const controls = this.poForm.controls
      const po_nbr = controls.po_nbr.value
      this.purchaseOrderService.findBy({ po_nbr }).subscribe(
          (res: any) => {
              const { purchaseOrder, details } = res.data
              this.poServer = purchaseOrder
              this.dataset = details
              const ad_addr = this.poServer.po_vend;
              console.log(ad_addr)
              this.addressService.getBy({ad_addr: ad_addr}).subscribe((response: any)=>{
                          
                          
                    this.provider = response.data
          
                    controls.name.setValue(this.provider.ad_name);
                
                    controls.po_vend.setValue(purchaseOrder.po_vend)
                    const date = new Date(purchaseOrder.po_ord_date)
                    date.setDate(date.getDate() )

                    controls.po_ord_date.setValue({
                        year: date.getFullYear(),
                        month: date.getMonth() ,
                        day: date.getDate(),
                    })
                  
                    controls.po_stat.setValue(purchaseOrder.po_stat)
                    controls.po_rmks.setValue(purchaseOrder.po_rmks)
              })
            },
          
            (error) => {
              this.message = `BC avec ce numero ${po_nbr} n'existe pas`
              this.hasFormErrors = true
          },
          () => {}
      )
  }
  
  

  handleSelectedRowsChanged5(e, args) {
      const controls = this.poForm.controls
     
      if (Array.isArray(args.rows) && this.gridObj5) {
          args.rows.map((idx) => {
              const item = this.gridObj5.getDataItem(idx)
              
              
              controls.po_nbr.setValue(item.po.po_nbr || "")

              //const controls = this.poForm.controls
              const po_nbr = controls.po_nbr.value
              console.log(po_nbr)
              this.purchaseOrderService.findBy({ po_nbr }).subscribe(
                  (res: any) => {
                      const { purchaseOrder, details } = res.data
                      this.poServer = purchaseOrder
                      this.dataset = details
                      const ad_addr = this.poServer.po_vend;
                      console.log(ad_addr)
                      this.addressService.getBy({ad_addr: ad_addr}).subscribe((response: any)=>{
                                  
                                  
                            this.provider = response.data
                  
                            controls.name.setValue(this.provider.ad_name);
                      
                      controls.po_vend.setValue(purchaseOrder.po_vend)
                    
                    const date = new Date(purchaseOrder.po_ord_date)
                      date.setDate(date.getDate() )

                    controls.po_ord_date.setValue({
                        year: date.getFullYear(),
                        month: date.getMonth() + 1,
                        day: date.getDate(),
                    })
                  
                      controls.po_stat.setValue(purchaseOrder.po_stat)
                      controls.po_rmks.setValue(purchaseOrder.po_rmks)
                    })
                  },
                  (error) => {
                      this.message = `BC avec ce numero ${po_nbr} n'existe pas`
                      this.hasFormErrors = true
                  },
                  () => {}
              )





//                controls.po_rqby_userid.setValue(item.po_rqby_userid || "")
//              controls.po_category.setValue(item.po_category || "")

  //            controls.po_ord_date.setValue({
   //               year: new Date(item.po_ord_date).getFullYear(),
    //              month: new Date(item.po_ord_date).getMonth() + 1,
    //             day: new Date(item.po_ord_date).getDate(),
     //        }|| "")
      //        controls.po_need_date.setValue({
      //            year: new Date(item.po_need_date).getFullYear(),
       //           month: new Date(item.po_need_date).getMonth() + 1,
       //           day: new Date(item.po_need_date).getDate(),
        //      }|| "")
              
       //       controls.po_reason.setValue(item.po_reason || "")
        //      controls.po_status.setValue(item.po_status || "")
         //     controls.po_rmks.setValue(item.po_rmks || "")
          



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
        id: "po_nbr",
        name: "N° BC",
        field: "po.po_nbr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "po_ord_date",
        name: "Date",
        field: "po.po_ord_date",
        sortable: true,
        filterable: true,
        type: FieldType.date,
      },
      {
        id: "po_vend",
        name: "Fournisseur",
        field: "po.po_vend",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "po_stat",
        name: "status",
        field: "po_stat",
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
    this.purchaseOrderService
      .getAll()
      .subscribe((response: any) => {
        console.log(response.data)
        this.pos = response.data });
      
      
      
    }
  open5(content) {
    this.prepareGrid5();
    this.modalService.open(content, { size: "lg" });
  }
  
  


}
