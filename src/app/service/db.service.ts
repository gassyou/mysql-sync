import { Injectable } from '@angular/core';
import { Connection, ConnectionConfig, FieldInfo, MysqlError } from 'mysql';
import { Observable } from 'rxjs';
const mysql = require('mysql');

@Injectable({
  providedIn: 'root'
})
export class DbService {

  public ALL_TABLES_SQL = 'show tables';
  public TABLE_DDL_SQL = 'show create table {0}';
  public ALL_COLUMNS_SQL =  'show full columns from {0}';
  public ALL_KEYS_SQL = 'show keys from {0}';
  public ALL_FUN_SQL = `select * from mysql.proc where (type = 'PROCEDURE'  or type = 'FUNCTION') and  db = {0}`;

  public PRIMARY_KEY_SQL = `select
                              column_name
                            from
                              information_schema.key_column_usage
                            where
                              CONSTRAINT_SCHEMA = '{0}'
                              and TABLE_NAME = '{1}'
                              and constraint_name = 'PRIMARY'
                            order by ORDINAL_POSITION`;

  public FOREIGN_KEY_SQL = `select
                              CONSTRAINT_NAME,
                              table_name,
                              column_name,
                              referenced_table_name,
                              referenced_column_name
                            from
                              information_schema.key_column_usage
                            where
                              CONSTRAINT_SCHEMA = '{0}'
                              and TABLE_NAME = '{1}'
                              and (REFERENCED_TABLE_NAME != null or REFERENCED_TABLE_NAME != '')
                            order by ORDINAL_POSITION`;

  public UNIQUE_KEY_SQL = `select *
                            from
                              information_schema.key_column_usage
                            where
                              CONSTRAINT_SCHEMA = '{0}'
                            and
                              TABLE_NAME = '{1}'
                            and
                              POSITION_IN_UNIQUE_CONSTRAINT = '{2}'`;

  public INDEX_KEY_SQL = `SELECT
                            DISTINCT (index_name,seq_in_index,column_name)
                          FROM INFORMATION_SCHEMA.STATISTICS
                          WHERE
                            TABLE_SCHEMA = '{0}'
                          and
                            TABLE_NAME = '{1}'
                          and
                            INDEX_NAME != 'primary'`;




  constructor() { }

  createConnection(config: ConnectionConfig): Observable<Connection> {
    const db = mysql.createConnection(config);
    return new Observable(
      observer => {
        db.connect(
          err => {
            if (err) {
              db.end();
              observer.error(err);
            } else {
              observer.next(db);
            }
            observer.complete();
          }
        );
      }
    );
  }

  query(connection: Connection, queryString: string, values?: string[]): Observable<{results?: object[], fields?: FieldInfo[]}> {
    return new Observable(observer => {
      connection.query(queryString, values, (err: MysqlError, results?: object[], fields?: FieldInfo[]) => {
        if (err) {
          observer.error(err);
        } else {
          observer.next({ results, fields });
        }
        observer.complete();
      });
    });
  }
}
