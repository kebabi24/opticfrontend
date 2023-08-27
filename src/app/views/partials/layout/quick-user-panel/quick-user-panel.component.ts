// Angular
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
// Layout
import { OffcanvasOptions } from '../../../../core/_base/layout';
import { AppState } from '../../../../core/reducers';
import { currentUser, Logout, User } from '../../../../core/auth';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'kt-quick-user-panel',
  templateUrl: './quick-user-panel.component.html',
  styleUrls: ['./quick-user-panel.component.scss']
})
export class QuickUserPanelComponent implements OnInit {
  user$: any;
  // Public properties
  offcanvasOptions: OffcanvasOptions = {
    overlay: true,
    baseClass: 'offcanvas',
    placement: 'right',
    closeBy: 'kt_quick_user_close',
    toggleBy: 'kt_quick_user_toggle'
  };

  constructor(private store: Store<AppState>,
    private router: Router,) {

  }

  ngOnInit(): void {
    this.user$ = JSON.parse(localStorage.getItem('user'))
    
  }

  /**
   * Log out
   */
  logout() {
   
   /* localStorage.removeItem('user')
    localStorage.removeItem('token')*/
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    this.store.dispatch(new Logout());
    this.router.navigateByUrl(`/auth/login`)

  }
  changepassword() {

    //console.log(this.user$.id)
    const id = this.user$.id
    this.router.navigateByUrl(`/users/edit-user/${id}`)


  }

}
