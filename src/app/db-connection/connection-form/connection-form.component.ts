import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompareService } from 'src/app/service/compare.service';

@Component({
  selector: 'app-connection-form',
  templateUrl: './connection-form.component.html',
  styleUrls: ['./connection-form.component.less']
})
export class ConnectionFormComponent implements OnInit {

  connectionForm: FormGroup;
  status = 'error';

  @Input()
  db: string;

  constructor(
    private fb: FormBuilder,
    public compare: CompareService
    ) { }

  ngOnInit() {

    this.connectionForm = this.fb.group({
      dbType: ['mysql', [Validators.required]],
      host: [null, [Validators.required]],
      port: [null, [Validators.required]],
      database: [null, [Validators.required]],
      user: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });


    this.compare.connection$.asObservable().subscribe(
      x => {
        if (x) {
          this.connecting();
        }
      }
    );
  }


  connecting(): void {

    // tslint:disable-next-line: forin
    for (const i in this.connectionForm.controls) {
      this.connectionForm.controls[i].markAsDirty();
      this.connectionForm.controls[i].updateValueAndValidity();
    }

    if (this.connectionForm.valid) {
      console.log(this.connectionForm.value);
      this.compare.doConnect(this.db, {
        host: this.connectionForm.controls.host.value,
        port: this.connectionForm.controls.port.value,
        database: this.connectionForm.controls.database.value,
        user: this.connectionForm.controls.user.value,
        password: this.connectionForm.controls.password.value
      });
    }

  }


}
