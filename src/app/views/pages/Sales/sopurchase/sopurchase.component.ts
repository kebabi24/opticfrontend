import { Component, OnInit } from "@angular/core";
// Angular slickgrid
import {
  Formatter,
  Editor,
  Editors,
  OnEventArgs,
  AngularGridInstance,
  Aggregators,
  Column,
  DelimiterType,
  FieldType,
  FileType,
  Filters,
  Formatters,
  FlatpickrOption,
  GridOption,
  GridService,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
  ColumnFilter,
  Filter,
  FilterArguments,
  FilterCallback,
  MultipleSelectOption,
  OperatorType,
  OperatorString,
  SearchTerm,
} from "angular-slickgrid"
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { jsPDF } from "jspdf";
import "jspdf-barcode";
// Layout
import {
  SubheaderService,
  LayoutConfigService,
} from "../../../../core/_base/layout";
// CRUD
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";

import { SaleOrderService, ProviderService,CustomerService, VisiteService,GlassesService,
  ItemService,AccessoireService,PurchaseOrderService } from "../../../../core/erp";
const defaultPageSize = 100;

@Component({
  selector: 'kt-sopurchase',
  templateUrl: './sopurchase.component.html',
  styleUrls: ['./sopurchase.component.scss']
})
export class SopurchaseComponent implements OnInit {

  loadingSubject = new BehaviorSubject<boolean>(true);
  soForm: FormGroup;
// slick grid
selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  details: any [];
datasetgls: any[];
datasetacs: any[];
datasetmnt: any[];
soEdit: any;
customer: any;
visit: any;
provider;
hasFormErrors = false;
loading$: Observable<boolean>;
error = false;
providers: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;
  message = "";

constructor(
  private activatedRoute: ActivatedRoute,
  private router: Router,
  public dialog: MatDialog,
  private soFB: FormBuilder,
  private layoutUtilsService: LayoutUtilsService,
  private soService: SaleOrderService,
  private customerService: CustomerService,
  private visiteService: VisiteService,
  private glassesService: GlassesService,
  private itemService: ItemService,
  private purchaseOrderService: PurchaseOrderService,
  private accessoireService: AccessoireService,
  private providerService: ProviderService,
  private modalService: NgbModal,
    
  private saleOrderService: SaleOrderService,
) {
  this.prepareGrid();
  //this.solist();
}

ngOnInit(): void {
  this.createForm();
  this.prepareGrid();
  this.solist();

}
gridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
  this.dataView = angularGrid.dataView;
  this.grid = angularGrid.slickGrid;
  this.gridService = angularGrid.gridService;
}
createForm() {
  const date = new Date ;
  date.setDate(date.getDate() - 2);
  const date1 = new Date;
  this.soForm = this.soFB.group({
  
    date: [{
      year:date.getFullYear(),
      month: date.getMonth()+1,
      day: date.getDate() 
    }],
    date1: [{
      year:date1.getFullYear(),
      month: date1.getMonth()+1,
      day: date1.getDate()
    }],
    vend: [""],
  
  });

  
  

}

prepareGrid() {
  this.columnDefinitions = [
    
    {
      id: "id",
      name: "id",
      field: "id",
      resizable: false,
      sortable: false,
      minWidth: 50,
      maxWidth: 50
    },
    {
      id: "sodg_part",
      name: "Code Verre",
      field: "sodg_part",
      width: 50,
      selectable: true,
      filterable: true,
    },
    {
      id: "sodg_for",
      name: "Code Fournisseur",
      field: "sodg_for",
      width: 50,
      selectable: true,
      filterable: true,
         },
    {
      id: "sodg_desc",
      name: "Description",
      field: "sodg_desc",
      sortable: true,
      width: 50,
      filterable: true,
    },
    {
      id: "sodg_sph",
      name: "Sph",
      field: "sodg_sph",
      sortable: true,
      width: 50,
      filterable: true,
    },
    
    {
      id: "sodg_cyl",
      name: "Cyl",
      field: "sodg_cyl",
      sortable: true,
      width: 50,
      filterable: true,
    },
    {
      id: "sodg_add",
      name: "Add",
      field: "sodg_add",
      sortable: true,
      width: 50,
      filterable: true,
    },
    
    
    
    
    {
      id: "total_qty",
      name: "QTE",
      field: "total_qty",
      sortable: true,
      width: 50,
      filterable: true,
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
      type: FieldType.float,

    },
    
    
    
  ];

  this.gridOptions = {
    asyncEditorLoading: true,
      
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
    
  



    dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
      var val = undefined;
      try {
        val = eval("item." + column.field);
      } catch (e) {
        // ignore
      }
      return val;
    },


}

// fill the dataset with your data
this.dataset = []



//this.dataset = []
/*this.soService.getByAll({so_ord_date: date}).subscribe(
  
    (response: any) => (this.dataset = response.data),
    
    (error) => {
        this.dataset = []
    },
    () => {}
    
)
console.log(this.dataset)*/
  // fill the dataset with your data
}
onSubmit() {
  this.hasFormErrors = false;
  const controls = this.soForm.controls;
  /** check form */
  if (this.soForm.invalid) {
    Object.keys(controls).forEach((controlName) =>
      controls[controlName].markAsTouched()
    );
    this.message = "Modifiez quelques éléments et réessayez de soumettre.";
    this.hasFormErrors = true;

    return;
  }

  if (!this.dataset.length) {
    this.message = "La liste des article ne peut pas etre vide";
    this.hasFormErrors = true;

    return;
  }
  // tslint:disable-next-line:prefer-const
  var val = 0
  var array = [];
  var result = [];
  var array = this.dataset
  array.reduce(function(res, value) {
  //console.log('aaa',res[value.prod_line])
  if (!res[value.sodg_for]) {
    res[value.sodg_for] = { sodg_for: value.sodg_for, total_qty: 0 };
    result.push(res[value.sodg_for])
  }
  res[value.sodg_for].total_qty += value.total_qty;
  return res;
  }, {});
  console.log("array",result)
  //let po = this.preparePo();
  
  this.addPo( result,this.dataset);
}

addPo(pos: any, detail: any) {
  for (let data of detail) {
    delete data.id;
    delete data.cmvid;
  }
  this.loadingSubject.next(true);
  let po = null;
  const controls = this.soForm.controls;

  this.purchaseOrderService
    .addPos({ purchaseOrder: pos, purchaseOrderDetail: detail })
    .subscribe(
      (reponse: any) => (po = reponse.data),
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
        //console.log(this.provider, po, this.dataset);
        this.router.navigateByUrl("/purchasing/purchase-list");
      }
    );
}
reset() {
  this.createForm();
  this.dataset    = [];
 
  this.hasFormErrors = false;
}
goBack() {
  this.loadingSubject.next(false);
  const url = `/`;
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
}

solist(){
  const controls = this.soForm.controls
  console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
  this.dataset = []
  const date = controls.date.value
  ? `${controls.date.value.year}/${controls.date.value.month}/${controls.date.value.day}`
  : null;

  const date1 = controls.date1.value
  ? `${controls.date1.value.year}/${controls.date1.value.month}/${controls.date1.value.day}`
  : null;
  console.log(date)
  console.log(date1)
  const vend = controls.vend.value
  let obj= {date,date1,vend}
  this.soService.getGlsAll(obj).subscribe(
    (res: any) => {
  
    //(response: any) => (this.dataset = response.data),
    console.log(res.data)
    this.details  = res.data;
  for (var i = 0; i < this.details.length; i++) {
    console.log("hnahnahnahna",i)
    const detail = this.details[i];
    console.log(detail);
    this.gridService.addItem(
      {
        id: i + 1,
        sodg_part: detail.sodg_part,
        sodg_for: detail.sodg_for,
        sodg_desc: detail.sodg_desc,
        sodg_sph: detail.sodg_sph,
        sodg_cyl: detail.sodg_cyl,
        sodg_add: detail.sodg_add,
        total_qty: detail.total_qty,
        
        
      },
      { position: "bottom" }
    );
  /*  this.dataset.push({
      id: detail.id,
        so_nbr: detail.so_nbr,
        so_cust: detail.so_cust,
        
        ad_name: detail.address.ad_name,
        ad_name_control: detail.address.ad_name,

        so_ord_date: detail.so_ord_date,
        so__dec01: detail.so__dec01,
        so__dec02: detail.so__dec02,
        
    });*/
  }
  //this.dataset = res.data
  this.loadingSubject.next(false) 
})

}

handleSelectedRowsChanged2(e, args) {
  const controls = this.soForm.controls;
  if (Array.isArray(args.rows) && this.gridObj2) {
    args.rows.map((idx) => {
      const item = this.gridObj2.getDataItem(idx);
      console.log(item)


      this.provider = item;
      controls.vend.setValue(item.vd_addr || "");

    });
  }
}

angularGridReady2(angularGrid: AngularGridInstance) {
  this.angularGrid2 = angularGrid;
  this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {};
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
    {
      id: "ad_taxable",
      name: "A Taxer",
      field: "address.ad_taxable",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxc",
      name: "Taxe",
      field: "address.ad_taxc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

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
    },
  };

  // fill the dataset with your data
  this.providerService
    .getAll()
    .subscribe((response: any) => (this.providers = response.data));
}
open2(content) {
  this.prepareGrid2();
  this.modalService.open(content, { size: "lg" });
}

}
