import { IndexedDatabase } from '../indexed-database';

export interface NgConnection {
    [key: string]: IndexedDatabase;
}