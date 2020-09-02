import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less'],
  providers: [DatePipe],
})
export class FooterComponent implements OnInit {
  currentDate = new Date();
  currentYear: string;

  constructor(private datePipe: DatePipe) {
    this.currentYear = this.datePipe.transform(this.currentDate, 'yyyy');
  }

  ngOnInit(): void {}
}
