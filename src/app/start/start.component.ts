import { Component, OnInit } from '@angular/core';
import { KieService } from '../kie.service';
import { MessageService } from '../message/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html'
})
export class StartComponent implements OnInit {
  filename: string;

  constructor(private kieService: KieService, private messageService: MessageService, private router: Router) { }

  submit() {
    this.kieService.startProcess(this.filename).subscribe(res => {
      this.messageService.success(`Process ${res} started`);
      this.router.navigate(['/home/process']);
    });
  }

  ngOnInit() {
  }

}
