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

  private leftConnect: Connection = null;
  private rightConnect: Connection = null;

  constructor(
    public db: DbService
  ) { }

  doConnect(db:string, dbConfig: ConnectionConfig):Observable<any> {

    return this.db.createConnection(dbConfig).pipe(
      map(conn=>{

        if(db === 'left') {
          this.leftConnect = conn;
        } else {
          this.rightConnect = conn;
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


    return true;
  }


}
