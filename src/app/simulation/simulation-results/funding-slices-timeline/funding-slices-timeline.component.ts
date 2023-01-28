import { Component, Input, OnInit } from '@angular/core';
import { TimelinePoint } from './single-dot/single-dot.component';

@Component({
  selector: 'app-funding-slices-timeline',
  templateUrl: './funding-slices-timeline.component.html'
})
export class FundingSlicesTimelineComponent implements OnInit {
  @Input() points: TimelinePoint[];
  @Input() lineColor: string;
  @Input() dotColor: string;

  constructor() { }

  ngOnInit(): void {
  }

}
