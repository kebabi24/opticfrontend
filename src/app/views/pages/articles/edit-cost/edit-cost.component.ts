import { Component, OnInit } from "@angular/core"
import {
  NgbDropdownConfig,
  NgbTabChangeEvent,
  NgbTabsetConfig,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap"
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
// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  FieldType, GridService
} from "angular-slickgrid"

import {
  CodeService,
  Item,
  ItemService,
  LocationService,
  SequenceService,
  ProductLineService,
  SiteService,
  MesureService,
  CostSimulation,
  CostSimulationService,
  TaxeService,
} from "../../../../core/erp";
import { _isNumberValue } from '@angular/cdk/coercion';

// create my custom Formatter with the Formatter type
const myCustomCheckmarkFormatter: Formatter = (
  row,
  cell,
  value,
  columnDef,
  dataContext
) => {
  // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
  return `
	<div class="form-group row">
        <div class="col-8">
            <span class="switch switch-icon">
                <label>
                    <input type="checkbox"
                        class="form-control form-control-sm form-control-solid"
                        name="select" />
                    <span></span>
                </label>
            </span>
        </div>
    </div>
	`;
};


@Component({
  selector: 'kt-edit-cost',
  templateUrl: './edit-cost.component.html',
  styleUrls: ['./edit-cost.component.scss']
})
export class EditCostComponent implements OnInit {

  
  item: Item;
  hasFormErrors1 = false;
  hasFormErrors2 = false;
  hasFormErrors3 = false;
  hasFormErrors4 = false;
  hasFormErrors = false;
  site: string;
  error = false;
  itemEdit: any
  sct1Edit: any
  sct2Edit: any
  mtltot: number
  lbrtot: number
  bdntot: number
  ovhtot: number
  subtot: number

  mtltot2: number
  lbrtot2: number
  bdntot2: number
  ovhtot2: number
  subtot2: number

  selectedField: String;
  isExist = false
  form4: FormGroup;
  title: String = 'Modifier Article - '
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  // slick grid
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  datatax: []
  columnDefinitionstax: Column[] = []
  gridOptionstax: GridOption = {}
  gridObjtax: any
  angularGridtax: AngularGridInstance

  datasite: []
  columnDefinitionssite: Column[] = []
  gridOptionssite: GridOption = {}
  gridObjsite: any
  angularGridsite: AngularGridInstance
  
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  dataset2: any[] = [];
  
 
  sct1: CostSimulation;
  sct2: CostSimulation;

  sctForm: FormGroup;
  sctForm1: FormGroup;

  items: []
    columnDefinitions4: Column[] = []
    gridOptions4: GridOption = {}
    gridObj4: any
    angularGrid4: AngularGridInstance

  constructor(
    config: NgbDropdownConfig,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    public dialog: MatDialog,
   
    private form4FB: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,
    private sctService: CostSimulationService,
    private siteService: SiteService,  
    private itemService: ItemService,
    private taxService: TaxeService,
  ) {
    config.autoClose = true;
    
    this.prepareGrid();
    this.prepareGrid2();
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.createForm();
  }
 
  prepareGrid() {
  
    
    this.columnDefinitions = [
      {
        id: "elemet",
        name: "Element",
        field: "element",
        sortable: true,
        editor: {
          model: Editors.text,
          required: true,
        },
      },
      {
        id: "this_level",
        name: "Ce niveau",
        field: "thisLevel",
        sortable: true,
      },
      {
        id: "inf_level",
        name: "Niveau inf",
        field: "infLevel",
        sortable: true,
      },
      { id: "total", name: "Total", field: "Total" },
      {
        id: "pri",
        name: "Pri",
        field: "pri",
        formatter: myCustomCheckmarkFormatter,
      },
      { id: "cate", name: "Categorie", field: "category" },
      {
        id: "sur",
        name: "Sur",
        field: "sur",
        formatter: myCustomCheckmarkFormatter,
      },
    ];

    this.gridOptions = {
      enableSorting: true,
      editable: true,
      enableCellNavigation: true,
      asyncEditorLoading: false,
      autoEdit: true,
    };

    // fill the dataset with your data
    this.dataset = [];
    
  }
  prepareGrid2() {
    
    this.columnDefinitions2 = [
      {
        id: "Matiere",
        name: "Matiere",
        field: "matiere",
        sortable: true,
        editor: {
          model: Editors.text,
          required: true,
        },
      },
      {
        id: "Main d'œuvre",
        name: "Main d'œuvre",
        field: "oeuvre",
        sortable: true,
      },
      {
        id: "FG variable",
        name: "FG variable",
        field: "fg_v",
        sortable: true,
      },
      { id: "FG Fixes", name: "FG Fixes", field: "fg_f" },
      {
        id: "SS-trail",
        name: "SS-trail",
        field: "SS-trail",
      },
    ];

    this.gridOptions2 = {
      enableSorting: true,
      editable: true,
      enableCellNavigation: true,
      asyncEditorLoading: false,
      autoEdit: true,
    };

    // fill the dataset with your data
    this.dataset2 = [];

  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.item = new Item();
    this.form4 = this.formBuilder.group({
      pt_part: [this.item.pt_part,Validators.required],
      pt_desc1: [{ value: this.item.pt_desc1, disabled: !this.isExist }],
      pt_um: [{ value: this.item.pt_um, disabled: !this.isExist }],
      
      pt_price: [{ value: this.item.pt_price, disabled: !this.isExist }],
      pt_taxable: [{ value: this.item.pt_taxable, disabled: !this.isExist }],
      pt_taxc: [{ value: this.item.pt_taxc, disabled: !this.isExist }],

      site: [{ value: this.item.pt_site, disabled: !this.isExist },Validators.required],
    });

    this.sct1 = new CostSimulation();
    this.sct2 = new CostSimulation();
    this.sctForm = this.formBuilder.group({
      sct_mtl_tl: [0],
      sct_mtl_ll: [0],
      mtl_tot: [0],
      sct_lbr_tl: [0],
      sct_lbr_ll: [0],
      lbr_tot: [0],
      sct_bdn_tl: [0],
      sct_bdn_ll: [0],
      bdn_tot: [0],
      sct_ovh_tl: [0],
      sct_ovh_ll: [0],
      ovh_tot: [0],
      sct_sub_tl: [0],
      sct_sub_ll: [0],
      sub_tot: [0], 
    });
    this.sctForm1 = this.formBuilder.group({
      sct_mtl_tl: [0],
      sct_mtl_ll: [0],
      mtl_tot2: [0],
      sct_lbr_tl: [0],
      sct_lbr_ll: [0],
      lbr_tot2: [0],
      sct_bdn_tl: [0],
      sct_bdn_ll: [0],
      bdn_tot2: [0],
      sct_ovh_tl: [0],
      sct_ovh_ll: [0],
      ovh_tot2: [0],
      sct_sub_tl: [0],
      sct_sub_ll: [0],
      sub_tot2: [0], 
    });
  }



  onChangeCode() {
    const controls4 = this.form4.controls
    const controlssct = this.sctForm.controls
    const controlssct2 = this.sctForm1.controls
  
    this.siteService
        .getByOne({
            si_site: controls4.site.value,
        })
        .subscribe((response: any) => {
        
            if (response.data) {
              
             // this.site = response.data
              
              this.sctService.getByOne({sct_part: controls4.pt_part.value, sct_site: controls4.site.value, sct_sim: 'STDCG'}).subscribe((response: any)=>{
                
                
                this.sct1Edit = response.data

                this.sctService.getByOne({sct_part: controls4.pt_part.value, sct_site: controls4.site.value, sct_sim: 'STDCR'}).subscribe((response: any)=>{
                
                
                  this.sct2Edit = response.data
  

                    this.mtltot = Number(this.sct1Edit.sct_mtl_ll) + Number(this.sct1Edit.sct_mtl_tl)
                    this.lbrtot = Number(this.sct1Edit.sct_lbr_ll) + Number(this.sct1Edit.sct_lbr_tl)
                    this.bdntot = Number(this.sct1Edit.sct_bdn_ll) + Number(this.sct1Edit.sct_bdn_tl)
                    this.ovhtot = Number(this.sct1Edit.sct_ovh_ll) + Number(this.sct1Edit.sct_ovh_tl)
                    this.subtot = Number(this.sct1Edit.sct_sub_ll) + Number(this.sct1Edit.sct_sub_tl)

                    this.mtltot2 = Number(this.sct2Edit.sct_mtl_ll) + Number(this.sct2Edit.sct_mtl_tl)
                    this.lbrtot2 = Number(this.sct2Edit.sct_lbr_ll) + Number(this.sct2Edit.sct_lbr_tl)
                    this.bdntot2 = Number(this.sct2Edit.sct_bdn_ll) + Number(this.sct2Edit.sct_bdn_tl)
                    this.ovhtot2 = Number(this.sct2Edit.sct_ovh_ll) + Number(this.sct2Edit.sct_ovh_tl)
                    this.subtot2 = Number(this.sct2Edit.sct_sub_ll) + Number(this.sct2Edit.sct_sub_tl)
                 
                  
                  
                  
                  controlssct.sct_mtl_tl.setValue(this.sct1Edit.sct_mtl_tl || "" );
                  controlssct.sct_mtl_ll.setValue(this.sct1Edit.sct_mtl_ll || "" );
                  controlssct.mtl_tot.setValue(this.mtltot || "0" );
                  controlssct.sct_lbr_tl.setValue(this.sct1Edit.sct_lbr_tl || "" );
                  controlssct.sct_lbr_ll.setValue(this.sct1Edit.sct_lbr_ll || "" );
                  controlssct.lbr_tot.setValue(this.lbrtot || "0" );
                  controlssct.sct_bdn_tl.setValue(this.sct1Edit.sct_bdn_tl || "" );
                  controlssct.sct_bdn_ll.setValue(this.sct1Edit.sct_bdn_ll || "" );
                  controlssct.bdn_tot.setValue(this.bdntot || "0" );
                  controlssct.sct_ovh_tl.setValue(this.sct1Edit.sct_ovh_tl || "" );
                  controlssct.sct_ovh_ll.setValue(this.sct1Edit.sct_ovh_ll || "" );
                  controlssct.ovh_tot.setValue(this.ovhtot || "0" );
                  controlssct.sct_sub_tl.setValue(this.sct1Edit.sct_sub_tl || "" );
                  controlssct.sct_sub_ll.setValue(this.sct1Edit.sct_sub_ll || "" );
                  controlssct.sub_tot.setValue(this.subtot || "0" );
                 
                  controlssct2.sct_mtl_tl.setValue(this.sct2Edit.sct_mtl_tl || "" );
                  controlssct2.sct_mtl_ll.setValue(this.sct2Edit.sct_mtl_ll || "" );
                  controlssct2.mtl_tot2.setValue(this.mtltot2 || "0" );
                  controlssct2.sct_lbr_tl.setValue(this.sct2Edit.sct_lbr_tl || "" );
                  controlssct2.sct_lbr_ll.setValue(this.sct2Edit.sct_lbr_ll || "" );
                  controlssct2.lbr_tot2.setValue(this.lbrtot2 || "0" );
                  controlssct2.sct_bdn_tl.setValue(this.sct2Edit.sct_bdn_tl || "" );
                  controlssct2.sct_bdn_ll.setValue(this.sct2Edit.sct_bdn_ll || "" );
                  controlssct2.bdn_tot2.setValue(this.bdntot2 || "0" );
                  controlssct2.sct_ovh_tl.setValue(this.sct2Edit.sct_ovh_tl || "" );
                  controlssct2.sct_ovh_ll.setValue(this.sct2Edit.sct_ovh_ll || "" );
                  controlssct2.ovh_tot2.setValue(this.ovhtot2 || "0" );
                  controlssct2.sct_sub_tl.setValue(this.sct2Edit.sct_sub_tl || "" );
                  controlssct2.sct_sub_ll.setValue(this.sct2Edit.sct_sub_ll || "" );
                  controlssct2.sub_tot2.setValue(this.subtot2 || "0" );



                })
              })
            } else {
           alert("Site Inexistant")

            }
        })
}
onChangePart() {
  const controls4 = this.form4.controls
  const controlssct = this.sctForm.controls
  const controlssct2 = this.sctForm1.controls
  this.itemService
      .getByOne({
          pt_part: controls4.pt_part.value,
      })
      .subscribe((response: any) => {
      console.log(response.data)
          if (response.data) {    
            this.itemEdit = response.data
            controls4.pt_desc1.setValue( this.itemEdit.pt_desc1 || "");
            controls4.pt_um.setValue(this.itemEdit.pt_um || "");
            controls4.pt_price.setValue(this.itemEdit.pt_price || "");
            controls4.pt_taxable.setValue(this.itemEdit.pt_taxable || "");
            controls4.pt_taxc.setValue(this.itemEdit.pt_taxc || "");
            controls4.site.setValue(this.itemEdit.pt_site || "");
            controls4.pt_price.enable()
            controls4.pt_taxable.enable()
            controls4.pt_taxc.enable()
            controls4.site.enable()
       
            this.sctService.getByOne({sct_part: controls4.pt_part.value, sct_site: controls4.site.value, sct_sim: 'STDCG'}).subscribe((response: any)=>{
                
                
              this.sct1Edit = response.data

              this.sctService.getByOne({sct_part: controls4.pt_part.value, sct_site: controls4.site.value, sct_sim: 'STDCR'}).subscribe((response: any)=>{
              
              
                this.sct2Edit = response.data


                  this.mtltot = Number(this.sct1Edit.sct_mtl_ll) + Number(this.sct1Edit.sct_mtl_tl)
                  this.lbrtot = Number(this.sct1Edit.sct_lbr_ll) + Number(this.sct1Edit.sct_lbr_tl)
                  this.bdntot = Number(this.sct1Edit.sct_bdn_ll) + Number(this.sct1Edit.sct_bdn_tl)
                  this.ovhtot = Number(this.sct1Edit.sct_ovh_ll) + Number(this.sct1Edit.sct_ovh_tl)
                  this.subtot = Number(this.sct1Edit.sct_sub_ll) + Number(this.sct1Edit.sct_sub_tl)

                  this.mtltot2 = Number(this.sct2Edit.sct_mtl_ll) + Number(this.sct2Edit.sct_mtl_tl)
                  this.lbrtot2 = Number(this.sct2Edit.sct_lbr_ll) + Number(this.sct2Edit.sct_lbr_tl)
                  this.bdntot2 = Number(this.sct2Edit.sct_bdn_ll) + Number(this.sct2Edit.sct_bdn_tl)
                  this.ovhtot2 = Number(this.sct2Edit.sct_ovh_ll) + Number(this.sct2Edit.sct_ovh_tl)
                  this.subtot2 = Number(this.sct2Edit.sct_sub_ll) + Number(this.sct2Edit.sct_sub_tl)
               
                
                
                
                controlssct.sct_mtl_tl.setValue(this.sct1Edit.sct_mtl_tl || "" );
                controlssct.sct_mtl_ll.setValue(this.sct1Edit.sct_mtl_ll || "" );
                controlssct.mtl_tot.setValue(this.mtltot || "0" );
                controlssct.sct_lbr_tl.setValue(this.sct1Edit.sct_lbr_tl || "" );
                controlssct.sct_lbr_ll.setValue(this.sct1Edit.sct_lbr_ll || "" );
                controlssct.lbr_tot.setValue(this.lbrtot || "0" );
                controlssct.sct_bdn_tl.setValue(this.sct1Edit.sct_bdn_tl || "" );
                controlssct.sct_bdn_ll.setValue(this.sct1Edit.sct_bdn_ll || "" );
                controlssct.bdn_tot.setValue(this.bdntot || "0" );
                controlssct.sct_ovh_tl.setValue(this.sct1Edit.sct_ovh_tl || "" );
                controlssct.sct_ovh_ll.setValue(this.sct1Edit.sct_ovh_ll || "" );
                controlssct.ovh_tot.setValue(this.ovhtot || "0" );
                controlssct.sct_sub_tl.setValue(this.sct1Edit.sct_sub_tl || "" );
                controlssct.sct_sub_ll.setValue(this.sct1Edit.sct_sub_ll || "" );
                controlssct.sub_tot.setValue(this.subtot || "0" );
               
                controlssct2.sct_mtl_tl.setValue(this.sct2Edit.sct_mtl_tl || "" );
                controlssct2.sct_mtl_ll.setValue(this.sct2Edit.sct_mtl_ll || "" );
                controlssct2.mtl_tot2.setValue(this.mtltot2 || "0" );
                controlssct2.sct_lbr_tl.setValue(this.sct2Edit.sct_lbr_tl || "" );
                controlssct2.sct_lbr_ll.setValue(this.sct2Edit.sct_lbr_ll || "" );
                controlssct2.lbr_tot2.setValue(this.lbrtot2 || "0" );
                controlssct2.sct_bdn_tl.setValue(this.sct2Edit.sct_bdn_tl || "" );
                controlssct2.sct_bdn_ll.setValue(this.sct2Edit.sct_bdn_ll || "" );
                controlssct2.bdn_tot2.setValue(this.bdntot2 || "0" );
                controlssct2.sct_ovh_tl.setValue(this.sct2Edit.sct_ovh_tl || "" );
                controlssct2.sct_ovh_ll.setValue(this.sct2Edit.sct_ovh_ll || "" );
                controlssct2.ovh_tot2.setValue(this.ovhtot2 || "0" );
                controlssct2.sct_sub_tl.setValue(this.sct2Edit.sct_sub_tl || "" );
                controlssct2.sct_sub_ll.setValue(this.sct2Edit.sct_sub_ll || "" );
                controlssct2.sub_tot2.setValue(this.subtot2 || "0" );



              })
       
            })
       
       
       
          } else {
            this.isExist = true
            console.log(response.data)
    

          }
      })
}
  //reste form
  reset() {
    this.item = new Item();
    this.createForm();
    this.hasFormErrors1 = false;
    this.hasFormErrors2 = false;
    this.hasFormErrors3 = false;
    this.hasFormErrors4 = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors1 = false;
    this.hasFormErrors2 = false;
    this.hasFormErrors3 = false;
    this.hasFormErrors4 = false;

    const controls4 = this.form4.controls;

    // tslint:disable-next-line:prefer-const
    let item = this.prepareItem();
    let sct1 = this.prepareSct1();
    let sct2 = this.prepareSct2()
    this.addItem(item, sct1, sct2);
  }
  /**
   *
   * Returns object for saving
   */
  prepareItem(): Item {
    const controls4 = this.form4.controls;
    const _item = new Item();
    _item.id = this.itemEdit.id;
 
    _item.pt_price = controls4.pt_price.value;
    _item.pt_taxable = controls4.pt_taxable.value;
    _item.pt_taxc = controls4.pt_taxc.value;

    return _item;
  }
  /**
   * Add item
   *
   * @param _item: ItemModel
   */
  addItem(item: Item, sct1: CostSimulation, sct2: CostSimulation) {
    this.loadingSubject.next(true);
    this.itemService.update(this.itemEdit.id, item).subscribe(
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

        this.sctService.update(this.sct1Edit.id, sct1).subscribe(
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
            this.sctService.update(this.sct2Edit.id, sct2).subscribe(
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
                this.router.navigateByUrl("/articles/list");
              }
            );
          }
        );
      }
    );
  }

  prepareSct1(): CostSimulation {
    const controls = this.sctForm.controls;
    const control1 = this.form4.controls;
    const _sct = new CostSimulation();
    _sct.id = this.sct1Edit.id;
    _sct.sct_sim = 'STDCG';
    _sct.sct_part   = control1.pt_part.value;
    _sct.sct_mtl_tl = controls.sct_mtl_tl.value;
    _sct.sct_mtl_ll = controls.sct_mtl_ll.value;
    _sct.sct_lbr_tl = controls.sct_lbr_tl.value;
    _sct.sct_lbr_ll = controls.sct_lbr_ll.value;
    _sct.sct_bdn_tl = controls.sct_bdn_tl.value;
    _sct.sct_bdn_ll = controls.sct_bdn_ll.value;
    _sct.sct_ovh_tl = controls.sct_ovh_tl.value;
    _sct.sct_ovh_ll = controls.sct_ovh_ll.value;
    _sct.sct_sub_tl = controls.sct_sub_tl.value;
    _sct.sct_sub_ll = controls.sct_sub_ll.value;
    _sct.sct_cst_tot  =   Number(_sct.sct_mtl_tl) +  Number(_sct.sct_mtl_ll) + Number(_sct.sct_lbr_tl)  + Number(_sct.sct_lbr_ll)  + Number(_sct.sct_bdn_tl)  + Number(_sct.sct_bdn_ll)  + Number(_sct.sct_ovh_tl) + Number(_sct.sct_ovh_ll) + Number(_sct.sct_sub_tl) + Number(_sct.sct_sub_ll) ;
    _sct.sct_site = this.sct1Edit.sct_site;

    return _sct;
  }

  prepareSct2(): CostSimulation {
    const controls = this.sctForm1.controls;
    const control1 = this.form4.controls;
    const _sct = new CostSimulation();
    _sct.id = this.sct2Edit.id;
    _sct.sct_sim = 'STDCR';
    _sct.sct_part = control1.pt_part.value
    _sct.sct_mtl_tl = controls.sct_mtl_tl.value;
    _sct.sct_mtl_ll = controls.sct_mtl_ll.value;
    _sct.sct_lbr_tl = controls.sct_lbr_tl.value;
    _sct.sct_lbr_ll = controls.sct_lbr_ll.value;
    _sct.sct_bdn_tl = controls.sct_bdn_tl.value;
    _sct.sct_bdn_ll = controls.sct_bdn_ll.value;
    _sct.sct_ovh_tl = controls.sct_ovh_tl.value;
    _sct.sct_ovh_ll = controls.sct_ovh_ll.value;
    _sct.sct_sub_tl = controls.sct_sub_tl.value;
    _sct.sct_sub_ll = controls.sct_sub_ll.value;
    _sct.sct_cst_tot = Number(_sct.sct_mtl_tl) +  Number(_sct.sct_mtl_ll) + Number(_sct.sct_lbr_tl)  + Number(_sct.sct_lbr_ll)  + Number(_sct.sct_bdn_tl)  + Number(_sct.sct_bdn_ll)  + Number(_sct.sct_ovh_tl) + Number(_sct.sct_ovh_ll) + Number(_sct.sct_sub_tl) + Number(_sct.sct_sub_ll) ;
    _sct.sct_site = this.sct2Edit.sct_site;
    return _sct;
  }

  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/articles/list`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  handleSelectedRowsChanged4(e, args) {
    const controls = this.form4.controls
    const controlssct = this.sctForm.controls
    const controlssct2 = this.sctForm1.controls
    if (Array.isArray(args.rows) && this.gridObj4) {
        args.rows.map((idx) => {
            const item = this.gridObj4.getDataItem(idx)
            controls.pt_part.setValue(item.pt_part || "")

            controls.pt_desc1.setValue( item.pt_desc1 || "");
            controls.pt_um.setValue(item.pt_um || "");
            controls.pt_price.setValue(item.pt_price || "");
            controls.pt_taxable.setValue(item.pt_taxable || "");
            controls.pt_taxc.setValue(item.pt_taxc || "");
            controls.site.setValue(item.pt_site || "");
            
            controls.pt_price.enable()
            controls.pt_taxable.enable()
            controls.pt_taxc.enable()
            controls.site.enable()
            this.itemEdit = item




            this.sctService.getByOne({sct_part: item.pt_part, sct_site: item.pt_site, sct_sim: 'STDCG'}).subscribe((response: any)=>{
                
                
              this.sct1Edit = response.data

              
              this.sctService.getByOne({sct_part: item.pt_part, sct_site: item.pt_site, sct_sim: 'STDCR'}).subscribe((response: any)=>{
              
              
                this.sct2Edit = response.data
               

                  this.mtltot = Number(this.sct1Edit.sct_mtl_ll) + Number(this.sct1Edit.sct_mtl_tl)
                  this.lbrtot = Number(this.sct1Edit.sct_lbr_ll) + Number(this.sct1Edit.sct_lbr_tl)
                  this.bdntot = Number(this.sct1Edit.sct_bdn_ll) + Number(this.sct1Edit.sct_bdn_tl)
                  this.ovhtot = Number(this.sct1Edit.sct_ovh_ll) + Number(this.sct1Edit.sct_ovh_tl)
                  this.subtot = Number(this.sct1Edit.sct_sub_ll) + Number(this.sct1Edit.sct_sub_tl)

                  this.mtltot2 = Number(this.sct2Edit.sct_mtl_ll) + Number(this.sct2Edit.sct_mtl_tl)
                  this.lbrtot2 = Number(this.sct2Edit.sct_lbr_ll) + Number(this.sct2Edit.sct_lbr_tl)
                  this.bdntot2 = Number(this.sct2Edit.sct_bdn_ll) + Number(this.sct2Edit.sct_bdn_tl)
                  this.ovhtot2 = Number(this.sct2Edit.sct_ovh_ll) + Number(this.sct2Edit.sct_ovh_tl)
                  this.subtot2 = Number(this.sct2Edit.sct_sub_ll) + Number(this.sct2Edit.sct_sub_tl)
               
                 
                controlssct.sct_mtl_tl.setValue(this.sct1Edit.sct_mtl_tl || "" );
                controlssct.sct_mtl_ll.setValue(this.sct1Edit.sct_mtl_ll || "" );
                controlssct.mtl_tot.setValue(this.mtltot || "0" );
                controlssct.sct_lbr_tl.setValue(this.sct1Edit.sct_lbr_tl || "" );
                controlssct.sct_lbr_ll.setValue(this.sct1Edit.sct_lbr_ll || "" );
                controlssct.lbr_tot.setValue(this.lbrtot || "0" );
                controlssct.sct_bdn_tl.setValue(this.sct1Edit.sct_bdn_tl || "" );
                controlssct.sct_bdn_ll.setValue(this.sct1Edit.sct_bdn_ll || "" );
                controlssct.bdn_tot.setValue(this.bdntot || "0" );
                controlssct.sct_ovh_tl.setValue(this.sct1Edit.sct_ovh_tl || "" );
                controlssct.sct_ovh_ll.setValue(this.sct1Edit.sct_ovh_ll || "" );
                controlssct.ovh_tot.setValue(this.ovhtot || "0" );
                controlssct.sct_sub_tl.setValue(this.sct1Edit.sct_sub_tl || "" );
                controlssct.sct_sub_ll.setValue(this.sct1Edit.sct_sub_ll || "" );
                controlssct.sub_tot.setValue(this.subtot || "0" );
               
                controlssct2.sct_mtl_tl.setValue(this.sct2Edit.sct_mtl_tl || "" );
                controlssct2.sct_mtl_ll.setValue(this.sct2Edit.sct_mtl_ll || "" );
                controlssct2.mtl_tot2.setValue(this.mtltot2 || "0" );
                controlssct2.sct_lbr_tl.setValue(this.sct2Edit.sct_lbr_tl || "" );
                controlssct2.sct_lbr_ll.setValue(this.sct2Edit.sct_lbr_ll || "" );
                controlssct2.lbr_tot2.setValue(this.lbrtot2 || "0" );
                controlssct2.sct_bdn_tl.setValue(this.sct2Edit.sct_bdn_tl || "" );
                controlssct2.sct_bdn_ll.setValue(this.sct2Edit.sct_bdn_ll || "" );
                controlssct2.bdn_tot2.setValue(this.bdntot2 || "0" );
                controlssct2.sct_ovh_tl.setValue(this.sct2Edit.sct_ovh_tl || "" );
                controlssct2.sct_ovh_ll.setValue(this.sct2Edit.sct_ovh_ll || "" );
                controlssct2.ovh_tot2.setValue(this.ovhtot2 || "0" );
                controlssct2.sct_sub_tl.setValue(this.sct2Edit.sct_sub_tl || "" );
                controlssct2.sct_sub_ll.setValue(this.sct2Edit.sct_sub_ll || "" );
                controlssct2.sub_tot2.setValue(this.subtot2 || "0" );



              })
            })








        })
    }
}

  angularGridReady4(angularGrid: AngularGridInstance) {
    this.angularGrid4 = angularGrid
    this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid4() {
    this.columnDefinitions4 = [
        {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
        {
            id: "pt_part",
            name: "code ",
            field: "pt_part",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "pt_desc1",
            name: "desc",
            field: "pt_desc1",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "pt_um",
            name: "desc",
            field: "pt_um",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
    ]

    this.gridOptions4 = {
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
    }

    // fill the dataset with your data
    this.itemService
        .getAll()
        .subscribe((response: any) => (this.items = response.data))
}
openpart(content) {
    this.prepareGrid4()
    this.modalService.open(content, { size: "lg" })
}
changeTax() {
  const controls = this.form4.controls; // chof le champs hada wesh men form rah
  const tx2_tax_code = controls.pt_taxc.value;
  this.taxService.getBy({ tx2_tax_code }).subscribe(
    (res: any) => {
      const { data } = res;
      if (!data) {
        this.layoutUtilsService.showActionNotification(
          "cette Taxe n'existe pas!",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.error = true;
      } else {
        this.error = false;
      }
    },
    (error) => console.log(error)
  );
}

handleSelectedRowsChangedtax(e, args) {
  const controls = this.form4.controls
  if (Array.isArray(args.rows) && this.gridObjtax) {
      args.rows.map((idx) => {
          const item = this.gridObjtax.getDataItem(idx)
          controls.pt_taxc.setValue(item.tx2_tax_code || "")
      })
  }
}

angularGridReadytax(angularGrid: AngularGridInstance) {
  this.angularGridtax = angularGrid
  this.gridObjtax = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridtax() {
  this.columnDefinitionstax = [
      {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
      },
      {
          id: "tx2_tax_code",
          name: "code ",
          field: "tx2_tax_code",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "tx2_tax_pct",
        name: "Taux Taxe ",
        field: "tx2_tax_pct",
        sortable: true,
        filterable: true,
        type: FieldType.float,
    },
      {
          id: "tx2_desc",
          name: "Designation",
          field: "tx2_desc",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "tx2_tax_type",
          name: "Type Taxe",
          field: "tx2_tax_type",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
  ]

  this.gridOptionstax = {
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
  }

  // fill the dataset with your data
  this.taxService
      .getAll()
      .subscribe((response: any) => (this.datatax = response.data))
}
opentax(contenttax) {
  this.prepareGridtax()
  this.modalService.open(contenttax, { size: "lg" })
}
handleSelectedRowsChangedsite(e, args) {
  
  const controls4 = this.form4.controls
  const controlssct = this.sctForm.controls
  const controlssct2 = this.sctForm1.controls
  if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
          const item = this.gridObjsite.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
          switch (this.selectedField) {
              case "site": {
                  controls4.site.setValue(item.si_site || "")
                  
                  this.sctService.getByOne({sct_part: controls4.pt_part.value, sct_site: item.si_site, sct_sim: 'STDCG'}).subscribe((response: any)=>{
                
                
                    this.sct1Edit = response.data
      
                    
                    this.sctService.getByOne({sct_part: controls4.pt_part.value, sct_site: item.si_site, sct_sim: 'STDCR'}).subscribe((response: any)=>{
                    
                    
                      this.sct2Edit = response.data
                     
      
                        this.mtltot = Number(this.sct1Edit.sct_mtl_ll) + Number(this.sct1Edit.sct_mtl_tl)
                        this.lbrtot = Number(this.sct1Edit.sct_lbr_ll) + Number(this.sct1Edit.sct_lbr_tl)
                        this.bdntot = Number(this.sct1Edit.sct_bdn_ll) + Number(this.sct1Edit.sct_bdn_tl)
                        this.ovhtot = Number(this.sct1Edit.sct_ovh_ll) + Number(this.sct1Edit.sct_ovh_tl)
                        this.subtot = Number(this.sct1Edit.sct_sub_ll) + Number(this.sct1Edit.sct_sub_tl)
      
                        this.mtltot2 = Number(this.sct2Edit.sct_mtl_ll) + Number(this.sct2Edit.sct_mtl_tl)
                        this.lbrtot2 = Number(this.sct2Edit.sct_lbr_ll) + Number(this.sct2Edit.sct_lbr_tl)
                        this.bdntot2 = Number(this.sct2Edit.sct_bdn_ll) + Number(this.sct2Edit.sct_bdn_tl)
                        this.ovhtot2 = Number(this.sct2Edit.sct_ovh_ll) + Number(this.sct2Edit.sct_ovh_tl)
                        this.subtot2 = Number(this.sct2Edit.sct_sub_ll) + Number(this.sct2Edit.sct_sub_tl)
                     
                       
                      controlssct.sct_mtl_tl.setValue(this.sct1Edit.sct_mtl_tl || "" );
                      controlssct.sct_mtl_ll.setValue(this.sct1Edit.sct_mtl_ll || "" );
                      controlssct.mtl_tot.setValue(this.mtltot || "0" );
                      controlssct.sct_lbr_tl.setValue(this.sct1Edit.sct_lbr_tl || "" );
                      controlssct.sct_lbr_ll.setValue(this.sct1Edit.sct_lbr_ll || "" );
                      controlssct.lbr_tot.setValue(this.lbrtot || "0" );
                      controlssct.sct_bdn_tl.setValue(this.sct1Edit.sct_bdn_tl || "" );
                      controlssct.sct_bdn_ll.setValue(this.sct1Edit.sct_bdn_ll || "" );
                      controlssct.bdn_tot.setValue(this.bdntot || "0" );
                      controlssct.sct_ovh_tl.setValue(this.sct1Edit.sct_ovh_tl || "" );
                      controlssct.sct_ovh_ll.setValue(this.sct1Edit.sct_ovh_ll || "" );
                      controlssct.ovh_tot.setValue(this.ovhtot || "0" );
                      controlssct.sct_sub_tl.setValue(this.sct1Edit.sct_sub_tl || "" );
                      controlssct.sct_sub_ll.setValue(this.sct1Edit.sct_sub_ll || "" );
                      controlssct.sub_tot.setValue(this.subtot || "0" );
                     
                      controlssct2.sct_mtl_tl.setValue(this.sct2Edit.sct_mtl_tl || "" );
                      controlssct2.sct_mtl_ll.setValue(this.sct2Edit.sct_mtl_ll || "" );
                      controlssct2.mtl_tot2.setValue(this.mtltot2 || "0" );
                      controlssct2.sct_lbr_tl.setValue(this.sct2Edit.sct_lbr_tl || "" );
                      controlssct2.sct_lbr_ll.setValue(this.sct2Edit.sct_lbr_ll || "" );
                      controlssct2.lbr_tot2.setValue(this.lbrtot2 || "0" );
                      controlssct2.sct_bdn_tl.setValue(this.sct2Edit.sct_bdn_tl || "" );
                      controlssct2.sct_bdn_ll.setValue(this.sct2Edit.sct_bdn_ll || "" );
                      controlssct2.bdn_tot2.setValue(this.bdntot2 || "0" );
                      controlssct2.sct_ovh_tl.setValue(this.sct2Edit.sct_ovh_tl || "" );
                      controlssct2.sct_ovh_ll.setValue(this.sct2Edit.sct_ovh_ll || "" );
                      controlssct2.ovh_tot2.setValue(this.ovhtot2 || "0" );
                      controlssct2.sct_sub_tl.setValue(this.sct2Edit.sct_sub_tl || "" );
                      controlssct2.sct_sub_ll.setValue(this.sct2Edit.sct_sub_ll || "" );
                      controlssct2.sub_tot2.setValue(this.subtot2 || "0" );
      
      
      
                    })
                  })
      






                  break
              }    
              default:
                  break
          }
      })
  }
}
angularGridReadysite(angularGrid: AngularGridInstance) {
  this.angularGridsite = angularGrid
  this.gridObjsite = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridsite() {
  this.columnDefinitionssite = [
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
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
      },
      {
          id: "si_site",
          name: "Site",
          field: "si_site",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "si_desc",
          name: "Designation",
          field: "si_desc",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      
  ]

  this.gridOptionssite = {
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
      },
      multiSelect: false,
      rowSelectionOptions: {
          selectActiveRow: true,
      },
  }

  // fill the dataset with your data
  this.siteService
      .getAll()
      .subscribe((response: any) => (this.datasite = response.data))
}
opensite(contentsite, field) {
  this.selectedField = field
  this.prepareGridsite()
  this.modalService.open(contentsite, { size: "lg" })
}

}
