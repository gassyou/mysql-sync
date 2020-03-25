import { Injectable } from '@angular/core';
import { Connection, ConnectionConfig, FieldInfo, MysqlError } from 'mysql';
import { Observable } from 'rxjs';
const mysql = require('mysql');

@Injectable({
  providedIn: 'root'
})
export class DbService {

  public ALL_TABLES_SQL = `show full tables where Table_type = 'BASE TABLE'`;
  public ALL_VIEW_SQL = `SELECT * FROM information_schema.views where TABLE_SCHEMA = '{0}'`;
  public TABLE_DDL_SQL = 'show create table {0}';
  public ALL_COLUMNS_SQL = 'show full columns from {0}';
  public ALL_KEYS_SQL = 'show keys from {0}';
  public ALL_FUN_SQL = `select name,type,CAST(body AS CHAR) as body from mysql.proc where (type = 'PROCEDURE'  or type = 'FUNCTION') and  db='{0}'`;

  public ALL_KEYS_SQL2 = `select
                            TABLE_NAME ,
                            INDEX_NAME ,
                            GROUP_CONCAT(COLUMN_NAME)as COLUMNS_NAME,
                            IFNULL(CONSTRAINT_TYPE, "KEY") as CONSTRAINT_TYPE,
                            REFERENCED_TABLE_NAME,
                            REFERENCED_COLUMN_NAME
                          from
                            (
                            select
                              distinct
                              a.TABLE_NAME ,
                              a.INDEX_NAME ,
                              a.COLUMN_NAME,
                              b.CONSTRAINT_TYPE,
                              c.REFERENCED_TABLE_NAME,
                              c.REFERENCED_COLUMN_NAME
                            from
                              INFORMATION_SCHEMA.STATISTICS as a
                            left join (
                              select
                                TABLE_SCHEMA ,
                                TABLE_NAME ,
                                CONSTRAINT_NAME ,
                                CONSTRAINT_TYPE
                              from
                                information_schema.TABLE_CONSTRAINTS
                              where
                                CONSTRAINT_SCHEMA = '{0}'
                                and table_name = '{1}' ) as b on
                              a.INDEX_NAME = b.CONSTRAINT_NAME
                            left join (
                              select
                                TABLE_SCHEMA ,
                                TABLE_NAME ,
                                CONSTRAINT_NAME ,
                                REFERENCED_TABLE_NAME ,
                                REFERENCED_COLUMN_NAME
                              from
                                information_schema.key_column_usage
                              where
                                CONSTRAINT_SCHEMA = '{0}'
                                and table_name = '{1}'  ) as c on
                              a.INDEX_NAME = c.CONSTRAINT_NAME
                            where
                              a.TABLE_SCHEMA = '{0}'
                              and a.table_name = '{1}'
                            order by
                              index_name,
                              COLUMN_NAME ) as d
                          group by
                            d.TABLE_NAME ,
                            d.INDEX_NAME ,
                            d.CONSTRAINT_TYPE,
                            d.REFERENCED_TABLE_NAME,
                            d.REFERENCED_COLUMN_NAME`;

  public PRIMARY_KEY_SQL = `select
                              column_name
                            from
                              information_schema.key_column_usage
                            where
                              CONSTRAINT_SCHEMA = '{0}'
                              and TABLE_NAME = '{1}'
                              and constraint_name = 'PRIMARY'`;

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
                              and (REFERENCED_TABLE_NAME != null or REFERENCED_TABLE_NAME != '')`;

  public UNIQUE_KEY_SQL = `select
                            c.TABLE_NAME ,
                            c.CONSTRAINT_NAME,
                            GROUP_CONCAT(c.COLUMN_NAME ORDER BY c.COLUMN_NAME)as COLUMNS_NAME
                          from
                            (
                            select
                              distinct a.TABLE_NAME ,
                              a.CONSTRAINT_NAME ,
                              b.COLUMN_NAME
                            from
                              information_schema.TABLE_CONSTRAINTS as a
                            left join information_schema.key_column_usage as b on
                              a.CONSTRAINT_NAME = b.CONSTRAINT_NAME
                            where
                              a.CONSTRAINT_SCHEMA = '{0}'
                              and a.CONSTRAINT_TYPE = 'UNIQUE'
                              and a.TABLE_NAME = '{1}') as c
                          group by
                            c.TABLE_NAME ,
                            c.CONSTRAINT_NAME `;

  public INDEX_KEY_SQL = `select
                            c.TABLE_NAME,
                            c.INDEX_NAME,
                            GROUP_CONCAT(c.COLUMN_NAME ORDER BY c.COLUMN_NAME)as COLUMNS_NAME
                          from
                            (
                            select
                              distinct TABLE_NAME ,
                              INDEX_NAME ,
                              COLUMN_NAME
                            from
                              INFORMATION_SCHEMA.STATISTICS
                            where
                              TABLE_SCHEMA = '{0}'
                              and TABLE_NAME = '{1}'
                              and INDEX_NAME != 'primary') as c
                          group by
                            c.TABLE_NAME ,
                            c.INDEX_NAME`;
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
