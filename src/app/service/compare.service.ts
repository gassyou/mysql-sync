import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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

  doConnect(db, dbConfig: ConnectionConfig):Observable<boolean> {
    console.log(dbConfig);
    return this.db.createConnection(dbConfig).pipe(
      map(conn=>{
        if(db === 'left') {
          this.leftConnect = conn;
        } else {
          this.rightConnect = conn;
        }
        return true;
    }),
    catchError(err => {
      console.log(err);
      return of(false);
    })
    );
  }

}
