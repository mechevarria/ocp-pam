import { Component, OnInit, TemplateRef } from '@angular/core';
import { KieService } from '../kie.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnInit {

  svg: SafeHtml
  modalRef: BsModalRef;
  processes: any[] = new Array();

  constructor(private kieService: KieService, private modalService: BsModalService, private sanitizer: DomSanitizer) { }

  viewProcess(template: TemplateRef<any>, processInstanceId: string) {
    this.kieService.getImage(processInstanceId).subscribe(res => {
      this.svg = this.sanitizer.bypassSecurityTrustHtml(res);

      const config: ModalOptions = { class: 'modal-lg' };
      this.modalRef = this.modalService.show(template, config);
    })
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
