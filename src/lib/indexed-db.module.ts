import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexedDB, NG_DATABASES } from './core/indexed-db.service';

import { NgDatabaseFactory } from './core/factory/database-factory';
import { IdGenerator } from './core/id-generator/id-generator';
import { NgDataBase } from './core/types/database.type';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
  providers: [
    IndexedDB,
    NgDatabaseFactory,
    IdGenerator,
  ],
})
export class IndexedDBModule {
  static forRoot(databases: NgDataBase[] = []): ModuleWithProviders {
    return {
      ngModule: IndexedDBModule,
      providers: [
        { provide: NG_DATABASES, useValue: databases }
      ]
    };
  }
}
