import { Fn } from '@nhz/utils';
import { Ref, WatchSource } from 'vue';

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

export { useInterval, useListener, useTimeout, whenTruly };
