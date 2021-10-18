import { Fn } from '@nhz/utils';
import * as vue from 'vue';
import { Ref, WatchSource } from 'vue';
import { Fn as Fn$1 } from 'utils';

declare type MayBeRef<T> = T | Ref<T>;

declare function useTimeout(callback: MayBeRef<Fn>, ms?: MayBeRef<number>): {
    readonly stop: () => void | undefined;
} & readonly [() => void | undefined];

declare function useInterval(callback: MayBeRef<Fn>, ms?: MayBeRef<number>): {
    readonly stop: () => void | undefined;
} & readonly [() => void | undefined];

declare function useListener(target: MayBeRef<Document | Element>, type: MayBeRef<string>, callback: MayBeRef<Fn>): {
    readonly stop: () => void | undefined;
} & readonly [() => void | undefined];

/**
 * Null or whatever
 */
declare type Nullable<T> = T | null | undefined;

declare function whenTruly<T>(source: WatchSource<Nullable<T>>, callback: (source: T) => void): void;

interface PromiseHook<T> {
    result: T;
    loaded: boolean;
    error: unknown;
    success: boolean;
}
declare function usePromise<T>(promise: MayBeRef<Fn$1<Promise<T>> | Promise<T>>, initialValue: T): vue.ToRefs<PromiseHook<T>>;

export { PromiseHook, useInterval, useListener, usePromise, useTimeout, whenTruly };
