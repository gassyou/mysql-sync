import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Connection, ConnectionConfig } from 'mysql';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class CompareService {

  public connection$: Subject<boolean> = new Subject();
  public leftDbConnectionOk$: Subject<Connection> = new Subject();
  public rightDbConnectionOk$: Subject<Connection> = new Subject();

  private leftConnect: Connection = null;
  private rightConnect: Connection = null;


  constructor(
    public db: DbService
  ) { }


  doConnect(db, dbConfig: ConnectionConfig) {

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
