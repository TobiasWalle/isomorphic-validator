export type DeepPartial<T> = {[key in keyof T]?: DeepPartial<T[keyof T]>};