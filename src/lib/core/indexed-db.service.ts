import { Injectable, InjectionToken, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, skipWhile } from 'rxjs/operators';

import { NgDataBase } from './types/database.type';
import { NgDatabaseFactory } from './factory/database-factory';
import { IdGenerator } from './id-generator/id-generator';


/** Injection token that gives the databases metadata */
export const NG_DATABASES = new InjectionToken<{element: any}>('NG_DATABASES');

/**
 * Service that handles all Indexed Databases and
 * tables requests.
 */
@Injectable()
export class IndexedDB {
  /**
   * Indicates if all databases have been created.
   * Only emits an event when recives a true value.
   */
  get onReady() {
    return this.databaseFactory.connectionsReady
      .pipe(skipWhile((event: boolean) => !event));
  }

  constructor(
    @Inject(NG_DATABASES) private databases: NgDataBase[],
    private idGenerator: IdGenerator,
    private databaseFactory: NgDatabaseFactory,
  ) {
    this.databaseFactory.createConnnections(this.databases);
  }
  /**
   * Request a list with all elements
   * @param storeName Store name
   * @param databaseName Database name
   */
  list<M = any>(storeName: string, databaseName?: string): Observable<M[]> {
    return this.onReady.pipe(
      switchMap(
        () => this.databaseFactory.getDatabase(databaseName).list<M>(storeName)
      )
    );
  }
  /**
   * Request an element by key
   * @param storeName Store name
   * @param key Key value to find the element
   * @param databaseName Database name
   */
  get<M = any>(storeName: string, key: any, databaseName?: string): Observable<M> {
    return this.onReady.pipe(
      switchMap(
        () => this.databaseFactory.getDatabase(databaseName).get<M>(storeName, key)
      )
    );
  }
  /**
   * Request to store an element
   * @param storeName Store name
   * @param databaseName Database name
   */
  create<M = any>(storeName: string, data: M, databaseName?: string): Observable<M> {
    // tslint:disable-next-line: no-string-literal
    if (!data['id']) { data['id'] = this.idGenerator.generate(); }
    return this.onReady.pipe(
      switchMap(
        () => this.databaseFactory.getDatabase(databaseName).create<M>(storeName, data)
      )
    );
  }
  /**
   * Request to update a stored element
   * @param storeName Store name
   * @param databaseName Database name
   */
  update<M = any>(storeName: string, data: M, databaseName?: string): Observable<M> {
    return this.onReady.pipe(
      switchMap(
        () => this.databaseFactory.getDatabase(databaseName).update<M>(storeName, data)
      )
    );
  }
  /**
   * Request to delete a stored element
   * @param storeName Store name
   * @param databaseName Database name
   */
  delete(storeName: string, key: IDBValidKey, databaseName?: string): Observable<boolean> {
    return this.onReady.pipe(
      switchMap(
        () => this.databaseFactory.getDatabase(databaseName).delete(storeName, key)
      )
    );
  }

}
