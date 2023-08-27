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
  selector: 'kt-journal-defaut',
  templateUrl: './journal-defaut.component.html',
  styleUrls: ['./journal-defaut.component.scss'],
  providers: [NgbDropdownConfig, NgbTabsetConfig],
})
export class JournalDefautComponent implements OnInit {

  journaldefautForm: FormGroup;

  constructor(config: NgbDropdownConfig, private journalDefauuFB: FormBuilder) {
      config.autoClose = true;
      this.journaldefautForm = this.journalDefauuFB.group({})
  }

  ngOnInit(): void {}
}


