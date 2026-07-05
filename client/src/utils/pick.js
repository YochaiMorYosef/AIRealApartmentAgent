// The Apify yad2 scraper can return slightly different field names,
// so we look for a few common variants for each piece of data.
export function pick(item, keys) {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null && item[key] !== "") {
      return item[key];
    }
  }
  return null;
}
