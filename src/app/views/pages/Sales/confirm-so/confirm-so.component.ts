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
    SaleOrder,
    SaleOrderService,
    CustomerService,
    UsersService,
    AddressService,
    ItemService,
    ProjectService,
    ConfigService,
} from "../../../../core/erp"

@Component({
  selector: 'kt-confirm-so',
  templateUrl: './confirm-so.component.html',
  styleUrls: ['./confirm-so.component.scss']
})
export class ConfirmSoComponent implements OnInit {

  
  saleOrder: SaleOrder
  soForm: FormGroup
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

  sos: []
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
  soServer
 customer: any
  res : any
  user;
  constructor(
      config: NgbDropdownConfig,
      private soFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private modalService: NgbModal,
      private layoutUtilsService: LayoutUtilsService,
      private saleOrderService: SaleOrderService,
      private customersService: CustomerService,
      private userService: UsersService,
      private addressService: AddressService,
      private configService: ConfigService,
      private projectService: ProjectService,
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
              id: "sod_line",
              name: "Ligne",
              field: "sod_line",
              minWidth: 50,
              maxWidth: 50,
              selectable: true,
          },
          {
              id: "sod_part",
              name: "Article",
              field: "sod_part",
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
              id: "sod_qty_ord",
              name: "QTE",
              field: "sod_qty_ord",
              sortable: true,
              width: 80,
              filterable: false,
              type: FieldType.float,
          },
          {
              id: "sod_um",
              name: "UM",
              field: "sod_um",
              sortable: true,
              width: 80,
              filterable: false,
          },
          {
            id: "sod_price",
            name: "Prix UN",
            field: "sod_price",
            sortable: true,
            width: 80,
            filterable: false,
            type: FieldType.float,
        },
        
          {
              id: "sod_cc",
              name: "Centre de cout",
              field: "sod_cc",
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
      this.saleOrder = new SaleOrder()
      
      this.soForm = this.soFB.group({
          so_nbr: [this.saleOrder.so_nbr],
          so_cust: [{ value: this.saleOrder.so_cust, disabled: true }],
          name: [{value: '', disabled: true}],
          so_ord_date: [
              { value: this.saleOrder.so_ord_date, disabled: true },
          ],
          so_conf: [ this.saleOrder.so_conf ],
         
         
          
      })
  }
  //reste form
  reset() {
      this.saleOrder = new SaleOrder()
      this.createForm()
      this.hasFormErrors = false
  }
  // save data
  onSubmit() {
      this.hasFormErrors = false
      const controls = this.soForm.controls
      /** check form */
      if (this.soForm.invalid) {
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
      var stat = true;
      if (controls.so_conf.value == false) { stat = false} 
      this.saleOrderService
          .update(this.soServer.id, { so_conf: stat,  so__chr02: this.user.usrd_user_name } )
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
              if (stat) {
                  let idd = 1
                this.configService.getOne( 1 ).subscribe(
                  (resp: any) => {
                    console.log(resp.data)
                    if (resp.data.cfg_pm_module) { 
                          this.projectService.getBy({ pm_code: this.soServer.so_po }).subscribe(
                            (res: any) => {
                                var id = res.data.project.id


                                this.projectService
                                .updateM({ pm_status: "R",  }, id)
                                .subscribe( //(res) => {
                      
                                
                              )
                                
                            })

                            this.layoutUtilsService.showActionNotification(
                                "Modification Status avec succès",
                                MessageType.Create,
                                10000,
                                true,
                                true
                            )
                            this.loadingSubject.next(false)
                            this.router.navigateByUrl("/sales/confirm-so")
                    }
                    else {
                      this.layoutUtilsService.showActionNotification(
                        "Modification Status avec succès",
                        MessageType.Create,
                        10000,
                        true,
                        true
                    )
                    this.loadingSubject.next(false)
                    this.router.navigateByUrl("/sales/confirm-so")

                    }
                })
                  }

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
      const controls = this.soForm.controls
      const so_nbr = controls.so_nbr.value
      this.saleOrderService.getBy({ so_nbr }).subscribe(
          (res: any) => {
              const { saleOrder, details } = res.data
              this.soServer = saleOrder
              this.dataset = details
              const ad_addr = this.soServer.so_cust;
              console.log(ad_addr)
              this.addressService.getBy({ad_addr: ad_addr}).subscribe((response: any)=>{
                          
                          
                    this.customer = response.data
          
                    controls.name.setValue(this.customer.ad_name);
                
                    controls.so_cust.setValue(saleOrder.so_cust)
                    const date = new Date(saleOrder.so_ord_date)
                    date.setDate(date.getDate() )

                    controls.so_ord_date.setValue({
                        year: date.getFullYear(),
                        month: date.getMonth() + 1,
                        day: date.getDate(),
                    })
                  
                    controls.so_conf.setValue(saleOrder.so_conf)
                  
              })
            },
          
            (error) => {
              this.message = `BC avec ce numero ${so_nbr} n'existe pas`
              this.hasFormErrors = true
          },
          () => {}
      )
  }
  
  

  handleSelectedRowsChanged5(e, args) {
      const controls = this.soForm.controls
     
      if (Array.isArray(args.rows) && this.gridObj5) {
          args.rows.map((idx) => {
              const item = this.gridObj5.getDataItem(idx)
              
              
              controls.so_nbr.setValue(item.so.so_nbr || "")

              //const controls = this.soForm.controls
              const so_nbr = controls.so_nbr.value
              console.log(so_nbr)
              this.saleOrderService.getBy({ so_nbr }).subscribe(
                  (res: any) => {
                      const { saleOrder, details } = res.data
                      this.soServer = saleOrder
                      this.dataset = details
                      const ad_addr = this.soServer.so_cust;
                      console.log(ad_addr)
                      this.addressService.getBy({ad_addr: ad_addr}).subscribe((response: any)=>{
                                  
                                  
                            this.customer = response.data
                  
                            controls.name.setValue(this.customer.ad_name);
                      
                      controls.so_cust.setValue(saleOrder.so_cust)
                    
                    const date = new Date(saleOrder.so_ord_date)
                      date.setDate(date.getDate() )

                    controls.so_ord_date.setValue({
                        year: date.getFullYear(),
                        month: date.getMonth() + 1,
                        day: date.getDate(),
                    })
                  
                      controls.so_conf.setValue(saleOrder.so_conf)
                     
                    })
                  },
                  (error) => {
                      this.message = `BC avec ce numero ${so_nbr} n'existe pas`
                      this.hasFormErrors = true
                  },
                  () => {}
              )





//                controls.so_rqby_userid.setValue(item.so_rqby_userid || "")
//              controls.so_category.setValue(item.so_category || "")

  //            controls.so_ord_date.setValue({
   //               year: new Date(item.so_ord_date).getFullYear(),
    //              month: new Date(item.so_ord_date).getMonth() + 1,
    //             day: new Date(item.so_ord_date).getDate(),
     //        }|| "")
      //        controls.so_need_date.setValue({
      //            year: new Date(item.so_need_date).getFullYear(),
       //           month: new Date(item.so_need_date).getMonth() + 1,
       //           day: new Date(item.so_need_date).getDate(),
        //      }|| "")
              
       //       controls.so_reason.setValue(item.so_reason || "")
        //      controls.so_confus.setValue(item.so_confus || "")
         //     controls.so_rmks.setValue(item.so_rmks || "")
          



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
        id: "so_nbr",
        name: "N° BC",
        field: "so.so_nbr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "so_ord_date",
        name: "Date",
        field: "so.so_ord_date",
        sortable: true,
        filterable: true,
        type: FieldType.date,
      },
      {
        id: "so_cust",
        name: "Fournisseur",
        field: "so.so_cust",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "so_conf",
        name: "status",
        field: "so.so_conf",
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
    this.saleOrderService
      .getAll()
      .subscribe((response: any) => {
        console.log(response.data)
        this.sos = response.data });
      
      
      
    }
  open5(content) {
    this.prepareGrid5();
    this.modalService.open(content, { size: "lg" });
  }
  
  


}
