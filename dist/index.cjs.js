'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');

/**
 * 判断变量是否为 object 类型
 * @param val 变量
 */
/**
 * 判断变量是否为 null 或者 undefined
 * @param val 变量
 */
const isNullable = (val) => typeof val === 'undefined' || val === null;

/**
 * Destructuring with object or array
 * @param obj Destructuring with object
 * @param arr Destructuring with array
 * @link https://antfu.me/posts/destructuring-with-object-or-array
 */
function makeDestructurable(obj, arr) {
    const clone = { ...obj };
    Object.defineProperty(clone, Symbol.iterator, {
        enumerable: false,
        value() {
            let index = 0;
            return {
                next: () => ({
                    value: arr[index++],
                    done: index > arr.length,
                })
            };
        }
    });
    return clone;
}

/**
 * like setInterval
 * @param args Parameters<typeof setInterval>
 * @returns function which can stop the interval handler
 */
function makeInterval(...args) {
    const id = setInterval(...args);
    return () => clearInterval(id);
}
/**
 * like setTimeout
 * @param args Parameters<typeof setTimeout>
 * @returns function which can stop the timeout handler
 */
function makeTimeout(...args) {
    const id = setTimeout(...args);
    return () => clearTimeout(id);
}
/**
 * like addEventListener
 * @param target 目标
 * @param type 监听类型
 * @param listener 监听器
 * @returns function which can stop the listerer
 */
function makeEventListener(target, type, listener) {
    target.addEventListener(type, listener);
    return () => target.removeEventListener(type, listener);
}

function get(target) {
    return vue.unref(target);
}

function useTimeout(callback, ms) {
    let _stop;
    const stop = () => _stop?.();
    vue.watchEffect((onInvalidate) => {
        onInvalidate(() => stop());
        const _callback = get(callback);
        const _ms = get(ms);
        _stop = makeTimeout(_callback, _ms);
    });
    vue.onScopeDispose(() => stop());
    return makeDestructurable({ stop }, [stop]);
}

function useInterval(callback, ms) {
    let _stop;
    const stop = () => _stop?.();
    vue.watchEffect((onInvalidate) => {
        onInvalidate(() => stop());
        const _callback = get(callback);
        const _ms = get(ms);
        _stop = makeInterval(_callback, _ms);
    });
    vue.onScopeDispose(() => stop());
    return makeDestructurable({ stop }, [stop]);
}

function useListener(target, type, callback) {
    let _stop;
    const stop = () => _stop?.();
    vue.watchEffect((onInvalidate) => {
        onInvalidate(() => stop());
        const _target = get(target);
        const _type = get(type);
        const _callback = get(callback);
        _stop = makeEventListener(_target, _type, _callback);
    });
    vue.onScopeDispose(() => stop());
    return makeDestructurable({ stop }, [stop]);
}

function whenTruly(source, callback) {
    let stop = null;
    if (vue.getCurrentScope()) {
        vue.onScopeDispose(() => stop?.());
    }
    return new Promise(resolve => {
        stop = vue.watch(source, val => {
            if (!isNullable(val)) {
                callback?.(val);
                stop?.();
                resolve(val);
            }
        }, { immediate: true });
    });
}

function usePromise(promise, initialValue) {
    promise = vue.ref(promise);
    const state = vue.shallowReactive({
        result: initialValue,
        loaded: false,
        error: null,
        success: vue.computed(() => state.loaded && !state.error)
    });
    const execute = async () => {
        state.loaded = false;
        state.error = null;
        const _promise = get(promise);
        const ret = (typeof _promise === 'function'
            ? _promise() : _promise)
            .then(res => state.result = res)
            .catch(err => state.error = err)
            .finally(() => state.loaded = true);
        return await ret;
    };
    vue.watch(promise, () => execute(), { immediate: true });
    return { ...vue.toRefs(state), execute };
}

function makeObjectProp(arg0) {
    return {
        type: null,
        required: typeof arg0 === 'boolean' ? arg0 : undefined,
        default: typeof arg0 === 'boolean' ? undefined : () => arg0,
    };
}
function makeArrayProp(required) {
    return {
        type: null,
        required: required,
        default: required ? undefined : () => [],
    };
}
function makeStringProp(arg0) {
    return {
        type: String,
        required: arg0 === undefined,
        default: arg0,
    };
}
function makeNumberProp(arg0) {
    return {
        type: Number,
        required: arg0 === undefined,
        default: arg0,
    };
}
function makeFunctionProp(arg0) {
    return {
        type: Function,
        required: typeof arg0 === 'boolean' ? arg0 : undefined,
        default: typeof arg0 === 'boolean' ? undefined : () => arg0,
    };
}

function useHandle(fn) {
    const stop = fn();
    vue.onScopeDispose(() => stop());
    return stop;
}

function makeToggle(arg0) {
    if (typeof arg0 === 'boolean') {
        const bool = vue.ref(arg0);
        const toggle = (val) => {
            if (isNullable(val)) {
                bool.value = !bool.value;
            }
            else {
                bool.value = val;
            }
        };
        return [bool, toggle];
    }
    else {
        const toggle = (val) => {
            if (isNullable(val)) {
                arg0.value = !arg0.value;
            }
            else {
                arg0.value = val;
            }
        };
        return toggle;
    }
}

function useObjectUrl(obj) {
    const url = vue.ref('');
    const destory = () => URL.revokeObjectURL(url.value);
    vue.watchEffect(() => {
        destory();
        const _obj = get(obj);
        url.value = typeof _obj === 'object'
            ? URL.createObjectURL(new Blob([JSON.stringify(_obj)], { type: 'application/json' }))
            : URL.createObjectURL(new Blob([String(_obj)]));
    });
    vue.onScopeDispose(() => destory());
    return makeDestructurable({ url, destory }, [url, destory]);
}

RuleReqiured.errorMsg = 'required';
function RuleReqiured(errorMsg = RuleReqiured.errorMsg) {
    return val => new Promise((resolve, reject) => {
        if (typeof val === 'string' && !val) {
            reject(errorMsg);
        }
        else if (isNullable(val)) {
            reject(errorMsg);
        }
        resolve();
    });
}
RuleMinLength.errorMsg = 'TODO'; // TODO
function RuleMinLength(num, errorMsg = RuleMinLength.errorMsg) {
    return val => new Promise((resolve, reject) => {
        if (isNullable(val) || String(val).length < num) {
            reject(errorMsg);
        }
        else {
            resolve();
        }
    });
}
function useForm({ defaultValues = {}, validateMode = 'change', } = {}) {
    const fieldValues = vue.shallowReactive(defaultValues);
    const errors = vue.shallowReactive({});
    const validators = {};
    const validateField = async (name) => {
        try {
            const value = fieldValues[name];
            const rules = validators[name] ?? [];
            for (const rule of rules) {
                await rule(value);
            }
            errors[name] = undefined;
            return true;
        }
        catch (e) {
            errors[name] = e;
            return false;
        }
    };
    const validateFields = async () => {
        let ret = true;
        for (const name in fieldValues) {
            if (!await validateField(name)) {
                ret = false;
            }
        }
        return ret;
    };
    const makeField = (name, rules = []) => {
        validators[name] = rules;
        // @ts-ignore
        fieldValues[name] ?? (fieldValues[name] = undefined);
        // @ts-ignore
        errors[name] ?? (errors[name] = undefined);
        const field = vue.reactive({
            value: vue.toRef(fieldValues, name),
            error: vue.toRef(errors, name)
        });
        if (validateMode === 'change') {
            vue.watch(() => field.value, () => validateField(name));
        }
        return field;
    };
    const makeSubmit = (fn) => {
        return async () => {
            const result = await validateFields();
            if (result) {
                await fn(fieldValues);
            }
        };
    };
    return {
        fieldValues,
        makeSubmit,
        makeField,
        validateField,
        validateFields,
        errors,
        validators,
    };
}

exports.RuleMinLength = RuleMinLength;
exports.RuleReqiured = RuleReqiured;
exports.makeArrayProp = makeArrayProp;
exports.makeFunctionProp = makeFunctionProp;
exports.makeNumberProp = makeNumberProp;
exports.makeObjectProp = makeObjectProp;
exports.makeStringProp = makeStringProp;
exports.makeToggle = makeToggle;
exports.useForm = useForm;
exports.useHandle = useHandle;
exports.useInterval = useInterval;
exports.useListener = useListener;
exports.useObjectUrl = useObjectUrl;
exports.usePromise = usePromise;
exports.useTimeout = useTimeout;
exports.whenTruly = whenTruly;
