import { unref, getCurrentInstance, onBeforeUnmount, watchEffect } from 'vue';

/**
 * 判断变量是否为 object 类型
 * @param val 变量
 */

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

function tryOnBeforeUnmount(fn) {
  if (getCurrentInstance())
    onBeforeUnmount(fn);
}

function useTimeout(callback, ms) {
    let _stop;
    const stop = () => _stop?.();
    watchEffect(() => {
        stop();
        const _callback = get(callback);
        const _ms = get(ms);
        _stop = makeTimeout(_callback, _ms);
    });
    tryOnBeforeUnmount(() => stop());
    return makeDestructurable({ stop }, [stop]);
}

function useInterval(callback, ms) {
    let _stop;
    const stop = () => _stop?.();
    watchEffect(() => {
        stop();
        const _callback = get(callback);
        const _ms = get(ms);
        _stop = makeInterval(_callback, _ms);
    });
    tryOnBeforeUnmount(() => stop());
    return makeDestructurable({ stop }, [stop]);
}

function useListener(target, type, callback) {
    let _stop;
    const stop = () => _stop?.();
    watchEffect(() => {
        stop();
        const _target = get(target);
        const _type = get(type);
        const _callback = get(callback);
        _stop = makeEventListener(_target, _type, _callback);
    });
    tryOnBeforeUnmount(() => stop());
    return makeDestructurable({ stop }, [stop]);
}

export { useInterval, useListener, useTimeout };
