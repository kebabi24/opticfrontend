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
  selector: 'kt-create-cause',
  templateUrl: './create-cause.component.html',
  styleUrls: ['./create-cause.component.scss']
})
export class CreateCauseComponent implements OnInit {

  type: string;
  code: string;
  description: string;
  
  causeForm: FormGroup;
  hasFormErrors: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private causeFB: FormBuilder
  ) { }
  
  
  
  ngOnInit() {
    this.initcauseForm();
  }
  
  initcauseForm() {
  
    this.causeForm = this.causeFB.group({
      type: [this.type, Validators.required],
      code: [this.code, Validators.required],
      description: [this.description, Validators.required],
    })
  }
  
  submit() {
    this.hasFormErrors = false
  }  
}
