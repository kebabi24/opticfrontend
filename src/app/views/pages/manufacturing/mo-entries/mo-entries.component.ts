import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

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
} from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
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
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'kt-mo-entries',
  templateUrl: './mo-entries.component.html',
  styleUrls: ['./mo-entries.component.scss']
})
export class MoEntriesComponent implements OnInit {

  nof : string;
  id  : string; 
  product : string;
  description : string;
  depart: string;
  workcenter: string;
  machine: string;


// grid options
moangularGrid: AngularGridInstance;
mogrid: any;
mogridService: GridService;
modataView: any;
mocolumnDefinitions: Column[];
mogridOptions: GridOption;
modataset: any[];


tempangularGrid: AngularGridInstance;
tempgrid: any;
tempgridService: GridService;
tempdataView: any;
tempcolumnDefinitions: Column[];
tempgridOptions: GridOption;
tempdataset: any[];

dp = new Date();

dateStruct: any;



row_number;
mo:[];


  moForm: FormGroup;
  hasFormErrors: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private moFB: FormBuilder
  ) { }

  moGridReady(angularGrid: AngularGridInstance) {
    this.moangularGrid = angularGrid;
    this.modataView = angularGrid.dataView;
    this.mogrid = angularGrid.slickGrid;
    this.mogridService = angularGrid.gridService;
  }
  tempGridReady(angularGrid: AngularGridInstance) {
    this.tempangularGrid = angularGrid;
    this.tempdataView = angularGrid.dataView;
    this.tempgrid = angularGrid.slickGrid;
    this.tempgridService = angularGrid.gridService;
  }


  ngOnInit() {
    this.initmoForm();
    this.initmoGrid();
    this.inittempGrid();
    let dp = new Date();
    this.dateStruct = {day: dp.getDate(), month: dp.getMonth()+1, year: dp.getFullYear()};
    
  }

  initmoForm() {
  
    this.moForm = this.moFB.group({
      nof: [this.nof, Validators.required],
      id: [this.id, Validators.required],
      depart: [this.depart, Validators.required],
      workcenter: [this.workcenter, Validators.required],
      machine: [this.machine, Validators.required],
      dp:[this.dateStruct],
    })
  }
  
  initmoGrid() {

    this.mocolumnDefinitions = [
      {
        id: 'delete',
        name: 'id',
        field: 'id',
        excludeFromHeaderMenu: true,
        minWidth: 30,
        maxWidth: 30,
        selectable: true
      },
      { id: 'cause_code', name: 'Cause', field: 'cause_code', sortable: true, width: 50, filterable: false,type: FieldType.float,
          editor: {
            model: Editors.text
          } 
      },
      { id: 'Qte_rejet', name: 'Quantité rejetée', field: 'qte_rejet', sortable: true, width: 50, filterable: false,type: FieldType.float,
       editor: {
        model: Editors.float
        } 
      },
      { id: 'description', name: 'Description', field: 'description', sortable: true, width: 150, filterable: false,type: FieldType.float,
          editor: {
            model: Editors.text
          } 
      },
      { id: 'Qte', name: 'Qte Total', field: 'qte', filterable: false,type: FieldType.float,
        editor: {
          model: Editors.float
        } 
     }

    ];
   

      this.mogridOptions = {
        asyncEditorLoading: false,
        editable: true,
        enableColumnPicker: true,
        enableCellNavigation: true,
        enableRowSelection: true
      

    };


    this.modataset = []
   


   
  }


  inittempGrid() {

    this.tempcolumnDefinitions = [
      {
        id: 'delete',
        name: 'id',
        field: 'id',
        excludeFromHeaderMenu: true,
        minWidth: 30,
        maxWidth: 30,
        selectable: true
      },
      { id: 'cause_temp', name: 'Cause', field: 'cause_temp', sortable: true, width: 50, filterable: false,type: FieldType.float,
          editor: {
            model: Editors.text
          } 
      },
      { id: 'description', name: 'Description', field: 'description', sortable: true, width: 150, filterable: false,type: FieldType.float,
      editor: {
        model: Editors.text
      } 
  },
      { id: 'temp', name: 'Temps Arret', field: 'temp', sortable: true, width: 50, filterable: false,type: FieldType.float,
       editor: {
        model: Editors.float
        } 
      },
      
      { id: 'temptot', name: 'Total', field: 'temptot', filterable: false,type: FieldType.float,
        editor: {
          model: Editors.float
        } 
     }

    ];


      this.tempgridOptions = {
        asyncEditorLoading: false,
        editable: true,
        enableColumnPicker: true,
        enableCellNavigation: true,
        enableRowSelection: true
      

    };


    this.tempdataset = []




   
  }


  addNewItem() {
    const newId = this.modataset.length;

    const newItem = {
      id: newId,
      cause_code: '',
      rejet: '',
      qte: null,
    };
    this.mogridService.addItemToDatagrid(newItem, false, true, false, false)
  }


  addNewTemp() {
    const newId = this.tempdataset.length;

    const newItem = {
      id: newId,
      cause_temp: '',
      temp:null,
      temptot: null,
    };
    this.tempgridService.addItemToDatagrid(newItem, false, true, false, false)
  }



  selectCause(content) {
    this.modalService.open(content, { size: 'lg' });
    
  }
 
  selectComment(content) {
    this.modalService.open(content, { size: 'lg' });
    
  } 
  selectTemp(content) {
    this.modalService.open(content, { size: 'lg' });
    
  }
  
  
  submit() {
    this.hasFormErrors = false
  }   
}
