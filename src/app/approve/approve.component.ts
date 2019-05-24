import { Component, OnInit } from '@angular/core';
import { KieService } from '../kie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../message/message.service';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html'
})
export class ApproveComponent implements OnInit {
  task: any = null;
  taskInstanceId: number;

  constructor(private kieService: KieService, private route: ActivatedRoute, private messageService: MessageService, private router: Router) { }

  load(taskId: number): void {
    this.kieService.getTask(taskId).subscribe(task => {
      this.task = task;
    });
  }

  approve(): void {
    this.kieService.complete(this.taskInstanceId).subscribe(() => {
      this.messageService.info('Results Approved');
      this.router.navigate(['/home/task']);
    });
  }


  ngOnInit() {
    this.route.queryParams.subscribe(routeParams => {
      if (routeParams.id) {
        this.taskInstanceId = routeParams.id;
        this.load(this.taskInstanceId);
      }
    });
  }

}
