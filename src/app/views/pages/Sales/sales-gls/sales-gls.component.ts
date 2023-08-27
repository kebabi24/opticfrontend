import { Component, OnInit } from "@angular/core"
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
  Grouping,
  GroupingGetterFunction,
  GridService,
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

import { SaleOrderService} from "../../../../core/erp"
import { environment } from "../../../../../environments/environment"
import { HttpUtilsService } from "../../../../core/_base/crud"
import { HttpClient } from '@angular/common/http';
const API_URL = environment.apiUrl + "/codes"


const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';

@Component({
  selector: 'kt-sales-gls',
  templateUrl: './sales-gls.component.html',
  styleUrls: ['./sales-gls.component.scss']
})
export class SalesGlsComponent implements OnInit {
  loadingSubject = new BehaviorSubject<boolean>(true);
  soForm: FormGroup;
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  draggableGroupingPlugin: any;
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  gridObj: any;

  hasFormErrors = false;
loading$: Observable<boolean>;
error = false;

  constructor(
      private activatedRoute: ActivatedRoute,
      private http: HttpClient,
      private soFB: FormBuilder,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private saleOrderService: SaleOrderService,
      
  ) {
     //this.prepareGrid()
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
        day: 1
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
            field: "id",
            excludeFromColumnPicker: true,
            excludeFromGridMenu: true,
            excludeFromHeaderMenu: true,
    
            minWidth: 50,
            maxWidth: 50,
          },
          {
            id: "nbr",
            name: "N° Bon",
            field: "nbr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "part",
            name: "Code Verre",
            field: "part",
            width: 100,
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'part',
              formatter: (g) => `Verre: ${g.value}  <span style="color:green">(${g.count} items)</span> `,
              aggregators: [
                new Aggregators.Sum('amt'),
                new Aggregators.Sum('qty')
              ],
              aggregateCollapsed: false,
              collapsed: false
            }
          },
          {
            id: "desc",
            name: "Désignation",
            field: "desc",
            width: 200,
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "cyl",
            name: "Cylindre",
            field: "cyl",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          }, {
            id: "sph",
            name: "Sphere",
            field: "sph",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          }, {
            id: "add",
            name: "Addition",
            field: "add",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "qty",
            name: "Quantité",
            field: "qty",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            grouping: {
              getter: 'Quantité',
              formatter: (g) => `Quantité: ${g.value} <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('qty')
              ],
              aggregateCollapsed: true,
              collapsed: true
            }
          },         
         
          {
            id: "amt",
            name: "Montant",
            field: "amt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            grouping: {
              getter: 'Montant',
              formatter: (g) => `Montant: ${g.value} <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('amt')
              ],
              aggregateCollapsed: true,
              collapsed: true
            }
          },
          {
            id: "effdate",
            name: "Date Effet",
            field: "effdate",
            nameKey: 'DATE EFFET',
            sortable: true,
          

            formatter: Formatters.dateIso, 
            minWidth: 75,
            width: 120,
            exportWithFormatter: true,

            type: FieldType.date,
            filterable: true,
            filter: {
              model: Filters.dateRange,
              operator: 'RangeInclusive',
              // override any of the Flatpickr options through "filterOptions"
              //editorOptions: { minDate: 'today' } as FlatpickrOption
            },
              
            grouping: {
              getter: 'effdate',
              formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span> `,
              aggregators: [
                new Aggregators.Sum('amt'),
                new Aggregators.Sum('qty')
              ],
              aggregateCollapsed: false,
              collapsed: false
            }
          },
          {
            id: "typestk",
            name: "Type Stock",
            field: "typestk",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {

              
              // collectionAsync: this.elem,
              collectionAsync:  this.http.get(`${API_URL}/typestk`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
           
           
             
               model: Filters.multipleSelect,
              
             },
             grouping: {
              getter: 'typestk',
              formatter: (g) => `Type: ${g.value}  <span style="color:green">(${g.count} items)</span> `,
              aggregators: [
                new Aggregators.Sum('amt'),
                new Aggregators.Sum('qty')
              ],
              aggregateCollapsed: false,
              collapsed: false
            },
            
          },
          {
            id: "typepart",
            name: "Type Verre",
            field: "typepart",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'typepart',
              formatter: (g) => `Type: ${g.value}  <span style="color:green">(${g.count} items)</span> `,
              aggregators: [
                new Aggregators.Sum('amt'),
                new Aggregators.Sum('qty')
              ],
              aggregateCollapsed: false,
              collapsed: false
            }
          },
          {
            id: "famille",
            name: "Famille",
            field: "famille",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'famille',
              formatter: (g) => `Famille: ${g.value}  <span style="color:green">(${g.count} items)</span> `,
              aggregators: [
                new Aggregators.Sum('amt'),
                new Aggregators.Sum('qty')
              ],
              aggregateCollapsed: false,
              collapsed: false
            }
          },
          {
            id: "sfamille",
            name: "Sous Famille",
            field: "sfamille",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'sfamille',
              formatter: (g) => `Sous Famille: ${g.value}  <span style="color:green">(${g.count} items)</span> `,
              aggregators: [
                new Aggregators.Sum('amt'),
                new Aggregators.Sum('qty')
              ],
              aggregateCollapsed: false,
              collapsed: false
            }
          },
          {
            id: "mark",
            name: "Marque",
            field: "mark",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'mark',
              formatter: (g) => `Marque: ${g.value}  <span style="color:green">(${g.count} items)</span> `,
              aggregators: [
                new Aggregators.Sum('amt'),
                new Aggregators.Sum('qty')
              ],
              aggregateCollapsed: false,
              collapsed: false
            }
          },
          {
            id: "trait",
            name: "Traitement",
            field: "trait",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'trait',
              formatter: (g) => `Traitement: ${g.value}  <span style="color:green">(${g.count} items)</span> `,
              aggregators: [
                new Aggregators.Sum('amt'),
                new Aggregators.Sum('qty')
              ],
              aggregateCollapsed: false,
              collapsed: false
            }
          },
          {
            id: "col",
            name: "Couleur",
            field: "col",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'col',
              formatter: (g) => `Couleur: ${g.value}  <span style="color:green">(${g.count} items)</span> `,
              aggregators: [
                new Aggregators.Sum('amt'),
                new Aggregators.Sum('qty')
              ],
              aggregateCollapsed: false,
              collapsed: false
            }
          },
          {
            id: "diam",
            name: "Diametre",
            field: "diam",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'diam',
              formatter: (g) => `Diametre: ${g.value}  <span style="color:green">(${g.count} items)</span> `,
              aggregators: [
                new Aggregators.Sum('amt'),
                new Aggregators.Sum('qty')
              ],
              aggregateCollapsed: false,
              collapsed: false
            }
          },
          {
            id: "indice",
            name: "Indice",
            field: "indice",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'indice',
              formatter: (g) => `Indice: ${g.value}  <span style="color:green">(${g.count} items)</span> `,
              aggregators: [
                new Aggregators.Sum('amt'),
                new Aggregators.Sum('qty')
              ],
              aggregateCollapsed: false,
              collapsed: false
            }
          },



      ]

      this.gridOptions = {
        enableDraggableGrouping: true,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        autoHeight:true,
        enableAutoResize: true,
        preHeaderPanelHeight: 40,
        enableFiltering: true,
        enableSorting: true,
        exportOptions: {
          sanitizeDataExport: true
        },
        gridMenu: {
          onCommand: (e, args) => {
            if (args.command === 'toggle-preheader') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
              this.clearGrouping();
            }
          },
        },
        draggableGrouping: {
          dropPlaceHolderText: 'Drop a column header here to group by the column',
          // groupIconCssClass: 'fa fa-outdent',
          deleteIconCssClass: 'fa fa-times',
          onGroupChanged: (e, args) => this.onGroupChanged(args),
          onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
      
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
      this.saleOrderService.getByDet({as_type : "P"}).subscribe(
          (response: any) => { 
            this.dataset = response.data 
            this.dataView.setItems(this.dataset)
     //       console.log(this.dataset)
          }
          // (error) => {
          //     this.dataset = []
          // },
          // () => {}
      )

    }
    onGroupChanged(change: { caller?: string; groupColumns: Grouping[] }) {
      // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
      const caller = change && change.caller || [];
      const groups = change && change.groupColumns || [];
  
      if (Array.isArray(this.selectedGroupingFields) && Array.isArray(groups) && groups.length > 0) {
        // update all Group By select dropdown
        this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = groups[i] && groups[i].getter || '');
      } else if (groups.length === 0 && caller === 'remove-group') {
        this.clearGroupingSelects();
      }
    }
    clearGroupingSelects() {
      this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = '');
    }
    
    collapseAllGroups() {
      this.dataView.collapseAllGroups();
    }
  
    expandAllGroups() {
      this.dataView.expandAllGroups();
    }
    clearGrouping() {
      if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
        this.draggableGroupingPlugin.clearDroppedGroups();
      }
      this.gridObj.invalidate(); // invalidate all rows and re-render
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
      let obj= {date,date1}
      this.saleOrderService.getByDet(obj).subscribe(
        (res: any) => {
      
        //(response: any) => (this.dataset = response.data),
        console.log(res.data)
        this.dataset  = res.data;
        this.dataView.setItems(this.dataset)
          
      //this.dataset = res.data
      this.loadingSubject.next(false) 
    })
    
    }
    
  
}
