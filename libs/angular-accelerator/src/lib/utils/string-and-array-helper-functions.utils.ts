export function findEntryWithKeyword(
  array: string[] | undefined,
  keyword: string,
): string | null {
  const entry = array?.find((entry) => entry.includes(keyword));
  return entry || null;
}

export function removeKeyword(input: string, keyword: string): string {
  let result = input.replace(new RegExp(`/${keyword}.*`), '');
  if (result.endsWith('/')) {
    result = result.slice(0, -1);
  }
  return result;
}

export function searchPrefixWithSpecialChars(
  strings: string[],
  prefix: string,
): string | null {
  for (let i = strings.length - 1; i >= 0; i--) {
    const str = strings[i];
    if (
      str.startsWith(prefix) &&
      (str[prefix.length] === '?' || str[prefix.length] === '#')
    ) {
      return str;
    }
  }
  return null;
}
