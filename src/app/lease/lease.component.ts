import { Component, OnInit, Input } from '@angular/core';
import { Lease } from '../table/lease';

@Component({
  selector: 'app-lease',
  templateUrl: './lease.component.html',
  styleUrls: ['./lease.component.css']
})
export class LeaseComponent implements OnInit {
  @Input()
  lease: Lease;

  constructor() { }

  ngOnInit() {
  }

}
