// Angular
import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  GridService,
  FieldType,
  Formatters,
  OnEventArgs,
} from "angular-slickgrid";
import { BehaviorSubject, Observable } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { BomPartService,BomPart, BomService,ItemService } from "../../../../core/erp";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
@Component({
  selector: 'kt-affect-bom',
  templateUrl: './affect-bom.component.html',
  styleUrls: ['./affect-bom.component.scss']
})
export class AffectBomComponent implements OnInit {

  bomForm: FormGroup;
  row_number;

  isExist = false

  boms: []
  columnDefinitions4: Column[] = []
  gridOptions4: GridOption = {}
  gridObj4: any
  angularGrid4: AngularGridInstance
  
  items: []
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  gridObj: any
  angularGrid: AngularGridInstance
  
  sc: [];
  detail : any;
  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];
  bomPart: BomPart;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;

  constructor(
    config: NgbDropdownConfig,
    private bomFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private bomService: BomService,
    private bomPartService: BomPartService,
    private itemService: ItemService
  ) {
    config.autoClose = true;
  }

  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.createForm();
    this.initmvGrid();
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.bomPart = new BomPart();
    this.bomForm = this.bomFB.group({
      ptb_part: [this.bomPart.ptb_part, Validators.required],
      desc: [{ value: "", disabled: true },  Validators.required],
      um: [{ value: "", disabled: true }],
      
    });
  }


  onChangeCode() {
    const controls = this.bomForm.controls
    this.itemService
        .getByOne({
              pt_part: controls.ptb_part.value
        })
        .subscribe((response: any) => {
          console.log(response.data)
            if (response.data ) {
               
                console.log(response.data.length)
                controls.desc.setValue(response.data.pt_desc1);
                controls.um.setValue(response.data.pt_um);

            } else {
              alert("Article n'existe pas  ")
              controls.ptb_part.setValue(null);
              document.getElementById("part").focus(); 
            }
     })
  }
  //reste form
  reset() {
    this.bomPart = new BomPart();
    this.createForm();
    this.mvdataset = [];
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.bomForm.controls;
    /** check form */
    if (this.bomForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    // tslint:disable-next-line:prefer-const
    let bompart = this.preparebompart();
    for (let data of this.mvdataset) {
      delete data.id;
      delete data.cmvid;
    }
    this.addbompart(bompart, this.mvdataset);
  }
  /**
   * Returns object for saving
   */
  preparebompart(): BomPart {
    const controls = this.bomForm.controls;
    const _bompart = new BomPart();
    _bompart.ptb_part = controls.ptb_part.value;
    console.log(_bompart);
    return _bompart;
  }
  /**
   * Add code
   *
   * @param _bompart: InventoryStatusModel
   */
  addbompart(_bompart: BomPart, details: any) {
    this.loadingSubject.next(true);
    this.bomPartService
      .add({ BomPart: _bompart, Details: details })
      .subscribe(
        (reponse) => console.log("response", Response),
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
          this.reset()
          this.router.navigateByUrl("/manufacturing/affect-bom");
        }
      );
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
  initmvGrid() {
    this.mvcolumnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.mvangularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      },
      {
        id: "ptb_bom",
        name: "Code Nomenclature",
        field: "ptb_bom",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
        editor: {
          model: Editors.text,
        },

        onCellChange: (e: Event, args: OnEventArgs) => {
          
          this.bomService.getBy({bom_parent: args.dataContext.ptb_bom }).subscribe((resp:any)=>{

            console.log(resp.data)
            if (resp.data) {
             
               
                 this.mvgridService.updateItemById(args.dataContext.id,{...args.dataContext ,  ptb_bom: resp.data.bom_parent , bom_desc: resp.data.bom_desc, bom_batch: resp.data.bom_batch, bom_batch_um: resp.data.bom_batch_um })
               
            } else {

                      alert("Code Nomenclature N' existe pas")
                      this.mvgridService.updateItemById(args.dataContext.id,{...args.dataContext , ptb_bom: null, bom_desc: null, bom_batch: null, bom_batch_um: null })
              
            } 
          })
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
            "openBomsGrid"
          ) as HTMLElement;
          element.click();
        },
      },
      {
        id: "bom_desc",
        name: "Description",
        field: "bom_desc",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        
      },
      {
        id: "bom_batch",
        name: "Lot",
        field: "bom_batch",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        
      },
      {
        id: "bom_batch_um",
        name: "UM Lot",
        field: "bom_batch_um",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        
      },

    ];

    this.mvgridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
    };

    this.mvdataset = [];
  }
  addNewItem() {
    const newId = this.mvdataset.length+1;

    const newItem = {
      id: newId,
      ptb_bom: "",
      bom_desc: "",
      bom_batch:"",
      bom_batch_um: "",
      cmvid: "",
    };
    this.mvgridService.addItem(newItem, { position: "bottom" });
  }

  handleSelectedRowsChanged4(e, args) {
    let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        console.log(item);
        updateItem.ptb_bom = item.bom_parent;
        updateItem.bom_desc = item.bom_desc;
        updateItem.bom_batch = item.bom_batch;
        updateItem.bom_batch_um = item.bom_batch_um;
        
        this.mvgridService.updateItem(updateItem);
      });
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
          id: "bom_parent",
          name: "Code Nomenclature",
          field: "bom_parent",
          sortable: true,
          width: 50,
          filterable: false,
          type: FieldType.float,
          editor: {
            model: Editors.text,
          },
        },
        {
          id: "bom_desc",
          name: "Description",
          field: "bom_desc",
          sortable: true,
          width: 80,
          filterable: false,
          type: FieldType.float,
          
        },
        {
          id: "bom_batch",
          name: "Lot",
          field: "bom_batch",
          sortable: true,
          width: 80,
          filterable: false,
          type: FieldType.float,
          
        },
        {
          id: "bom_batch_um",
          name: "UM Lot",
          field: "bom_batch_um",
          sortable: true,
          width: 80,
          filterable: false,
          type: FieldType.float,
          
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
    this.bomService
        .getAll()
        .subscribe((response: any) => (this.boms = response.data))
}
open4(content) {
   
    this.prepareGrid4()
    this.modalService.open(content, { size: "lg" })
}



handleSelectedRowsChanged(e, args) {
  const controls = this.bomForm.controls; 
  //let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj) {
    args.rows.map((idx) => {
      const item = this.gridObj.getDataItem(idx);
   
      controls.ptb_part.setValue(item.pt_part || ""); 
      controls.desc.setValue(item.pt_desc1 || ""); 
      controls.um.setValue(item.pt_um || ""); 
      this.bomPartService.getBy( {ptb_part: item.pt_part} ).subscribe(
        (res: any) => {
          //console.log(res.data)
          this.detail  = res.data;
         
        console.log(this.detail)
          
          let i = 1;
          for (let object of this.detail) {
            this.bomService.getBy( {bom_parent:  object.ptb_bom} ).subscribe(
              (resp: any) => {
        
                console.log(object.ptb_bom)

            this.mvgridService.addItem(
                  {
                    id: i,
                    ptb_bom: object.ptb_bom,
                    bom_desc: resp.data.bom_desc,
                    bom_batch: resp.data.bom_batch,
                    bom_batch_um: resp.data.bom_batch_um,
                    
                  },
                  { position: "bottom" }
                );
                i = i + 1;
              })
          }          
        }) 
  });
}
}

angularGridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
  this.gridObj = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGrid() {
  this.columnDefinitions = [
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
  ];

  this.gridOptions = {
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
  this.itemService
    .getAll()
    .subscribe((response: any) => (this.items = response.data));
}
open(content) {
  this.prepareGrid();
  this.modalService.open(content, { size: "lg" });
}

onAlertClose($event) {
  this.hasFormErrors = false
}
}
