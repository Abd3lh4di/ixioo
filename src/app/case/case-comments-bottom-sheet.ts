import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-case-comments-bottom-sheet',
  templateUrl: 'case-comments-bottom-sheet.html',
})
export class CaseCommentsBottomSheetComponent {
  constructor(private bottomSheetRef: MatBottomSheetRef<CaseCommentsBottomSheetComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {}

  close(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    // event.preventDefault();
  }
}
