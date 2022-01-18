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
declare function makeObjectProp<T>(arg0: Nullable<T>): {
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
declare function makeStringProp(arg0: Nullable<string>): {
    type: StringConstructor;
    default: string;
};
declare function makeNumberProp(): {
    type: NumberConstructor;
    required: true;
};
declare function makeNumberProp(arg0: Nullable<number>): {
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

declare type ValidateMode = 'change' | 'submit';
declare type FromOptions<T> = {
    defaultValues?: Partial<T>;
    validateMode?: ValidateMode;
};
declare type Errors = {
    [field: string]: string | undefined;
};
declare type RuleType<T = unknown> = (val: T) => Promise<void>;
declare function useForm<T extends object>({ defaultValues, validateMode, }?: FromOptions<T>): {
    fieldValues: T;
    makeSubmit: (fn: (data: T) => void) => Fn<Promise<void>>;
    makeField: <K extends keyof T>(name: K, rules?: RuleType<T[K]>[]) => {
        value: T[keyof T];
        error: string;
    };
    validateField: (name: keyof T) => Promise<boolean>;
    validateFields: () => Promise<boolean>;
    errors: {
        [x: string]: string | undefined;
    };
    validators: Record<string, RuleType<unknown>[]>;
};
declare function validatorsToVxeRules(validators: Record<string, RuleType[]>): Record<string, {
    validator: Function;
}[]>;
declare function RuleReqiured(errorMsg?: string): RuleType;
declare namespace RuleReqiured {
    var errorMsg: string;
}
declare function RuleMinLength(num: number, errorMsg?: string): RuleType;
declare namespace RuleMinLength {
    var errorMsg: string;
}
declare function RuleMaxLength(num: number, errorMsg?: string): RuleType;
declare namespace RuleMaxLength {
    var errorMsg: string;
}
declare function RuleMax(num: number, errorMsg?: string): RuleType;
declare namespace RuleMax {
    var errorMsg: string;
}
declare function RuleMin(num: number, errorMsg?: string): RuleType;
declare namespace RuleMin {
    var errorMsg: string;
}
declare function RuleLengthRange(min: number, max: number, errorMsg?: string): RuleType;
declare namespace RuleLengthRange {
    var errorMsg: string;
}
declare function RuleRange(min: number, max: number, errorMsg?: string): RuleType;
declare namespace RuleRange {
    var errorMsg: string;
}

declare type PaginationOptions = {
    pageSize?: number;
    pageIndex?: number;
};
declare function usePagination<T>(source: MayBeRef<T[] | ((options: {
    returnTotal: (total: number) => void;
    pageSize: number;
    pageIndex: number;
}) => Promise<T[]>)>, { pageIndex, pageSize }?: PaginationOptions): vue.ToRefs<vue.ShallowReactive<{
    pageIndex: number;
    pageSize: number;
    total: number;
    data: T[];
}>>;

export { Errors, PaginationOptions, PromiseHook, RuleLengthRange, RuleMax, RuleMaxLength, RuleMin, RuleMinLength, RuleRange, RuleReqiured, RuleType, makeArrayProp, makeFunctionProp, makeNumberProp, makeObjectProp, makeStringProp, makeToggle, useForm, useHandle, useInterval, useListener, useObjectUrl, usePagination, usePromise, useTimeout, validatorsToVxeRules, whenTruly };
