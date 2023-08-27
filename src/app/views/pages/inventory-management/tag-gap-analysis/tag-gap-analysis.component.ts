import { Component, OnInit } from "@angular/core";
import { InventoryManagementService } from "src/app/core/erp";
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
} from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { LayoutUtilsService, MessageType } from "src/app/core/_base/crud";
@Component({
  selector: 'kt-tag-gap-analysis',
  templateUrl: './tag-gap-analysis.component.html',
  styleUrls: ['./tag-gap-analysis.component.scss']
})
export class TagGapAnalysisComponent implements OnInit {

  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;

  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  constructor(
    private tagService: InventoryManagementService,
    private router: Router,
    private layoutUtilsService: LayoutUtilsService
  ) {}

  ngOnInit(): void {
    this.initGrid();
  }

  onChangeNbr($event) {
    this.tagService
      .getGap({ tag_nbr: $event.target.value })
      .subscribe((res: any) => {
        console.log(res.data)
        this.dataset = res.data});
  }

  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  initGrid() {
    this.columnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        minWidth: 30,
        maxWidth: 30,
      },

      {
        id: "tag_part",
        name: "Article",
        field: "tag_part",
        minWidth: 50,
        maxWidth: 50,
        selectable: true,
      },
      {
        id: "tag_serial",
        name: "Lot",
        field: "tag_serial",
        minWidth: 100,
        maxWidth: 100,
        selectable: true,
      },
      {
        id: "tag_site",
        name: "Site",
        field: "tag_site",
        sortable: true,
        width: 50,
        filterable: false,
      },
      {
        id: "tag_loc",
        name: "Emplacement",
        field: "tag_loc",
        sortable: true,
        width: 50,
        filterable: false,
      },
      {
        id: "description",
        name: "Description",
        field: "item.pt_desc1",
        sortable: true,
        width: 80,
        filterable: false,
      },
      {
        id: "tag_cnt_qty",
        name: "Qte Comptee",
        field: "tag_cnt_qty",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
      },
      {
        id: "tag_cnt_nam",
        name: "Compte par",
        field: "tag_cnt_nam",
        sortable: true,
        width: 60,
        filterable: false,
        //type: FieldType.float,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "tag_cnt_dt",
        name: "Date Comptee",
        field: "tag_cnt_dt",
        sortable: true,
        width: 60,
        filterable: false,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "ld_qty_frz",
        name: "Qte gelé ",
        field: "ld_qty_frz",
        sortable: true,
        width: 60,
        filterable: false,

      },
      {
        id: "gap",
        name: "Ecart",
        field: "gap",
        sortable: true,
        width: 60,
        filterable: false,
       
      },
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
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
        thousandSeparator: " ", // can be any of ',' | '_' | ' ' | ''
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

    this.dataset = [];
  }
  goBack() {
    this.loadingSubject.next(false);
    const url = `/`;
    this.router.navigateByUrl(url, {});
  }
  
}
