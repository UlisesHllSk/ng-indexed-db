import { Observable } from 'rxjs';

import { TransactionModes } from './enums/transaction-modes';
import { NgStore } from './types/store.type';
/**
 * IndexedDB client
 */
export class IndexedDatabase {

  /** IndexedBD instance */
  private database: IDBDatabase;

  /** Indicates if databases has been upgraded */
  private upgraded: boolean;

  constructor(
    database: IDBDatabase,
    upgraded: boolean,
    stores: NgStore[] = []
  ) {
    this.database = database;
    this.upgraded = upgraded;
    this.createTables(stores);
  }
  /**
   * If table has been upgrades, generates the recived stores
   * @param tables Tables metadata
   */
  createTables(tables: NgStore[]) {
    if (this.upgraded) {
      tables.forEach(item => this.createTable(item));
    }
  }
  /**
   * Generates one single sotre
   * @param storeName Store name
   */
  createTable(store: NgStore) {
    const keyPath = 'id';
    this.database.createObjectStore(store.name, { keyPath });
  }
  /**
   * Request a list with all store elements
   * @param storeName Store name
   */
  list<M = any>(storeName: string): Observable<M[]> {
    return new Observable<M[]>(observer => {
      const store = this.store(storeName, TransactionModes.READONLY);
      const request = store.getAll();
      request.onsuccess = event => observer.next(request.result);
      request.onerror = event => observer.error(request.error);
    });
  }
  /**
   * Request a single object found by the given key
   * @param storeName Store name
   * @param key Predicate key
   */
  get<M = any>(storeName: string, key: any): Observable<M> {
    return new Observable<M>(observer => {
      const store = this.store(storeName, TransactionModes.READONLY);
      const request = store.get(key);
      request.onsuccess = event => observer.next(request.result);
      request.onerror = event => observer.error(request.error);
    });
  }
  /**
   * Request to store an element
   * @param storeName Store name
   * @param data data to store
   */
  create<M = any>(storeName: string, data: M): Observable<M> {
    return new Observable<M>(observer => {
      const store = this.store(storeName, TransactionModes.READWRITE);
      const request = store.put(data);
      request.onsuccess = event => observer.next(data);
      request.onerror = event => observer.error(request.error);
    });
  }
  /**
   * Request to update an element
   * @param storeName Store name
   * @param data data to store
   */
  update<M = any>(storeName: string, data: M): Observable<M> {
    return new Observable<M>(observer => {
      const store = this.store(storeName, TransactionModes.READWRITE);
      const request = store.put(data);
      request.onsuccess = event => observer.next(data);
      request.onerror = event => observer.error(request.error);
    });
  }
  /**
   * Request to delete an element with the given key
   * @param storeName Store name
   * @param key Element key to delete
   */
  delete(storeName: string, key: IDBValidKey): Observable<boolean> {
    return new Observable<boolean>(observer => {
      const store = this.store(storeName, TransactionModes.READWRITE);
      const request = store.delete(key);
      request.onsuccess = event => observer.next(true);
      request.onerror = event => observer.error(request.error);
    });
  }
  /**
   * Find the a store table by the given name
   * @param storeName Store name to find
   * @param mode Transaction mode
   */
  private store(storeName: string, mode: TransactionModes): IDBObjectStore {
    const transaction: IDBTransaction = this.database.transaction(storeName, mode);
    const store: IDBObjectStore = transaction.objectStore(storeName);
    return store;
  }
}
