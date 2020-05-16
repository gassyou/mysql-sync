import { Injectable } from '@angular/core';
import { Subject, Observable, from, of, zip, Subscription} from 'rxjs';
import { map, catchError, mergeMap, toArray,mergeAll} from 'rxjs/operators';
import { Connection, ConnectionConfig } from 'mysql';
import { DbService } from './db.service';
import { Table } from '../mySql/table';
import { String } from 'typescript-string-operations';
import { TableColumn } from '../mySql/table-column';
import { TableKey } from '../mySql/table-key';
import { TableKeyType, KeyType } from '../mySql/table-key-type';
import { TableFunction } from '../mySql/table-func';
import { DomainEvent } from '../common/domain-event';
import { TableView } from '../mySql/table-view';
import { DiffOfTableFunc } from '../mySql/diff-of-table-func';
import { DiffOfTableView } from '../mySql/diff-of-table-view';
import { DiffOfTable } from '../mySql/diff-of-table';

@Injectable({
  providedIn: 'root'
})
export class CompareService {

  public connection$: Subject<boolean> = new Subject();
  public diffItemSelected$: Subject<{left:string, right:string}> = new Subject();

  private leftConnect: Connection = null;
  private rightConnect: Connection = null;

  public leftConnCofing: ConnectionConfig = null;
  public rightConnCofing: ConnectionConfig = null;

  private counter = 0;
  private subscription: Subscription = null;


  public keyCompareNeed = false;
  public functionCompareNeed = false;

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

  isConnected():boolean {
    if(this.leftConnect === null || this.rightConnect === null) {
      return false;
    }
    return true;
  }


  doComparetion(){

    this.counter = 0 ;
    DomainEvent.getInstance().raise('progress', 5);
    console.log(new Date());

    const leftTables$ = this.allTables(this.leftConnect,this.leftConnCofing.database);
    const rightTables$ = this.allTables(this.rightConnect,this.rightConnCofing.database);

    const leftFunctions$ = this.functionFactory(this.leftConnect, this.leftConnCofing.database);
    const rightFunction$ = this.functionFactory(this.rightConnect, this.rightConnCofing.database);

    const leftViews$ = this.viewFactory(this.leftConnect, this.leftConnCofing.database);
    const rightViews$ = this.viewFactory(this.rightConnect, this.rightConnCofing.database);

    this.subscription = zip(leftTables$,rightTables$,leftFunctions$,rightFunction$ ,leftViews$,rightViews$).subscribe(
      ([leftTables,rightTables, leftFunctions, rightFunctions, leftViews, rightViews]) => {

        DomainEvent.getInstance().raise('progress', 95);
        leftTables.forEach(
          left => {
            const right = rightTables.find(x=> x.name === left.name);
            left.findDiff(right);
          }
        );
        rightTables.forEach(
          right => {
            const left = leftTables.find(x=>x.name === right.name);
            if(!left) {
              DomainEvent.getInstance().raise('diff-found', new DiffOfTable({left: null, right: right}));
            }
          }
        );

        leftFunctions.forEach(left => {
          const right = rightFunctions.find(x=>x.name === left.name);
          left.findDiff(right);
        });

        rightFunctions.forEach(right=>{
          const left = leftFunctions.find(x=>x.name === right.name);
          if(!left) {
            DomainEvent.getInstance().raise('diff-found',new DiffOfTableFunc({left: null, right}));
          }
        });


        leftViews.forEach(left => {
          const right = rightViews.find(x=>x.name === left.name);
          left.findDiff(right);
        });

        rightViews.forEach(right=>{
          const left = leftViews.find(x=>x.name === right.name);
          if(!left) {
            DomainEvent.getInstance().raise('diff-found',new DiffOfTableView({left: null, right}));
          }
        });

        DomainEvent.getInstance().raise('progress', 100);
        leftTables = [];
        rightTables = [];
        leftFunctions = [];
        rightFunctions = [];
        leftViews = [];
        rightViews = [];
        console.log(new Date());
    });
  }

  allTables(conn: Connection, schema: string): Observable<Table[]> {
    const allTables$ = this.db.query(conn,this.db.ALL_TABLES_SQL).pipe(
      map(data =>{
        const tables = [];
        data.results.map( x=>{
          tables.push(x['Tables_in_' + schema]);
        });
        return from(tables);
      })
    );

    return allTables$.pipe(
      mergeAll(),
      mergeMap( x =>this.tableFactory(conn,schema,x)),
      toArray()
    );
  }

  tableFactory(conn: Connection, schema: string, tableName: string): Observable<Table> {

    const columnsObservable = this.columnFactory(conn, tableName);
    const keysObservable = this.keyCompareNeed ? this.allKeyFactory(conn, schema,tableName) : of([]);
    const ddlObservable = this.getTableDDL(conn,tableName);
    return zip(columnsObservable,keysObservable,ddlObservable).pipe(
      map(([columns,keys,ddl])=>{

        if(this.counter >= 45) {
          this.counter = this.counter + 0.03
        } else {
          this.counter++
        }
        DomainEvent.getInstance().raise('progress',5 + this.counter);

        return new Table({
          name: tableName,
          columns: columns,
          keys: keys,
          tableDDL: ddl
        })
      })
    );
  }

  getTableDDL(conn:Connection,tableName:string): Observable<String> {
    const query = String.Format(this.db.TABLE_DDL_SQL,tableName);
    return this.db.query(conn,query).pipe(map( data => {
      return data.results[0]['Create Table'];
    }));
  }

  allKeyFactory(conn: Connection, schema: string, table: string): Observable<TableKey[]> {
    const primaryKey = this.primaryKeyFactory(conn, schema,table);
    const foreignKey = this.foreignKeyFactory(conn, schema,table);
    const uniqueKey = this.uniqueKeyFactory(conn, schema,table);
    const indexKey = this.indexKeyFactory(conn, schema,table);

    return  zip(primaryKey,foreignKey,uniqueKey,indexKey).pipe(
      map(([pkeys, fKeys, uKeys,iKeys]) => {
        const results: TableKey[] = pkeys.concat(fKeys,uKeys,iKeys);
        const allKeys: TableKey[] = [];
        results.map(x=>{
          if(!allKeys.find(y=>{ return y.name === x.name})) {
            allKeys.push(x);
          }
        });
        return allKeys;
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
                name: x['Field'],
                tableName: table,
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

  keyFactory(conn:Connection,schema: string,tableName: string): Observable<TableKey[]>{
    const query = String.Format(this.db.ALL_KEYS_SQL2,schema,tableName);
    return this.db.query(conn, query).pipe(map(data => {
      const keys: TableKey[] = [];
      data.results.map(
        x => {
          keys.push(new TableKey({
            name: x['INDEX_NAME'],
            tableName: tableName,
            columnName: x['COLUMN_NAME'],
            referenceTable: x['REFERENCED_TABLE_NAME'] ? x['REFERENCED_TABLE_NAME'] : '',
            referenceColumns: x['REFERENCED_COLUMN_NAME'] ? x['REFERENCED_COLUMN_NAME'] : '',
            keyType: KeyType[x['CONSTRAINT_TYPE']]
          }));
        }
      );
      return keys;
    }));

  }

  primaryKeyFactory(conn: Connection, schema: string, table: string): Observable<TableKey[]> {

    const query = String.Format(this.db.PRIMARY_KEY_SQL,schema,table);
    return this.db.query(conn, query).pipe(
      map(
        data => {
          const primaryKey: TableKey = new TableKey({
            name: TableKeyType.PRIMARY_KEY,
            tableName: table,
            keyColumns: data.results.map(x=>x['column_name']),
            referenceTable: '',
            referenceColumns: '',
            keyType: TableKeyType.PRIMARY_KEY
          });
          return [primaryKey];
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
            name: x['CONSTRAINT_NAME'],
            tableName: table,
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

  uniqueKeyFactory(conn: Connection, schema: string, table: string): Observable<TableKey[]> {
    const query = String.Format(this.db.UNIQUE_KEY_SQL,schema,table);
    return this.db.query(conn, query).pipe(
      map( data => {
        const uniqueKeys: TableKey[] = [];

        data.results.map( x=> {
          uniqueKeys.push(new TableKey({
            name: x['CONSTRAINT_NAME'],
            tableName: table,
            keyColumns: x['COLUMNS_NAME'].split(','),
            referenceTable: '',
            referenced_column_name: '',
            keyType: TableKeyType.UNIQUE_KEY
          }));
        });

        return uniqueKeys;
      })
    );
  }

  indexKeyFactory(conn: Connection, schema: string, table: string): Observable<TableKey[]> {
    const query = String.Format(this.db.INDEX_KEY_SQL,schema,table);
    return this.db.query(conn, query).pipe(
      map( data => {
        const indexKeys: TableKey[] = [];

        data.results.map( x=> {
          indexKeys.push(new TableKey({
            name: x['INDEX_NAME'],
            tableName: table,
            keyColumns: x['COLUMNS_NAME'].split(','),
            referenceTable: '',
            referenced_column_name: '',
            keyType: TableKeyType.INDEX_KEY
          }));
        });

        return indexKeys;
      })
    );
  }

  functionFactory(conn: Connection,schema: string): Observable<TableFunction[]> {

    if(!this.functionCompareNeed) {
      return of([]);
    }


    const query = String.Format(this.db.ALL_FUN_SQL,schema);

    return this.db.query(conn,query).pipe(
      map( data=>{
        const funcitons: TableFunction[] = [];

        data.results.map( x=> {
          funcitons.push(new TableFunction({
            name: x['name'],
            funcType: x['type'],
            funcBody: x['body'],
          }));
        });

        return funcitons;
      })
    );
  }

  viewFactory(conn: Connection, schema: string): Observable<TableView[]> {
    const query = String.Format(this.db.ALL_VIEW_SQL,schema);

    return this.db.query(conn,query).pipe(
      map(data=>{
        const views: TableView[] = [];

        data.results.map( x=> {
          views.push(new TableView({
            name: x['TABLE_NAME'],
            viewBody: x['VIEW_DEFINITION']
          }))
        });
        return views;
      })
    );
  }

  exit() {

    this.subscription.unsubscribe();
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
