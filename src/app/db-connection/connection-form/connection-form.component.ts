import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-connection-form',
  templateUrl: './connection-form.component.html',
  styleUrls: ['./connection-form.component.less']
})
export class ConnectionFormComponent implements OnInit {

  connectionForm: FormGroup;
  status = 'error';

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

    this.connectionForm = this.fb.group({
      dbType: ['mysql', [Validators.required]],
      host: [null, [Validators.required]],
      port: [null, [Validators.required]],
      db: [null, [Validators.required]],
      user: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });

  }


  connecting(): void {

    // tslint:disable-next-line: forin
    for (const i in this.connectionForm.controls) {
      this.connectionForm.controls[i].markAsDirty();
      this.connectionForm.controls[i].updateValueAndValidity();
    }

  }


}
