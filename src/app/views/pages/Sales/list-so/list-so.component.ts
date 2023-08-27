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

import { SaleOrderService, CustomerService, VisiteService,GlassesService,ItemService,AccessoireService,DoctorService, UsersService} from "../../../../core/erp";

const defaultPageSize = 100;

@Component({
  selector: 'kt-list-so',
  templateUrl: './list-so.component.html',
  styleUrls: ['./list-so.component.scss']
})
export class ListSoComponent implements OnInit {
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
doctor: any;
user: any;

visit: any;
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
  private doctorService: DoctorService,
  private accessoireService: AccessoireService,
  private userService: UsersService,

  private saleOrderService: SaleOrderService,
) {
  this.prepareGrid();
  //this.solist();
}

ngOnInit(): void {
  this.createForm();
  this.prepareGrid();
  //this.solist();

}
gridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
  this.dataView = angularGrid.dataView;
  this.grid = angularGrid.slickGrid;
  this.gridService = angularGrid.gridService;
}
createForm() {
  const date = new Date;
  
  this.soForm = this.soFB.group({
  
    date: [{
      year:date.getFullYear(),
      month: date.getMonth()+1,
      day: date.getDate()
    }],
    
  
  });

  
  

}

prepareGrid() {
  this.columnDefinitions = [
    {
      id: "Paiment",
      field: "id",
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      formatter: (row, cell, value, columnDef, dataContext) => {
          // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
          return `
      <a class="btn btn-sm btn-clean btn-icon mr-2" title="Edit paiment">
      <span class="svg-icon svg-icon-md">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
              height="24px" viewBox="0 0 24 24" version="1.1">
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <rect x="0" y="0" width="24" height="24"></rect>
                  <path
                      d="M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z"
                      fill="#000000" fill-rule="nonzero"
                      transform="translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) ">
                  </path>
                  <rect fill="#000000" opacity="0.3" x="5" y="20" width="15" height="2" rx="1"></rect>
              </g>
          </svg>
      </span>
  </a>
  `
      },
      minWidth: 50,
      maxWidth: 50,
      // use onCellClick OR grid.onClick.subscribe which you can see down below
      onCellClick: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id
          this.router.navigateByUrl(`/Sales/payment-so/${id}`)
      },
  },
  {
    id: "Paiment",
    field: "id",
    excludeFromColumnPicker: true,
    excludeFromGridMenu: true,
    excludeFromHeaderMenu: true,
    /*formatter: (row, cell, value, columnDef, dataContext) => {
        // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
        return `
    <a class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">
    <span class="svg-icon svg-icon-md">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
            height="24px" viewBox="0 0 24 24" version="1.1">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <rect x="0" y="0" width="24" height="24"></rect>
                <path
                    d="M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z"
                    fill="#000000" fill-rule="nonzero"
                    transform="translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) ">
                </path>
                <rect fill="#000000" opacity="0.3" x="5" y="20" width="15" height="2" rx="1"></rect>
            </g>
        </svg>
    </span>
</a>
`
    },*/
    formatter: Formatters.icon, params: { formatterIcon: 'fa fa-print' },
    minWidth: 50,
    maxWidth: 50,
    // use onCellClick OR grid.onClick.subscribe which you can see down below
    onCellClick: (e: Event, args: OnEventArgs) => {
        const id = args.dataContext.id
        this.printpdf(id)
    },
},
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
      id: "so_nbr",
      name: "Code",
      field: "so_nbr",
      width: 50,
      selectable: true,
      filterable: true,
      grouping: {
        getter: 'so_nbr',
        formatter: (g) => `N BC: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregateCollapsed: false,
        collapsed: false,
      }
    },
    {
      id: "so_cust",
      name: "Client",
      field: "so_cust",
      sortable: true,
      width: 50,
      filterable: true,
    },
    {
      id: "chr04",
      name: "Nom",
      field: "chr04",
      sortable: true,
      width: 50,
      filterable: true,
    },
    {
      id: "chr05",
      name: "Prénom",
      field: "chr05",
      sortable: true,
      width: 50,
      filterable: true,
    },
    
    
    {
      id: "so_ord_date",
      name: "Date de creation",
      field: "so_ord_date",
      sortable: true,
      width: 50,
      filterable: true,
      formatter: Formatters.dateIso,
      type: FieldType.dateIso,
    },
    
    {
      id: "so__dec01",
      name: "TTC",
      field: "so__dec01",
      sortable: true,
      width: 50,
      filterable: true,
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
      type: FieldType.float,

    },
    {
      id: "so__dec02",
      name: "Réglé",
      field: "so__dec02",
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
    
  



   

}

// fill the dataset with your data
this.dataset = []
const date = new Date;
    console.log(date)
this.soService.getByAllAdr({so_ord_date: date}).subscribe(
    (response: any) => {
    this.dataset = response.data
    this.dataView.setItems(this.dataset)
    console.log(this.dataset)
    }
    // (error) => {
    
    //     this.dataset = []
    // },
    // () => {}
   
)  

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
solist(){
  const controls = this.soForm.controls
  console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
  this.dataset = []
  const date = controls.date.value
  ? `${controls.date.value.year}/${controls.date.value.month}/${controls.date.value.day}`
  : null;
  console.log(date)
  const date1 = new Date(date)
  console.log(date1)
  
  this.soService.getByAllAdr({so_ord_date: date1}).subscribe(
    (res: any) => {
  
    //(response: any) => (this.dataset = response.data),
    console.log(res.data)
    this.dataset  = res.data;
    this.dataView.setItems(this.dataset)
  // for (var i = 0; i < this.details.length; i++) {
  //   console.log("hnahnahnahna",i)
  //   const detail = this.details[i];
  //   console.log(detail);
  //   this.gridService.addItem(
  //     {
  //       id: detail.id,
  //       so_nbr: detail.so_nbr,
  //       so_cust: detail.so_cust,
        
  //       chr05: detail.address.ad_name,
  //       chr06: detail.address.ad_name,

  //       so_ord_date: detail.so_ord_date,
  //       so__dec01: detail.so__dec01,
  //       so__dec02: detail.so__dec02,
        
  //     },
  //     { position: "bottom" }
  //   );
  
  // }
  //this.dataset = res.data
  this.loadingSubject.next(false) 
})

}

printpdf(id) {
  
  this.saleOrderService.getOne(id).subscribe((response: any)=>{
    
    this.soEdit = response.data.saleOrder;
    this.datasetmnt = response.data.details;
    this.datasetgls = response.data.detailsgls;
    this.datasetacs = response.data.detailsacs;
  this.customerService.getBy({ cm_addr: this.soEdit.so_cust }).subscribe(
    (res: any) => {
      this.customer = res.data;
      this.visiteService.getBy({ vis_so_nbr: this.soEdit.so_nbr }).subscribe(
        (resp: any) => {
          this.visit = resp.data[0];
          this.doctorService.getBy({ dr_addr: this.soEdit.so_po }).subscribe(
            (respon: any) => {
            this.doctor = respon.data
            this.userService.getBy({ usrd_code: this.soEdit.created_by }).subscribe(
              (re: any) => {
                console.log(re.data)
                this.user = re.data[0]
  console.log("pdf")
  var doc = new jsPDF('l', 'mm', [148,210]);
  
  // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
  var img = new Image()
  //img.src = "./assets/media/logos/company.png";
  //doc.addImage(img, 'png', 5, 5, 210, 30)
  doc.barcode(this.soEdit.so_nbr, {
    fontSize: 35,
    textColor: "#000000",

    x: 5.4,
    y: 25.5
  })
  
  doc.setFontSize(6);
  doc.setFont('bold')
  doc.text(  this.soEdit.so_nbr  , 21, 29);
  doc.setFontSize(8);
  doc.setFont('bold')
  
  doc.text( 'Vendeur : ' + this.user.usrd_name  , 10, 45);

  doc.barcode(this.soEdit.so_nbr, {
    fontSize: 35,
    textColor: "#000000",

    x: 165.4,
    y: 25.5
  })
  doc.setFontSize(6);
  doc.setFont('bold')
  doc.text(  this.soEdit.so_nbr  , 180, 29);
  


  doc.setFont('bold')
  doc.setFontSize(12);

  doc.text( 'Commande N° : ' + this.soEdit.so_nbr  , 50,20);
  doc.text(  String(this.customer.address.ad_name) + " " + String(this.customer.address.ad_name_control), 105 , 20)
  doc.setFont('normal')
  doc.setFontSize(8);
  doc.text( 'Visite N° : ' + this.visit.vis_nbr  , 50, 25);

  
  //console.log(this.customer.address.ad_misc2_id)
 // doc.text('Code Client : ' + this.customer.cm_addr, 10 , 45 )
 doc.text('Adresse     : ' + this.customer.address.ad_line1, 50 , 30)
  doc.text('Tel           : ' + this.customer.address.ad_phone, 50 , 35)
  doc.text('Date Naissance : ' + this.customer.cm_mod_date, 50 , 40)
  
  var today = new Date(this.soEdit.createdAt);
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
 
doc.text("Date :" + dateTime,50,45)
  doc.setFont('bold')
  doc.setFontSize(12);
  doc.text( 'peniche N° : ' + this.soEdit.so_fob  , 100, 45);
  doc.setFont('bold')
  doc.setFontSize(10);

  if (this.soEdit.so_po != null) {
 
    doc.text( String(this.doctor.dr_desc) , 30, 53.5);

 
  }
  doc.text( 'Docteur : ' , 16, 53.5);
  
  doc.line(2, 55, 208, 55);
  doc.line(2, 50, 208, 50);
  doc.line(2, 2, 2, 55);
  doc.line(208, 2, 208, 55);
  doc.line(48, 2, 48, 50);
  doc.line(167, 2, 167, 50);
  
  var i = 60;
  
  /**********************Verre***************** */
  i = i + 10;
  doc.setFont('bold')
  doc.setFontSize(10);
  
  doc.text('Verre / Lentille ', 11 , i - 8);
  
  
  doc.setFont('normal')
  doc.setFontSize(8);
  doc.line(10, i, 80, i);
  doc.line(90, i, 110, i);
  doc.line(90, i-5, 110, i-5);
  
  doc.line(10, i-5, 80, i-5);
  doc.line(10, i-5, 10, i);
  doc.text('Oeil', 12 , i - 2.5);
  doc.line(20, i-5, 20, i);
  doc.text('Sph', 22 , i - 2.5);
  doc.line(30, i-5, 30, i);
  doc.text('Cyl', 32 , i - 2.5);
  doc.line(40, i-5, 40, i);
  doc.text('AXE', 42 , i - 2.5);
  doc.line(50, i-5, 50, i);
  doc.text('ADD', 52 , i - 2.5);
  doc.line(60, i-5, 60, i);
  doc.text('Base', 62 , i - 2.5);
  doc.line(70, i-5, 70, i);
  doc.text('Prisme', 72 , i - 2.5);
  doc.line(80, i-5, 80, i);
  
 
  doc.line(90, i-5, 90, i);
  doc.text('Ecart', 92 , i - 2.5);
  doc.line(100, i-5, 100, i);
  doc.text('Hteur', 102 , i - 2.5);
  doc.line(110, i-5, 110, i);

  doc.line(120, i-5, 120, i + 10);
  doc.line(130, i-5, 130, i + 10);
  doc.line(140, i-5, 140, i + 10);
  
  
  doc.line(120, i-5, 140, i - 5);
  doc.text('AP', 123 , i - 2);
  doc.line(120, i, 140, i );

  doc.text('DVT', 122 , i + 3);
  doc.line(120, i+5, 140, i + 5);
  doc.text('AG', 123 , i + 8);
  doc.line(120, i+10, 140, i + 10);
  

  i = i + 5
  doc.setFont('normal')
  doc.setFontSize(8);
  for (let j = 0; j < this.datasetgls.length  ; j++) {
    
    //doc.line(10, i - 5, 145, i - 5);
    doc.line(10, i, 80, i );
    doc.line(90, i, 110, i );
    doc.line(10, i - 5, 10, i );
    //var oeil = "";
    //if(this.datasetgls[j].sodg_contr_id == 0){ oeil = "OD"} else { oeil = "OG"}
    doc.text( this.datasetgls[j].sodg_contr_id, 11.5 , i - 2);
    doc.line(20, i - 5, 20, i);
    if(this.datasetgls[j].sodg_contr_id == "OD") {
    doc.text(String(Number(this.visit.vis_rsph)), 22 , i - 2);
    } else {
      doc.text(String(Number(this.visit.vis_lsph)), 22 , i - 2);
   
    }
    doc.line(30, i - 5 , 30, i );
    if(this.datasetgls[j].sodg_contr_id == "OD") {
      doc.text(String(Number(this.visit.vis_rcyl)), 32 , i - 2);
      } else {
        doc.text(String(Number(this.visit.vis_lcyl)), 32 , i - 2);
     
      }
    //doc.text(this.datasetgls[j].desc, 42 , i - 2);
    doc.line(40, i - 5, 40, i );
    if(this.datasetgls[j].sodg_contr_id == "OD") {
      doc.text(String(Number(this.visit.vis_raxe)), 42 , i - 2);
      } else {
        doc.text(String(Number(this.visit.vis_laxe)), 42 , i - 2);
     
      }
    //doc.text( String(this.datasetgls[j].sodg_qty_ord.toFixed(2)), 113 , i - 2 , { align: 'right' });
    doc.line(50, i - 5 , 50, i );
    if(this.datasetgls[j].sodg_contr_id == "OD") {
      doc.text(String(Number(this.visit.vis_radd)), 52 , i - 2);
      } else {
        doc.text(String(Number(this.visit.vis_ladd)), 52 , i - 2);
     
      }
    doc.line(60, i - 5, 60, i );
    if(this.datasetgls[j].sodg_contr_id == "OD") {
      doc.text(String(Number(this.visit.vis_rbase)), 62 , i - 2);
      } else {
        doc.text(String(Number(this.visit.vis_lbase)), 62 , i - 2);
     
      }
    doc.line(70, i - 5, 70, i );
    if(this.datasetgls[j].sodg_contr_id == "OD") {
      doc.text(String(Number(this.visit.vis_rprisme)), 72 , i - 2);
      } else {
        doc.text(String(Number(this.visit.vis_lprisme)), 72 , i - 2);
     
      }
   
      doc.line(80, i - 5, 80, i );

      doc.line(90, i - 5, 90, i );

    if(this.datasetgls[j].sodg_contr_id == "OD") {
      doc.text(String(Number(this.visit.vis_recart)), 92 , i - 2);
      } else {
        doc.text(String(Number(this.visit.vis_lecart)), 92 , i - 2);
     
      }
      doc.line(100, i - 5, 100, i );
      if(this.datasetgls[j].sodg_contr_id == "OD") {
        doc.text(String(Number(this.visit.vis_rhauteur)), 102 , i - 2);
        } else {
          doc.text(String(Number(this.visit.vis_lhauteur)), 102 , i - 2);
       
        }
        doc.line(110, i - 5, 110, i );
    /*       doc.text( String(desc), 102 , i - 2 );
         
        doc.line(130, i - 5, 130, i );
    doc.text( String(Number(this.datasetgls[j].sodg_price).toFixed(2)), 142 , i - 2 , { align: 'right' });
    doc.line(145, i - 5, 145, i );
    */
  
  i = i + 5 ;
  }
  /**********************Verre******************* */
  i = i + 5;
  doc.setFillColor(206,206,206);
  doc.rect( 2, i - 3 , 205 , 10 ,'FD');
  doc.text("Designation :"  , 10 , i + 2);
  i = i + 5;
  
  doc.setFont('bold')
  doc.setFontSize(10);
  doc.text("Monture :"  , 10 , i + 7);
  doc.setFont('normal')
  doc.setFontSize(8);
  for (const j in this.datasetmnt) {
    const detail = this.datasetmnt[j];
    console.log(detail.sod_desc)
    if (detail == null) {
      doc.text("Monture Client", 25 , i + 7);
    } else {
       doc.text(String(detail.sod_desc), 25 , i + 7);
    }
  }
i = i + 5;
doc.setFont('bold')
  doc.setFontSize(10);
  
  doc.text("Verre :"  , 10 , i + 7);
  doc.setFont('normal')
  doc.setFontSize(8);
     
  for (const j in this.datasetgls) {
    const detail = this.datasetgls[j];
    doc.text(String(this.datasetgls[j].sodg_contr_id), 13 , i + 12);
       doc.text(String(detail.sodg_desc), 24 , i + 12);
     i = i + 5 ;
  }
  
  i = i + 5;
doc.setFont('bold')
  doc.setFontSize(10);
  
  doc.text("Accessoire :"  , 10 , i + 7);
  doc.setFont('normal')
  doc.setFontSize(8);
     
  for (const j in this.datasetacs) {
    const detail = this.datasetacs[j];
    console.log(detail)
    if (detail != null) {
    
       doc.text(String(detail.soda_desc), 21 , i + 12);
    
       i = i + 5 ;
    }
  }
  i = i + 15
  doc.setFillColor(206,206,206);
  doc.rect( 2, i - 3 , 205 , 10 ,'FD');
  doc.text("Total : " + this.soEdit.so__dec01  , 10 , i + 2);
  doc.text("Encaissé : " + this.soEdit.so__dec02  , 90 , i + 2);
  doc.text("Reste : " +  String(Number(this.soEdit.so__dec01) - Number(this.soEdit.so__dec02))  , 170 , i + 2);
  
  /**********************accessoire***************** */
  
  /*
  doc.setFont('bold')
  doc.setFontSize(10);
  
  doc.text('Accessoire ', 11 , i - 5);
  i = i + 5
  
  doc.setFont('normal')
  doc.setFontSize(8);
  doc.line(10, i, 145, i);
  doc.line(10, i-5, 145, i-5);
  doc.line(10, i-5, 10, i);
  doc.text('LN', 11 , i - 2.5);
  doc.line(15, i-5, 15, i);
  doc.text('Code Article', 20 , i - 2.5);
  doc.line(40, i-5, 40, i);
  doc.text('Désignation', 65 , i - 2.5);
  doc.line(95, i-5, 95, i);
  doc.text('QTE', 102 , i - 2.5);
  doc.line(115, i-5, 115, i);
  doc.text('UM', 120 , i - 2.5);
  doc.line(125, i-5, 125, i);
  doc.text('PU', 136 , i - 2.5);
  doc.line(145, i-5, 145, i);
  */
  i = i + 5
  doc.setFont('normal')
  doc.setFontSize(8);
  /*
  for (let j = 0; j < this.datasetacs.length  ; j++) {
    doc.line(10, i - 5, 145, i - 5);
    doc.line(10, i, 145, i );
    
    doc.line(10, i - 5, 10, i );
    //var oeil = "";
    //if(this.datasetgls[j].sodg_contr_id == 0){ oeil = "OD"} else { oeil = "OG"}
    doc.text(String(("000"+ this.datasetacs[j].soda_line)).slice(-3), 10.5 , i - 2);
    doc.line(15, i - 5, 15, i);
    doc.text(this.datasetacs[j].soda_part, 20 , i - 2);
    doc.line(40, i - 5 , 40, i );
    doc.text(this.datasetacs[j].desc, 42 , i - 2);
    doc.line(95, i - 5, 95, i );
    doc.text( String(this.datasetacs[j].soda_qty_ord.toFixed(2)), 113 , i - 2 , { align: 'right' });
    doc.line(115, i - 5 , 115, i );
    doc.text(this.datasetacs[j].soda_um, 120 , i - 2);
    doc.line(125, i - 5, 125, i );
    doc.text( String(Number((this.datasetacs[j].soda_price * ((100 - this.datasetacs[j].soda_disc_pct) / 100)) * this.datasetacs[j].soda_qty_ord * (1 + this.datasetacs[j].soda_taxc / 100) ).toFixed(2)  ), 143 , i - 2 , { align: 'right' });
    doc.line(145, i - 5, 145, i );
    i = i + 5 ;
  }
  
  */
  /**********************accessoire***************** */
  // doc.line(10, i - 5, 200, i - 5);
  i = i + 20
  
  //doc.text('Total HT', 90 ,  i + 12 , { align: 'left' });
  //doc.text('TVA', 90 ,  i + 19 , { align: 'left' });
  
  
  //doc.text(String(Number(controls.tht.value).toFixed(2)), 143 ,  i + 12 , { align: 'right' });
  //doc.text(String(Number(controls.tva.value).toFixed(2)), 143 ,  i + 19 , { align: 'right' });
    
    // window.open(doc.output('bloburl'), '_blank');
    //window.open(doc.output('blobUrl'));  // will open a new tab
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
  })
})
  
})
}) 
})
}
  
   
}
