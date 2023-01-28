import { Component, Input, OnInit } from '@angular/core';

export class TimelinePoint {
  bottomLabel: string;
  topLabel1: string;
  topLabel2: string;
}

@Component({
  selector: 'app-single-dot',
  templateUrl: './single-dot.component.html',
  styleUrls: ['./single-dot.component.scss']
})
export class SingleDotComponent implements OnInit {
  @Input() point: TimelinePoint;
  @Input() lineColor: string;
  @Input() dotColor: string;

  hover = false;

  dividerStyle: { [klass: string]: any; };
  intervalStyle: { [klass: string]: any; };
  dotStyle: { [klass: string]: any; };
  topLabelStyle: { [klass: string]: any; };

  constructor() { }

  mouseEnter() {
    this.hover = true;
    this.updateStyle();
  }
  mouseLeave() {
    this.hover = false;
    this.updateStyle();
  }

  ngOnInit(): void {
    this.updateStyle();
  }

  updateStyle() {
    this.dividerStyle = {
      'background-color': this.lineColor,
      width: '100px',
      height: '5px'
    };
    this.intervalStyle = {
      'background-color': this.lineColor
    };
    this.dotStyle = {
      'background-color': this.hover ? '#fff' : this.dotColor
    };
    this.topLabelStyle = {
      'background-color': this.hover ? this.dotColor : this.lineColor,
      border: `2px solid ${this.hover ? this.lineColor : this.dotColor}`,
      color: '#fff',
    };
  }

}
