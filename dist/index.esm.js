import { unref, watchEffect, onScopeDispose, watch, reactive, computed, toRefs } from 'vue';

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
    return unref(target);
}

function useTimeout(callback, ms) {
    let _stop;
    const stop = () => _stop?.();
    watchEffect((onInvalidate) => {
        onInvalidate(() => stop());
        const _callback = get(callback);
        const _ms = get(ms);
        _stop = makeTimeout(_callback, _ms);
    });
    onScopeDispose(() => stop());
    return makeDestructurable({ stop }, [stop]);
}

function useInterval(callback, ms) {
    let _stop;
    const stop = () => _stop?.();
    watchEffect((onInvalidate) => {
        onInvalidate(() => stop());
        const _callback = get(callback);
        const _ms = get(ms);
        _stop = makeInterval(_callback, _ms);
    });
    onScopeDispose(() => stop());
    return makeDestructurable({ stop }, [stop]);
}

function useListener(target, type, callback) {
    let _stop;
    const stop = () => _stop?.();
    watchEffect((onInvalidate) => {
        onInvalidate(() => stop());
        const _target = get(target);
        const _type = get(type);
        const _callback = get(callback);
        _stop = makeEventListener(_target, _type, _callback);
    });
    onScopeDispose(() => stop());
    return makeDestructurable({ stop }, [stop]);
}

function whenTruly(source, callback) {
    let stop = null;
    onScopeDispose(() => stop?.());
    return new Promise(resolve => {
        stop = watch(source, val => {
            if (!isNullable(val)) {
                callback?.(val);
                stop?.();
                resolve(val);
            }
        }, { immediate: true });
    });
}

function usePromise(promise, initialValue) {
    const state = reactive({
        result: initialValue,
        loaded: false,
        error: null,
        success: computed(() => state.loaded && !state.error)
    });
    watchEffect(() => {
        const _promise = get(promise);
        if (typeof _promise === 'function') {
            _promise()
                .then(res => {
                state.result = res;
                // state.loaded = true
            })
                .catch(err => {
                state.error = err;
                // state.loaded = true
            })
                .finally(() => state.loaded = true); // sth. wrong
        }
        else {
            _promise
                .then(res => {
                state.result = res;
                // state.loaded = true
            })
                .catch(err => {
                state.error = err;
                // state.loaded = true
            })
                .finally(() => state.loaded = true);
        }
    });
    return toRefs(state);
}

function makeObjectProp(arg0) {
    return {
        type: Object,
        required: typeof arg0 === 'boolean' ? arg0 : undefined,
        default: typeof arg0 === 'boolean' ? undefined : () => arg0,
    };
}
function makeArrayProp(required) {
    return {
        type: Array,
        required: required,
        default: required ? undefined : () => [],
    };
}

export { makeArrayProp, makeObjectProp, useInterval, useListener, usePromise, useTimeout, whenTruly };
