usePromise

# usePromise

## Table of contents

### References

- [usePromise](README.md#usepromise)

### Interfaces

- [PromiseHook](interfaces/PromiseHook.md)

### Functions

- [default](README.md#default)

## References

### usePromise

Renames and re-exports [default](README.md#default)

## Functions

### default

▸ **default**<`T`\>(`promise`, `initialValue`): `ToRefs`<[`PromiseHook`](interfaces/PromiseHook.md)<`T`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `promise` | `MayBeRef`<`Promise`<`T`\> \| `Fn`<`Promise`<`T`\>\>\> |
| `initialValue` | `T` |

#### Returns

`ToRefs`<[`PromiseHook`](interfaces/PromiseHook.md)<`T`\>\>

#### Defined in

[usePromise.ts:12](https://github.com/xizher/nhz-hooks/blob/1c01629/src/usePromise/usePromise.ts#L12)
