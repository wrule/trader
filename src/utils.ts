
export
function CopyError(e: any) {
  return Object.fromEntries(Reflect.ownKeys(e).map((key) => [key, e[key]]));
}
