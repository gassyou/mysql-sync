import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const mysql = require('mysql');

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private ALL_TABLES_SQL = 'show tables';
  private TABLE_DDL_SQL = 'show create table ?';
  private ALL_COLUMNS_SQL =  'show full columns from ?';
  private ALL_KEYS_SQL = 'show keys from ';
  private ALL_FUN_SQL = `select * from mysql.proc where (type = 'PROCEDURE'  or type = 'FUNCTION') and  db = ?`;

  private PRIMARY_AND_FOREIGN_KEY_SQL = `select
                                          constraint_name,
                                          column_name,
                                          referenced_table_name,
                                          referenced_column_name
                                         from
                                          information_schema.key_column_usage
                                         where
                                          'CONSTRAINT_SCHEMA' = ?
                                         and
                                          'TABLE_NAME' = ?`;

  private UNIQUE_KEY_SQL = `select *
                            from
                              information_schema.key_column_usage
                            where
                              'CONSTRAINT_SCHEMA' = ?
                            and
                              'TABLE_NAME' = ?
                            and
                              'POSITION_IN_UNIQUE_CONSTRAINT' = 1`;

  private INDEX_KEY_SQL = `SELECT
                            DISTINCT (index_name,seq_in_index,column_name)
                          FROM INFORMATION_SCHEMA.STATISTICS
                          WHERE
                            TABLE_SCHEMA = ?
                          and
                            TABLE_NAME = ?
                          and
                            INDEX_NAME != 'primary'`;




  constructor(
  ) {

  }

  createConnection(config: DbConfig): Observable<mysql.Connection> {

    const db = mysql.createConnection(config);

    return new Observable(
      observer => {
        db.connect(
          err => {
            if (err) {
              console.log('Connection error!');
              db.end();
              observer.error(err);
            } else {
              console.log('Connected!');
              observer.next(db);
            }
            observer.complete();
          }
        );
      }
    );

  }

  query(
    connection: mysql.Connection,
    queryString: string,
    values?: string[]
    ): Observable<{results?: object[], fields?: mysql.FieldInfo[]}> {

    return new Observable(observer => {
      connection.query(queryString, values, (err: mysql.MysqlError, results?: object[], fields?: mysql.FieldInfo[]) => {
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

export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}
