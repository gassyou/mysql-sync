import { Injectable } from '@angular/core';
import { Subject, Observable, of, zip } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Connection, ConnectionConfig } from 'mysql';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class CompareService {

  public connection$: Subject<boolean> = new Subject();

  private leftConnect: Connection = null;
  private rightConnect: Connection = null;

  public leftConnCofing: ConnectionConfig = null;
  public rightConnCofing: ConnectionConfig = null;

  constructor(
    public db: DbService
  ) { }

  doConnect(db:string, dbConfig: ConnectionConfig):Observable<any> {

    return this.db.createConnection(dbConfig).pipe(
      map(conn=>{

        if(db === 'left') {
          this.leftConnect = conn;
          this.leftConnCofing = dbConfig;
        } else {
          this.rightConnect = conn;
          this.rightConnCofing = dbConfig;
        }

        return {db:db,result:true};
    }),
    catchError(err => {
      console.log(err);
      return of({db:db,result:false});
    })
    );
  }

  doComparetion():boolean {
    if(this.leftConnect === null || this.rightConnect === null) {
      return false;
    }

    const leftTable = [];
    const rightTable = [];

    zip(
      this.db.query(this.leftConnect,this.db.ALL_TABLES_SQL),
      this.db.query(this.rightConnect,this.db.ALL_TABLES_SQL)
    ).subscribe(
      res => {
        res[0].results.map(
          table => {
            leftTable.push(table['Tables_in_' + this.leftConnCofing.database]);
          }
        );

        res[1].results.map(
          table => {
            rightTable.push(table['Tables_in_' + this.rightConnCofing.database]);
          }
        );



      }
    );
    return true;
  }

  exit() {
    if(this.leftConnect) {
      this.leftConnect.end();
    }

    if(this.rightConnect) {
      this.rightConnect.end();
    }

    this.leftConnect = null;
    this.rightConnect = null;
    this.leftConnCofing = null;
    this.rightConnCofing = null;
  }


}
