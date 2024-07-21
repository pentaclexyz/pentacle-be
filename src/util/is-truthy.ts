export const isTruthy = <T>(value: T): value is ExcludeFalsy<T> => {
  return Boolean(value);
};

export type ExcludeFalsy<T> = Exclude<T, undefined | null | false | '' | 0 | 0n>;
