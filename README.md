# ng-indexed-db

ng-indexed-db is an Angular module that wraps IndexedDB API in RXJS, transforming it into Observable

## Installation

```shell
  npm install ng-indexed-db
```

## Usage
Import the `IndexedDBModule` into your Module:
```typescript
  import { IndexedDBModule } from "ng-indexed-db";

  @NgModule({
    imports: [
      IndexedDBModule.forRoot([
        {
          name: 'todo_database',
          stores: [{ name: 'todo_store' }]
        }
      ])
    ]
  })
  export class AppModule {}
```
IndexedDBModule forRoot method requires a database metadata collection  to create all the databases and table storage defined in the metadata.  
**Note:** IndexedDBModule takes the firts element of the databases collections as **Default Database**

Database metadata type:
```typescript
  {
    // Database name
    name: string;
    // Stores collections
    stores: {
      // Store name
      name: string;
    }[];
  }
```
All generated stores will have a keyPath with the value: 'id'

Inject the `IndexedDB` service into your component.
```typescript
  export class AppComponent {

    $list: Observable<any>;

    constructor(
      private indexedDbService: IndexedDB
    ) {
      this.$list = this.indexedDbService.list('todo_table');
    }
  }
```
## Methods
All methods recive an optional parameter that dfines the database name. If it doesn't recive a database name, the service takes the default database to do store requests.

**list(storeName: string, databaseName?: string)**  
Returns an Observable with the table list result.
```typescript
  this.indexedDbService.list('todo_table').subscribe(
    response => // handle IndexedDb list result
    error => // handle IndexedDb request error
  );
```  

**create(storeName: string, data: any, databaseName?: string)**  
Store the given data.
```typescript
  this.indexedDbService.create('todo_table', {name: 'todo name'}).subscribe(
    response => // handle IndexedDb store result
    error => // handle IndexedDb request error
  );
```  

**update(storeName: string, data: any, databaseName?: string)**  
Updated stored data.
```typescript
  this.indexedDbService.update('todo_table', {name: 'todo name'}).subscribe(
    response => // handle IndexedDb update result
    error => // handle IndexedDb request error
  );
```  

**get(storeName: string, key: any, databaseName?: string)**  
Returns an Observable with the object found in the table by the given key
```typescript
  this.indexedDbService.get('todo_table', 'todo name').subscribe(
    response => // handle IndexedDb update result
    error => // handle IndexedDb request error
  );
```  

**delete(storeName: string, key: any, databaseName?: string)**  
Returns an Observable with the object found in the table by the given key
```typescript
  this.indexedDbService.delete('todo_table', 'todo name').subscribe(
    response => // handle IndexedDb update result
    error => // handle IndexedDb request error
  );
```


