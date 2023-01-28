import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html'
})
export class PartnersComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  editPartner(partner) {
    console.log('EDIT: ', partner)
    this.router.navigate(['partner', partner.id ]);

  }

}
