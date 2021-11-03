import { Fn, Nullable } from '@fssgis/utils';
import * as vue from 'vue';
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

declare function whenTruly<T>(source: WatchSource<Nullable<T>>, callback?: (source: T) => void): Promise<T>;

interface PromiseHook<T> {
    result: T;
    loaded: boolean;
    error: unknown;
    success: boolean;
}
declare function usePromise<T>(promise: MayBeRef<Fn<Promise<T>> | Promise<T>>, initialValue: T): vue.ToRefs<PromiseHook<T>>;

declare function makeObjectProp<T>(arg0: true): {
    type: T;
    required: true;
};
declare function makeObjectProp<T>(arg0: T): {
    type: T;
    default(): T;
};
declare function makeArrayProp<T>(required: true): {
    type: T[];
    required: true;
};
declare function makeArrayProp<T>(required: false): {
    type: T;
    default(): T[];
};
declare function makeArrayProp<T>(): {
    type: T;
    default(): T[];
};

declare function useHandle(fn: Fn<Fn>): Fn;

export { PromiseHook, makeArrayProp, makeObjectProp, useHandle, useInterval, useListener, usePromise, useTimeout, whenTruly };
