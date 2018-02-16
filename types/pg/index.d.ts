// Type definitions for pg 7.4
// Project: https://github.com/brianc/node-postgres
// Definitions by: Phips Peter <https://github.com/pspeter3>
//                 Arnaud Benhamdine <https://github.com/abenhamdine>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

/// <reference types="node" />

import events = require("events");
import stream = require("stream");
import pgTypes = require("pg-types");

export interface ConnectionConfig {
    user?: string;
    database?: string;
    password?: string;
    port?: number;
    host?: string;
    connectionString?: string;
}

export interface Defaults extends ConnectionConfig {
    poolSize?: number;
    poolIdleTimeout?: number;
    reapIntervalMillis?: number;
    binary?: boolean;
    parseInt8?: boolean;
}

import { TlsOptions } from "tls";

export interface ClientConfig extends ConnectionConfig {
    ssl?: boolean | TlsOptions;
}

export interface PoolConfig extends ClientConfig {
    // properties from module 'node-pool'
    max?: number;
    min?: number;
    connectionTimeoutMillis?: number;
    idleTimeoutMillis?: number;

    application_name?: string;
    Promise?: PromiseConstructorLike;
}

export interface QueryConfig {
    name?: string;
    text: string;
    values?: any[];
}

export interface QueryArrayConfig extends QueryConfig {
    rowMode: 'array';
}

export interface QueryResult<T=any> {
    command: string;
    rowCount: number;
    oid: number;
    rows: T[];
}

export interface FieldDef {
    name: string;
    tableID: number;
    columnID: number;
    dataTypeID: number;
    dataTypeSize: number;
    dataTypeModifier: number;
    format: string;
}

export interface QueryArrayResult<T=any> {
    command: string;
    rowCount: number;
    oid: number;
    rows: T[][];
    fields: FieldDef[];
}

export interface Notification {
    processId: number;
    channel: string;
    payload?: string;
}

export interface ResultBuilder<T=any> extends QueryResult<T> {
    addRow(row: T): void;
}

export class Pool extends events.EventEmitter {
    // `new Pool('pg://user@localhost/mydb')` is not allowed.
    // But it passes type check because of issue:
    // https://github.com/Microsoft/TypeScript/issues/7485
    constructor(config?: PoolConfig);

    readonly totalCount: number;
    readonly idleCount: number;
    readonly waitingCount: number;

    connect(): Promise<PoolClient>;
    connect(callback: (err: Error, client: PoolClient, done: () => void) => void): void;

    end(): Promise<void>;
    end(callback: () => void): void;

    query(queryStream: QueryConfig & stream.Readable): stream.Readable;
    query<T=any>(queryConfig: QueryArrayConfig): Promise<QueryArrayResult<T>>;
    query<T=any>(queryConfig: QueryConfig): Promise<QueryResult<T>>;
    query<T=any>(queryText: string, values?: any[]): Promise<QueryResult<T>>;
    query<T=any>(queryConfig: QueryArrayConfig, callback: (err: Error, result: QueryArrayResult<T>) => void): Query;
    query<T=any>(queryTextOrConfig: string | QueryConfig, callback: (err: Error, result: QueryResult<T>) => void): Query;
    query<T=any>(queryText: string, values: any[], callback: (err: Error, result: QueryResult<T>) => void): Query;

    on(event: "error", listener: (err: Error, client: PoolClient) => void): this;
    on(event: "connect" | "acquire" | "remove", listener: (client: PoolClient) => void): this;
}

export class ClientBase extends events.EventEmitter {
    constructor(config: string | ClientConfig);

    connect(): Promise<void>;
    connect(callback: (err: Error) => void): void;

    query(queryStream: QueryConfig & stream.Readable): stream.Readable;
    query<T=any>(queryConfig: QueryArrayConfig): Promise<QueryArrayResult<T>>;
    query<T=any>(queryConfig: QueryConfig): Promise<QueryResult<T>>;
    query<T=any>(queryText: string, values?: any[]): Promise<QueryResult<T>>;
    query<T=any>(queryConfig: QueryArrayConfig, callback: (err: Error, result: QueryArrayResult<T>) => void): Query;
    query<T=any>(queryTextOrConfig: string | QueryConfig, callback: (err: Error, result: QueryResult<T>) => void): Query;
    query<T=any>(queryText: string, values: any[], callback: (err: Error, result: QueryResult<T>) => void): Query;

    copyFrom(queryText: string): stream.Writable;
    copyTo(queryText: string): stream.Readable;

    pauseDrain(): void;
    resumeDrain(): void;

    escapeIdentifier(str: string): string;
    escapeLiteral(str: string): string;

    on(event: "drain", listener: () => void): this;
    on(event: "error" | "notice", listener: (err: Error) => void): this;
    on(event: "notification", listener: (message: Notification) => void): this;
    // tslint:disable-next-line unified-signatures
    on(event: "end", listener: () => void): this;
}

export class Client extends ClientBase {
    constructor(config: string | ClientConfig);

    end(): Promise<void>;
    end(callback: (err: Error) => void): void;
}

export interface PoolClient extends ClientBase {
    release(err?: Error): void;
}

export class Query extends events.EventEmitter {
    on(event: "row", listener: (row: any, result?: ResultBuilder) => void): this;
    on(event: "error", listener: (err: Error) => void): this;
    on(event: "end", listener: (result: ResultBuilder) => void): this;
}

export class Events extends events.EventEmitter {
    on(event: "error", listener: (err: Error, client: Client) => void): this;
}

export const types: typeof pgTypes;

export const defaults: Defaults & ClientConfig;

import * as Pg from '.';

export const native: typeof Pg | null;
