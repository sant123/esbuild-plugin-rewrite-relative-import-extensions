export function rewriteRelativeImportExtension(
  path: string,
  preserveJsx?: boolean,
): string {
  if (!/^\.\.?\//.test(path)) {
    return path;
  }

  return path.replace(
    /\.([jt]sx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i,
    function (m, tsx, d, ext, cm) {
      return tsx
        ? preserveJsx
          ? '.jsx'
          : '.js'
        : d && (!ext || !cm)
        ? m
        : d + ext + '.' + cm.toLowerCase() + 'js';
    },
  );
}
