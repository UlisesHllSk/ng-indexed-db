import { Injectable } from '@angular/core';
import { Observable, forkJoin, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { NgConnection } from '../types/conecction.type';
import { NgDataBase } from '../types/database.type';
import { NgStore } from '../types/store.type';
import { IndexedDatabase } from '../indexed-database';

@Injectable()
export class NgDatabaseFactory {

  /** Emits an event when all databases recive has been generated */
  connectionsReady = new BehaviorSubject<any>(false);

  /** Indexed database connection factory */
  private factory: IDBFactory = window.indexedDB;

  /** List of all connections handled by the service */
  private connections: NgConnection;

  /** Default connection name */
  private defaultConnectionName: string;

  /**
   * Sends the database metadata to create.
   * Once it has been completed, emits the
   * connectionsReady event
   * @param databases Databases metadata
   */
  createConnnections(databases: NgDataBase[]) {
    this.createDataBases(databases)
    .pipe(
      map(response => this.connections = response),
      switchMap(response => timer(100)),
    )
    .subscribe(() => this.connectionsReady.next(true));
  }
  /**
   * Find a database connection by name. If there isn't
   * a database name takes the default database name
   * @param dbName Name of the database alias
   */
  getDatabase(dbName?: string): IndexedDatabase {
    return this.connections[dbName ? dbName : this.defaultConnectionName];
  }
  /**
   * Open a database connection
   * @param dbName name of the database
   * @param version version of the database
   */
  open(dbName: string, version?: number): Observable<OpenConnectionResponse> {
    return new Observable(observer => {
      let upgraded = false;
      const DBOpenRequest: IDBOpenDBRequest = this.factory.open(dbName, version);

      DBOpenRequest.onupgradeneeded = event => {
        observer.next({
          upgraded: true,
          success: true,
          result: DBOpenRequest.result
        });
        observer.complete();
        upgraded = true;
      };

      DBOpenRequest.onsuccess = event => {
        if (!upgraded) {
          observer.next({
            upgraded: false,
            success: true,
            result: DBOpenRequest.result
          });
          observer.complete();
        }
      };

      DBOpenRequest.onerror = event => {
        observer.error(`Error to connect database ${dbName}`);
        observer.complete();
      };

      DBOpenRequest.onblocked = event => {
        console.log('blocked');
      };

    });
  }
  /**
   * Generates an Observable collection of database connections
   * @param Databases metadata
   */
  createDataBases(databases: NgDataBase[]): Observable<NgConnection> {
    const operators = [];
    let firstIteration = true;
    const createConnnection = (item: NgDataBase) => {
      if (firstIteration) {
        this.defaultConnectionName = item.name;
        firstIteration = false;
      }
      operators.push(this.createConnection(item.name, item.stores, 1));
    };
    databases.forEach(createConnnection);

    const mappingResponse = response => {
      let data = {};
      response.forEach(item => {
        data = {
          ...data,
          ...item
        };
      });

      return data;
    };
    return forkJoin(operators)
      .pipe(
        map(mappingResponse)
      );
  }
  /**
   * Generates a sigle database conecction client
   */
  private createConnection(dbName: string, tables: NgStore[], version?: number): Observable<NgConnection> {
    return this.open(dbName, version)
      .pipe(
        map(data => ({[dbName]: new IndexedDatabase(data.result, data.upgraded, tables)}))
      );
  }
}

interface OpenConnectionResponse {
  success: boolean;
  upgraded: boolean;
  result: IDBDatabase;
}
