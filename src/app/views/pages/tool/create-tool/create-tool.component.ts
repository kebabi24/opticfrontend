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
import { ToolService, Tool } from "../../../../core/erp";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud"

@Component({
  selector: 'kt-create-tool',
  templateUrl: './create-tool.component.html',
  styleUrls: ['./create-tool.component.scss']
})
export class CreateToolComponent implements OnInit {

  toolForm: FormGroup;
  row_number;

  isExist = false

  

  
  
  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];
  tool: Tool;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;

  constructor(
    config: NgbDropdownConfig,
    private toolFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private toolService: ToolService,
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
    this.reset();
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.createForm();
    this.initmvGrid();
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.tool = new Tool();
    this.toolForm = this.toolFB.group({
      to_code: [this.tool.to_code, Validators.required],
      to_desc: [{ value: this.tool.to_desc, disabled: !this.isExist },  Validators.required],
     
    });
  }


  onChangeCode() {
    const controls = this.toolForm.controls
    this.toolService
        .getBy({
              to_code: controls.to_code.value
        })
        .subscribe((response: any) => {
         
            if (response.data.tool ) {
                this.isExist = true
                console.log(response.data.length)
              
            } else {
                controls.to_desc.enable()
              
                
            }
     })
  }
  //reste form
  reset() {
    this.tool = new Tool();
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.toolForm.controls;
    /** check form */
    if (this.toolForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    // tslint:disable-next-line:prefer-const
    let tool = this.preparetool();
    for (let data of this.mvdataset) {
      delete data.id;
      delete data.cmvid;
    }
    this.addtool(tool, this.mvdataset);
  }
  /**
   * Returns object for saving
   */
  preparetool(): Tool {
    const controls = this.toolForm.controls;
    const _tool = new Tool();
    _tool.to_code = controls.to_code.value;
    _tool.to_desc = controls.to_desc.value;
    return _tool;
  }
  /**
   * Add code
   *
   * @param _tool: ToolModel
   */
  addtool(_tool: Tool, details: any) {
    this.loadingSubject.next(true);
    this.toolService
      .add({ Tool: _tool, ToolDetails: details })
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
          this.router.navigateByUrl("/tool/create-tool");
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
        id: "tod_nbr",
        name: "Code Outil",
        field: "tod_nbr",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      
      {
        id: "tod_desc",
        name: "Description",
        field: "tod_desc",
        sortable: true,
        width: 200,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "tod_qty",
        name: "Quantité",
        field: "tod_qty",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.number,
        editor: {
          model: Editors.float,
        },
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
      tod_nbr : "",
      tod_desc: "",
      tod_qty: 0,
    };
    this.mvgridService.addItem(newItem, { position: "bottom" });
  }
onAlertClose($event) {
  this.hasFormErrors = false
}
}
