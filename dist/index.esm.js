import { unref, watchEffect, onScopeDispose, getCurrentScope, watch, ref, shallowReactive, computed, toRefs, reactive, toRef } from 'vue';

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
function formatString(str, ...strs) {
    return str.replace(/{([0-9]+)}/g, (match, index) => {
        // check if the argument is present
        return typeof strs[index] === 'undefined' ? match : strs[index];
    });
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
    if (getCurrentScope()) {
        onScopeDispose(() => stop?.());
    }
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
    promise = ref(promise);
    const state = shallowReactive({
        result: initialValue,
        loaded: false,
        error: null,
        success: computed(() => state.loaded && !state.error)
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
    watch(promise, () => execute(), { immediate: true });
    return { ...toRefs(state), execute };
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
    onScopeDispose(() => stop());
    return stop;
}

function makeToggle(arg0) {
    if (typeof arg0 === 'boolean') {
        const bool = ref(arg0);
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
    const url = ref('');
    const destory = () => URL.revokeObjectURL(url.value);
    watchEffect(() => {
        destory();
        const _obj = get(obj);
        url.value = typeof _obj === 'object'
            ? URL.createObjectURL(new Blob([JSON.stringify(_obj)], { type: 'application/json' }))
            : URL.createObjectURL(new Blob([String(_obj)]));
    });
    onScopeDispose(() => destory());
    return makeDestructurable({ url, destory }, [url, destory]);
}

function useForm({ defaultValues = {}, validateMode = 'change', } = {}) {
    const fieldValues = reactive(defaultValues);
    const errors = reactive({});
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
        const field = reactive({
            value: toRef(fieldValues, name),
            error: toRef(errors, name)
        });
        if (validateMode === 'change') {
            watch(() => field.value, () => validateField(name));
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
function validatorsToVxeRules(validators) {
    const ret = {};
    Object.entries(validators).forEach(([key, fns]) => {
        const rules = fns.map(fn => ({
            validator: async (arg0) => {
                try {
                    await fn(arg0.itemValue);
                }
                catch (e) {
                    throw new Error(e);
                }
            }
        }));
        ret[key] = rules;
    });
    return ret;
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
        else {
            resolve();
        }
    });
}
RuleMinLength.errorMsg = 'length must ≥ {0}';
function RuleMinLength(num, errorMsg = formatString(RuleMinLength.errorMsg, num)) {
    return val => new Promise((resolve, reject) => {
        if (isNullable(val) || String(val).length < num) {
            reject(errorMsg);
        }
        else {
            resolve();
        }
    });
}
RuleMaxLength.errorMsg = 'length must ≤ {0}';
function RuleMaxLength(num, errorMsg = formatString(RuleMaxLength.errorMsg, num)) {
    return val => new Promise((resolve, reject) => {
        if (isNullable(val) || String(val).length > num) {
            reject(errorMsg);
        }
        else {
            resolve();
        }
    });
}
RuleMax.errorMsg = 'number must ≤ {0}';
function RuleMax(num, errorMsg = formatString(RuleMax.errorMsg, num)) {
    return val => new Promise((resolve, reject) => {
        if (isNullable(val) || Number(val) > num) {
            reject(errorMsg);
        }
        else {
            resolve();
        }
    });
}
RuleMin.errorMsg = 'number must ≥ {0}';
function RuleMin(num, errorMsg = formatString(RuleMin.errorMsg, num)) {
    return val => new Promise((resolve, reject) => {
        if (isNullable(val) || Number(val) < num) {
            reject(errorMsg);
        }
        else {
            resolve();
        }
    });
}
RuleLengthRange.errorMsg = 'length must ≥ {0} and ≤ {1}';
function RuleLengthRange(min, max, errorMsg = formatString(RuleLengthRange.errorMsg, min, max)) {
    return val => new Promise((resolve, reject) => {
        if (isNullable(val) || String(val).length < min || String(val).length > max) {
            reject(errorMsg);
        }
        else {
            resolve();
        }
    });
}
RuleRange.errorMsg = 'number must ≥ {0} and ≤ {1}';
function RuleRange(min, max, errorMsg = formatString(RuleRange.errorMsg, min, max)) {
    return val => new Promise((resolve, reject) => {
        if (isNullable(val) || Number(val) < min || Number(val) > max) {
            reject(errorMsg);
        }
        else {
            resolve();
        }
    });
}

export { RuleLengthRange, RuleMax, RuleMaxLength, RuleMin, RuleMinLength, RuleRange, RuleReqiured, makeArrayProp, makeFunctionProp, makeNumberProp, makeObjectProp, makeStringProp, makeToggle, useForm, useHandle, useInterval, useListener, useObjectUrl, usePromise, useTimeout, validatorsToVxeRules, whenTruly };
