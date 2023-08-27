// Angular
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
// RxJS
import { Subscription } from 'rxjs';
// Layout
import { SubheaderService } from '../../../../../core/_base/layout';
import { Breadcrumb } from '../../../../../core/_base/layout/services/subheader.service';

@Component({
  selector: 'kt-subheader1',
  templateUrl: './subheader1.component.html',
  styleUrls: ['./subheader1.component.scss']
})
export class Subheader1Component implements OnInit, OnDestroy, AfterViewInit {
  // Public properties
  @Input() fixed = true;
  @Input() clear = false;
  @Input() width = 'fluid';
  @Input() subheaderClasses = '';
  @Input() subheaderContainerClasses = '';
  @Input() displayDesc = false;
  @Input() displayDaterangepicker = true;

  today :Date = new Date();
  title = '';
  desc = '';
  todayString: string = '';
  breadcrumbs: Breadcrumb[] = [];

  // Private properties
  private subscriptions: Subscription[] = [];

  /**
   * Component constructor
   *
   * @param subheaderService: SubheaderService
   */
  constructor(public subheaderService: SubheaderService) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    this.todayString = `${this.today.getDate()}/${this.today.getMonth()+1}/${this.today.getFullYear()}`
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    this.subscriptions.push(this.subheaderService.title$.subscribe(bt => {
      // breadcrumbs title sometimes can be undefined
      if (bt) {
        Promise.resolve(null).then(() => {
          this.title = bt.title;
          this.desc = bt.desc;
        });
      }
    }));

    this.subscriptions.push(this.subheaderService.breadcrumbs$.subscribe(bc => {
      Promise.resolve(null).then(() => {
        this.breadcrumbs = bc;
      });
    }));
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
