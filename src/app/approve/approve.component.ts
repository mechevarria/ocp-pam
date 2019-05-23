import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KieService } from '../detail/kie.service';
import { MessageService } from '../message/message.service';
import { LeaseService } from '../table/lease.service';
import { Lease } from '../table/lease';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css']
})
export class ApproveComponent implements OnInit {
  task: any;
  lease: Lease;
  constructor(
    private route: ActivatedRoute,
    private kieService: KieService,
    private messageService: MessageService,
    private router: Router,
    private leaseService: LeaseService
  ) {
    this.task = {};
  }

  load(taskId: number): void {
    this.kieService.getTask(taskId).subscribe(task => {
      this.task = task;
      this.leaseService.getByProcessId(this.task['task-process-instance-id']).subscribe(lease => {
        this.lease = lease;
      });
    });
  }

  approve(): void {
    this.kieService.complete(this.task['task-id'], 'Approved').subscribe(() => {
      this.messageService.info('Lease Approved');
      this.router.navigate(['/home/task']);
    });
  }

  reject(): void {
    this.kieService.complete(this.task['task-id'], 'Rejected').subscribe(() => {
      this.messageService.info('Lease Rejected');
      this.router.navigate(['/home/task']);
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(routeParams => {
      if (routeParams.id) {
        this.load(routeParams.id);
      }
    });
  }
}
