import { Component, OnInit } from '@angular/core';
import { KieService } from '../kie.service';
import { MessageService } from '../message/message.service';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html'
})
export class TaskComponent implements OnInit {
  tasks: any[] = new Array();
  
  constructor(private kieService: KieService, private messageService: MessageService, private router: Router) { }

  claimAndStart(taskId: number): void {
    this.kieService.claim(taskId).pipe(
      mergeMap(() => this.kieService.start(taskId))
    ).subscribe(() => {
      this.messageService.info(`Task ${taskId} started`);
      this.go(taskId);
    });
  }

  go(taskId: number): void {
    this.router.navigate(['/home/approve'], { queryParams: { id: taskId } });
  }

  load(): void {
    this.kieService.getTasks().subscribe(res => {
      this.tasks = res['task-summary'];
    });
  }

  ngOnInit() {
    this.load();
  }
}
