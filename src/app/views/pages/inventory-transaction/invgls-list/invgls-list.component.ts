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
  GridOption,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
  ColumnFilter,
  Filter,
  FilterArguments,
  FilterCallback,
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

import { LocationGlasses, LocationGlassesService} from "../../../../core/erp"


const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';


@Component({
  selector: 'kt-invgls-list',
  templateUrl: './invgls-list.component.html',
  styleUrls: ['./invgls-list.component.scss']
})
export class InvglsListComponent implements OnInit {

  
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;

  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  gridObj: any;
  dataviewObj: any;

  
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
     
      private locationGlassesService: LocationGlassesService,
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
  }

  
  createCustomer() {
      this.router.navigateByUrl("customers/customer-create")
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid; // grid object
    this.dataviewObj = angularGrid.dataView;
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
            id: "ldg_site",
            name: "Site",
            field: "ldg_site",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ldg_site',
              formatter: (g) => `Site: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 
          {
            id: "ldg_loc",
            name: "Emplacement",
            field: "ldg_loc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ldg_loc',
              formatter: (g) => `Emplacement: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 
          {
            id: "ldg_part",
            name: "Article",
            field: "ldg_part",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            grouping: {
              getter: 'ldg_part',
              formatter: (g) => `Article: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 
          {
            id: "glass.gls_desc1",
            name: "Description",
            field: "glass.gls_desc1",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
          {
            id: "ldg_lot",
            name: "Lot",
            field: "ldg_lot",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ldg_lot',
              formatter: (g) => `Lot: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 
          {
            id: "ldg_sph",
            name: "Sphere",
            field: "ldg_sph",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            filter: { model: Filters.input,operator: OperatorType.rangeInclusive}
            
            
          }, 
          {
            id: "ldg_cyl",
            name: "Cylindre",
            field: "ldg_cyl",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            filter: { model: Filters.input,operator: OperatorType.rangeInclusive}
            
            
          }, 
          {
            id: "ldg_add",
            name: "Addition",
            field: "ldg_add",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            filter: { model: Filters.input,operator: OperatorType.rangeInclusive}
            
            
          }, 
          {
            id: "ldg_qty_oh",
            name: "Quantite",
            field: "ldg_qty_oh",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            filter: { model: Filters.input,operator: OperatorType.rangeInclusive}
            
            
          }, 
         /* {
            id: "ldg_status",
            name: "Status",
            field: "ldg_status",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ldg_status',
              formatter: (g) => `Status: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 
*/

          {
            id: "ldg_ref",
            name: "Reference",
            field: "ldg_ref",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ldg_ref',
              formatter: (g) => `Reference: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 
          {
            id: "ldg_date",
            name: "Date",
            field: "ldg_date",
            sortable: true,
            filterable: true,
            type: FieldType.date,
            formatter: Formatters.dateIso ,
            filter: { model: Filters.compoundDate },
            grouping: {
              getter: 'ldg_date',
              formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          
          {
            id: "ldg_expire",
            name: "Expire Le",
            field: "ldg_expire",
            sortable: true,
            filterable: true,
            type: FieldType.dateTimeIso,
            grouping: {
              getter: 'ldg_expire',
              formatter: (g) => `Expire Le: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 
          /*{
            id: "ldg_qty_frz",
            name: "Qte Friz",
            field: "ldg_qty_frz",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          },
          
          {
            id: "ldg_date_frz",
            name: "Date Friz",
            field: "ldg_date_frz",
            sortable: true,
            filterable: true,
            type: FieldType.date,
            grouping: {
              getter: 'ldg_date_frz',
              formatter: (g) => `Date Friz: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          */

      ]

      this.gridOptions = {
         /* autoResize: {
            containerId: 'demo-container',
            sidePadding: 10
          },*/
          enableDraggableGrouping: true,
          createPreHeaderPanel: true,
          showPreHeaderPanel: true,
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
      this.locationGlassesService.getAll().subscribe(
        
        
          (response: any) =>{ (this.dataset = response.data)
          console.log(response.data)},
          (error) => {
              this.dataset = []
          },
          () => {}
          
      )
      console.log(this.dataset)
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
      this.dataviewObj.collapseAllGroups();
    }
  
    expandAllGroups() {
      this.dataviewObj.expandAllGroups();
    }
    clearGrouping() {
      if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
        this.draggableGroupingPlugin.clearDroppedGroups();
      }
      this.gridObj.invalidate(); // invalidate all rows and re-render
    }

  
}
