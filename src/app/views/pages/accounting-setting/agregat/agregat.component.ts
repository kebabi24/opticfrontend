// Angular
import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"

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
} from "angular-slickgrid"
import { Observable } from "rxjs"
import { FormGroup, FormBuilder } from "@angular/forms"
@Component({
  selector: 'kt-agregat',
  templateUrl: './agregat.component.html',
  styleUrls: ['./agregat.component.scss'],
  providers: [NgbDropdownConfig, NgbTabsetConfig],

})
export class AgregatComponent implements OnInit {

  agregatForm: FormGroup;

  constructor(config: NgbDropdownConfig, private agregatFB: FormBuilder) {
      config.autoClose = true;
      this.agregatForm = this.agregatFB.group({})
  }

  ngOnInit(): void {}
}
