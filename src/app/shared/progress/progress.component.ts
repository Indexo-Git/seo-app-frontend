import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styles: []
})
export class ProgressComponent implements OnInit {

  @Input() public title = 'Title';
  @Input() public percent = 0;
  @Input() public total = 0;
  @Input() public done = 0;
  @Input() public class = '';
  @Input() public whiteTitle = false;
  @Input() public darkProgress = false;

  constructor() {}

  ngOnInit() {
  }

}
