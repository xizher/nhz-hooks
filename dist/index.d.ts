import { Fn, Nullable } from '@fssgis/utils';
import * as vue from 'vue';
import { Ref, WatchSource, PropType } from 'vue';

declare type MayBeRef<T> = T | Ref<T>;

declare function useTimeout(callback: MayBeRef<Fn>, ms?: MayBeRef<number>): {
    readonly stop: () => void | undefined;
} & readonly [() => void | undefined];

declare function useInterval(callback: MayBeRef<Fn>, ms?: MayBeRef<number>): {
    readonly stop: () => void | undefined;
} & readonly [() => void | undefined];

declare function useListener(target: MayBeRef<Document | Element>, type: MayBeRef<string>, callback: MayBeRef<EventListenerOrEventListenerObject>): {
    readonly stop: () => void | undefined;
} & readonly [() => void | undefined];

declare function whenTruly<T>(source: WatchSource<Nullable<T>>, callback?: (source: T) => void): Promise<T>;

interface PromiseHook<T> {
    result: T;
    loaded: boolean;
    error: unknown;
    success: boolean;
}
declare function usePromise<T>(promise: MayBeRef<Fn<Promise<T>> | Promise<T>>, initialValue: T): {
    execute: () => Promise<any>;
    result: vue.ToRef<T>;
    loaded: vue.Ref<boolean>;
    error: vue.Ref<unknown>;
    success: vue.Ref<boolean>;
};

declare function makeObjectProp<T>(arg0: true): {
    type: PropType<T>;
    required: true;
};
declare function makeObjectProp<T>(arg0: T): {
    type: PropType<T>;
    default(): T;
};
declare function makeArrayProp<T>(required: true): {
    type: PropType<T[]>;
    required: true;
};
declare function makeArrayProp<T>(required: false): {
    type: PropType<T[]>;
    default(): T[];
};
declare function makeArrayProp<T>(): {
    type: PropType<T[]>;
    default(): T[];
};
declare function makeStringProp(): {
    type: StringConstructor;
    required: true;
};
declare function makeStringProp(arg0: string): {
    type: StringConstructor;
    default: string;
};
declare function makeNumberProp(): {
    type: NumberConstructor;
    required: true;
};
declare function makeNumberProp(arg0: number): {
    type: NumberConstructor;
    default: number;
};
declare function makeFunctionProp<T extends Function>(arg0: true): {
    type: PropType<T>;
    required: true;
};
declare function makeFunctionProp<T extends Function>(arg0: T): {
    type: PropType<T>;
    default(): T;
};

declare function useHandle(fn: Fn<Fn>): Fn;

declare function makeToggle(arg0: boolean): [Ref<boolean>, (val?: boolean) => boolean];
declare function makeToggle(arg0: Ref<boolean>): (val?: boolean) => boolean;

declare function useObjectUrl(obj: MayBeRef<unknown>): {
    readonly url: vue.Ref<string>;
    readonly destory: () => void;
} & readonly [vue.Ref<string>, () => void];

export { PromiseHook, makeArrayProp, makeFunctionProp, makeNumberProp, makeObjectProp, makeStringProp, makeToggle, useHandle, useInterval, useListener, useObjectUrl, usePromise, useTimeout, whenTruly };
