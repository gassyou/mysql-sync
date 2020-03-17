import { Injectable } from '@angular/core';
import { Subject, Observable, of, zip } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Connection, ConnectionConfig } from 'mysql';
import { DbService } from './db.service';
import { Table } from '../mySql/table';
import { String } from 'typescript-string-operations';
import { TableColumn } from '../mySql/table-column';
import { TableKey } from '../mySql/table-key';
import { TableKeyType } from '../mySql/table-key-type';

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


    this.columnFactory(this.leftConnect,"act_cmmn_casedef").subscribe(
      x=>console.log(x)
    );

    this.primaryKeyFactory(this.leftConnect, this.leftConnCofing.database,"act_id_membership").subscribe(
      x=>console.log(x)
    );

    this.foreignKeyFactory(this.leftConnect, this.leftConnCofing.database,"act_ru_execution").subscribe(
      x=>console.log(x)
    );

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


  tableFactory(conn: Connection): Observable<Table[]> {

    return this.db.query(conn,this.db.ALL_TABLES_SQL).pipe(
      map( data => {
       const tables: Table[] = [];
       data.results.map(
        table => {
          zip(
            this.db.query(conn,String.Format(this.db.ALL_COLUMNS_SQL,table)),
            this.db.query(conn,String.Format(this.db.ALL_KEYS_SQL,table)),
            this.db.query(conn,String.Format(this.db.TABLE_DDL_SQL,table)),
          )

         }
      );
       return tables;
      })
    );

  }


  columnFactory(conn: Connection,table: string): Observable<TableColumn[]> {

    const query = String.Format(this.db.ALL_COLUMNS_SQL,table);
    return this.db.query(conn,query).pipe(
      map(
        data => {
          const columns: TableColumn[] = [];
          data.results.map(
            x => {
              columns.push( new TableColumn({
                tableName: table,
                columnName: x['Field'],
                dataType: x['Type'],
                nullable: x['Null']==="YES" ? true : false,
                autoIncrement:  x['Extra']==="auto_increment" ? true : false,
                defaultValue: x['Default'],
                extra: x['Extra'],
                comment: x['Comment']
              }));
            }
          );

          return columns;
        }
      )
    );
  }

  primaryKeyFactory(conn: Connection, schema: string, table: string): Observable<TableKey> {

    const query = String.Format(this.db.PRIMARY_KEY_SQL,schema,table);
    return this.db.query(conn, query).pipe(
      map(
        data => {
          const primaryKey: TableKey = new TableKey({
            tableName: table,
            keyName: TableKeyType.PRIMARY_KEY,
            keyColumns: data.results.map(x=>x['column_name']),
            referenceTable: '',
            referenceColumns: '',
            keyType: TableKeyType.PRIMARY_KEY
          });
          return primaryKey;
        }
      )
    );
  }

  foreignKeyFactory(conn: Connection, schema: string, table: string): Observable<TableKey[]> {

    const query = String.Format(this.db.FOREIGN_KEY_SQL,schema,table);
    return this.db.query(conn, query).pipe(
      map( data => {
        const foreignKeys: TableKey[] = [];

        data.results.map( x=> {
          foreignKeys.push(new TableKey({
            tableName: table,
            keyName: x['CONSTRAINT_NAME'],
            keyColumns: [x['column_name']],
            referenceTable: x['referenced_table_name'],
            referenced_column_name: x['referenced_column_name'],
            keyType: TableKeyType.FOREIGN_KEY
          }));
        });

        return foreignKeys;
      })
    );

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
