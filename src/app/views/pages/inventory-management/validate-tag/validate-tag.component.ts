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
  selector: "kt-validate-tag",
  templateUrl: "./validate-tag.component.html",
  styleUrls: ["./validate-tag.component.scss"],
})
export class ValidateTagComponent implements OnInit {
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;

  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  tag_nbr: Number;
  details: any[];

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
      .getTag({ tag_nbr: $event.target.value })
      .subscribe((res: any) => {
       this.tag_nbr = Number($event.target.value)
        this.details  = res.data;
        console.log(this.details)
        for (const object in this.details) {
          const detail = this.details[object];
          this.gridService.addItem(
            {
              id: detail.id,
              tag_nbr: $event.target.value,
              tag_part: detail.tag_part,
              tag_serial: detail.tag_serial,
              tag_site: detail.tag_site,
              description: detail.item.pt_desc1,
              tag_loc: detail.tag_loc,
              tag_cnt_qty: detail.tag_cnt_qty,          
              tag_cnt_nam: detail.tag_cnt_nam,
              tag_cnt_dt: detail.tag_cnt_dt,
              tag_rcnt_qty: detail.tag_rcnt_qty,          
              tag_rcnt_nam: detail.tag_rcnt_nam,
              tag_rcnt_dt: detail.tag_rcnt_dt,
             
              // bool01:true

            },
            { position: "bottom" }
          );
   //       this.dataset = this.details;
     this.loadingSubject.next(false) }
          });
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
      },
      {
        id: "tag_cnt_nam",
        name: "Compte par",
        field: "tag_cnt_nam",
        sortable: true,
        width: 60,
        filterable: false,
        //type: FieldType.float,
      },
      {
        id: "tag_cnt_dt",
        name: "Date Comptee",
        field: "tag_cnt_dt",
        sortable: true,
        width: 60,
        filterable: false,
      },
      {
        id: "tag_rcnt_qty",
        name: "Qte ReComptee",
        field: "tag_rcnt_qty",
        sortable: true,
        width: 80,
        filterable: false,
      },
      {
        id: "tag_rcnt_nam",
        name: "ReCompte par",
        field: "tag_rcnt_nam",
        sortable: true,
        width: 60,
        filterable: false,
        //type: FieldType.float,
      },
      {
        id: "tag_rcnt_dt",
        name: "Date ReComptee",
        field: "tag_rcnt_dt",
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
  onSubmit() {
    this.tagService.validateTag({ tag_nbr: this.tag_nbr }).subscribe(
      (res) => console.log(res),
      (error) => console.log(error),
      () => {
        this.layoutUtilsService.showActionNotification(
          "Valide avec succès",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.loadingSubject.next(false);
        const url = `/`;
        this.router.navigateByUrl(url);
      }
    );
  }
}
