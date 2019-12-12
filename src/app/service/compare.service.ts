import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DbService, DbConfig } from './db.service';

import * as mysql from 'mysql';

@Injectable({
  providedIn: 'root'
})
export class CompareService {

  public connection$: Subject<boolean> = new Subject();
  public leftDbConnectionOk$: Subject<mysql.Connection> = new Subject();
  public rightDbConnectionOk$: Subject<mysql.Connection> = new Subject();

  private leftConnect: mysql.Connection = null;
  private rightConnect: mysql.Connection = null;


  constructor(
    public db: DbService
  ) { }


  doConnect(db, dbConfig: DbConfig) {

    if (db === 'left') {
      console.log(dbConfig);

      this.db.createConnection(dbConfig).subscribe(
        conn => {
          this.leftConnect = conn;
          console.log(this.leftConnect);
        }
      );

    } else {
      this.db.createConnection(dbConfig).subscribe(
        conn => {
          this.rightConnect = conn;
          console.log(this.rightConnect);
        }
      );
    }

  }

}
