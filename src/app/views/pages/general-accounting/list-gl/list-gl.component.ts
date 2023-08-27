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

import { GeneralLedgerService} from "../../../../core/erp"


const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';

@Component({
  selector: 'kt-list-gl',
  templateUrl: './list-gl.component.html',
  styleUrls: ['./list-gl.component.scss']
})
export class ListGlComponent implements OnInit {

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
     
      private generalLedgerService: GeneralLedgerService,
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
          id: "edit",
          field: "id",
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,
          formatter: (row, cell, value, columnDef, dataContext) => {
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
          },
          minWidth: 50,
          maxWidth: 50,
          // use onCellClick OR grid.onClick.subscribe which you can see down below
          onCellClick: (e: Event, args: OnEventArgs) => {
              const id = args.dataContext.glt_ref
              if(args.dataContext.glt_tr_type == "JL") {
              this.router.navigateByUrl(`/general-accounting/edit-gl/${id}`) }
              else {
                alert("Modification n'est pas authorisé")
              }
          },
      },
      
          
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
            id: "glt_ref",
            name: "Réf",
            field: "glt_ref",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'glt_ref',
              formatter: (g) => `Réf: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 
          {
            id: "glt_tr_type",
            name: "Type",
            field: "glt_tr_type",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'glt_tr_type',
              formatter: (g) => `Type: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 
          {
            id: "glt_acct",
            name: "Compte",
            field: "glt_acct",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            grouping: {
              getter: 'glt_acct',
              formatter: (g) => `Compte: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 
          
          {
            id: "glt_sub",
            name: "Sous Compte",
            field: "glt_sub",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            grouping: {
              getter: 'glt_sub',
              formatter: (g) => `Sous Compte: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 
          
          {
            id: "glt_cc",
            name: "Centre de Coût",
            field: "glt_cc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            grouping: {
              getter: 'glt_cc',
              formatter: (g) => `Centre de Coût: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 
          
          {
            id: "glt_project",
            name: "Projet",
            field: "glt_project",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'glt_project',
              formatter: (g) => `Projet: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 

          {
            id: "glt_entity",
            name: "Entité",
            field: "glt_entity",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'glt_entity',
              formatter: (g) => `Entité: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 

          {
            id: "glt_addr",
            name: "Adresse",
            field: "glt_addr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'glt_addr',
              formatter: (g) => `Adresse: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 

          {
            id: "glt_doc",
            name: "Document",
            field: "glt_doc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 

          {
            id: "glt_curr",
            name: "Devise",
            field: "glt_curr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
         
         
          {
            id: "glt_effdate",
            name: "Effet Le",
            field: "glt_effdate",
            nameKey:"glt_effdate",
            sortable: true,
            filterable: true,
            formatter: Formatters.dateIso,
            type: FieldType.date,
            filter: { model: Filters.dateRange,
              operator: OperatorType.rangeInclusive 
            },
            grouping: {
              getter: 'glt_effdate',
              formatter: (g) => `Effet Le: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 
          {
            id: "glt_curr_amt",
            name: "Montant",
            field: "glt_curr_amt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            
          },
          {
            id: "glt_date",
            name: "Date Saisie",
            field: "glt_date",
            sortable: true,
            filterable: true,
            type: FieldType.date,
            formatter: Formatters.dateIso ,
            filter: { model: Filters.compoundDate },
            grouping: {
              getter: 'glt_date',
              formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          
      ]

      this.gridOptions = {
          /*autoResize: {
            containerId: 'demo-container',
            sidePadding: 20
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
      this.generalLedgerService.getAll().subscribe(
        
          (response: any) => {(this.dataset = response.data)
          console.log(this.dataset)},
          
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
