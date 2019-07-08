import { TestBed, async, getTestBed, inject } from '@angular/core/testing';
import { NgDataBase } from './types/database.type';
import { IndexedDB } from './indexed-db.service';
import { IndexedDBModule } from '../indexed-db.module';

const DATABASES: NgDataBase[] = [
  {
    name: 'todo_database',
    stores: [
      { name: 'todo_store'}
    ]
  },
];

interface Todo {
  id?: number;
  name: string;
}

describe('IndexedDBService', () => {
  const testbend = getTestBed();
  let databaseService: IndexedDB;

  beforeEach(async(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    TestBed.configureTestingModule({
      imports: [
        IndexedDBModule.forRoot(DATABASES)
      ]
    });
    databaseService = TestBed.get(IndexedDB);
  }));

  it('Should create connections', async(() => {
    // onReady wrapper only must emit a true value
    databaseService.onReady.subscribe(
      response => expect(response).toBeTruthy(),
      error => fail(error)
    );
  }));

  it('Should request tables', async(() => {
    // Request response must be an array
    databaseService.list<Todo>('todo_store')
      .subscribe(
        response => expect(response).toEqual(jasmine.any(Array)),
        error => fail(error)
      );
  }));

  it('Should request to persit data', async(() => {
    // Request response must be the data sended
    databaseService.create<Todo>('todo_store', {id: 1, name: 'todo name'})
      .subscribe(
        response => expect(response).toEqual(jasmine.objectContaining({id: 1, name: 'todo name'})),
        error => fail(error)
      );
  }));

  it('Should request to update data', async(() => {
    // Request response must be the data sended
    databaseService.update<Todo>('todo_store', {id: 1, name: 'todo name updated'})
      .subscribe(
        response => expect(response).toEqual(jasmine.objectContaining({name: 'todo name updated'})),
        error => fail(error)
      );
  }));

  it('Should request to delete data', async(() => {
    // Request response must be a true value
    databaseService.delete('todo_store', 1)
      .subscribe(
        response => expect(response).toBeTruthy(),
        error => fail(error)
      );
  }));

  afterAll(async(() => {
    setTimeout(() => {
      const req = indexedDB.deleteDatabase('todo_database');
      req.onsuccess = () => console.log('Deleted database successfully');
      req.onerror = () => console.error('Couldn\'t delete database');
      req.onblocked = () => console.log('Couldn\'t delete database due to the operation being blocked');
    }, 2000);
  }));

});
