import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-file-creation-person-tabs',
  templateUrl: './file-creation-person-tabs.component.html',
  styleUrls: ['./file-creation-person-tabs.component.scss']
})
export class FileCreationPersonTabsComponent implements OnInit {

  @Input() casesName;
  @Input() activeBorrower = 0;
  @Input() entityName: string;
  @Input() entitySelected = false;
  @Output() selectPerson = new EventEmitter<number>();
  @Output() selectEntity = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
