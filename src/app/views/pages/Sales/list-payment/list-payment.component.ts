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

import { AccountShiperService} from "../../../../core/erp"


const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';

@Component({
  selector: 'kt-list-payment',
  templateUrl: './list-payment.component.html',
  styleUrls: ['./list-payment.component.scss']
})
export class ListPaymentComponent implements OnInit {

 
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
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private accountShiperService: AccountShiperService,
      
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
  }

  
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }
  prepareGrid() {

      this.columnDefinitions = [
          // {
          //   id: "id",
          //   field: "id",
          //   excludeFromColumnPicker: true,
          //   excludeFromGridMenu: true,
          //   excludeFromHeaderMenu: true,
    
          //   minWidth: 50,
          //   maxWidth: 50,
          // },
          {
            id: "id",
            name: "N° Paiement",
            field: "id",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "as_cust",
            name: "Client",
            field: "as_cust",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'as_cust',
              formatter: (g) => `Client: ${g.value}  <span style="color:green">(${g.count} items)</span> `,
              aggregators: [
                new Aggregators.Sum('as_amt'),
                new Aggregators.Sum('as_mrgn_amt')
              ],
              aggregateCollapsed: false,
              collapsed: false
            }
          },
          {
            id: "ad_name",
            name: "Nom",
            field: "address.ad_name",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ad_name_control",
            name: "Prénom",
            field: "address.ad_name_control",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "as_bank",
            name: "Banque",
            field: "as_bank",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'as_bank',
              formatter: (g) => `Banque: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 
         
          {
            id: "as_check",
            name: "N° Cheque",
            field: "as_check",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
         
          {
            id: "as_pay_method",
            name: "Mode Paiement",
            field: "as_pay_method",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "as_amt",
            name: "Montant",
            field: "as_amt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            grouping: {
              getter: 'Montant',
              formatter: (g) => `Montant: ${g.value} <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('as_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true
            }
          },
          {
            id: "as_mrgn_amt",
            name: "Remise",
            field: "as_mrgn_amt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            grouping: {
              getter: 'Remise',
              formatter: (g) => `Remise: ${g.value} <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('as_mrgn_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true
            }
          },
          {
            id: "as_effdate",
            name: "Date Effet",
            field: "as_effdate",
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
              getter: 'as_effdate',
              formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span> `,
              aggregators: [
                new Aggregators.Sum('as_amt'),
                new Aggregators.Sum('as_mrgn_amt')
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
      this.accountShiperService.getByWithAdress({as_type : "P"}).subscribe(
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
  
  
}
