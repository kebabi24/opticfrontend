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
  selector: 'kt-create-depart',
  templateUrl: './create-depart.component.html',
  styleUrls: ['./create-depart.component.scss'],
  providers: [NgbDropdownConfig, NgbTabsetConfig],

})
export class CreateDepartComponent implements OnInit {

  departForm: FormGroup;

  constructor(config: NgbDropdownConfig, private departFB: FormBuilder) {
      config.autoClose = true;
      this.departForm = this.departFB.group({})
  }

  ngOnInit(): void {}
}
