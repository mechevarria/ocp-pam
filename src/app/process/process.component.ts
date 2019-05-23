import { Component, OnInit } from '@angular/core';
import { KieService } from '../kie.service';
import { MessageService } from '../message/message.service';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnInit {

  processes: any[];

  constructor(private kieService: KieService, private messageService: MessageService) { }

  viewProcess(processInstanceId: number): void {
    this.messageService.info(`View process ${processInstanceId}`);
  }

  load(): void {
    this.kieService.getProcesses().subscribe(res => {
      this.processes = res['process-instance'];
    });
  }

  ngOnInit() {
    this.load();
  }

}
