// Address completion for James Square properties. James Square addresses take
// the form "<number>/<flat> Caledonian Crescent, Edinburgh", so once an owner
// types their property number (e.g. "59/2") the rest can be suggested. Only a
// suggestion is offered: nothing is filled in unless the owner accepts it, and
// the field always stays editable. No real address is ever used as an example.

export const JAMES_SQUARE_STREET = "Caledonian Crescent, Edinburgh";

const PROPERTY_NUMBER = /^(\d{1,3}(?:\/\d{1,2})?)(?:\s+(.*))?$/;

/**
 * Returns the completed address for a partly typed James Square address, or
 * null when there is nothing useful to suggest.
 *
 *   "59/2"      → "59/2 Caledonian Crescent, Edinburgh"
 *   "59/2 cal"  → "59/2 Caledonian Crescent, Edinburgh"
 *   "Flat 2"    → null
 */
export function suggestAddress(input: string): string | null {
  const match = PROPERTY_NUMBER.exec(input.trim());
  if (!match) return null;
  const [, number, rest = ""] = match;
  const typed = rest.trim().toLowerCase();
  if (typed && !JAMES_SQUARE_STREET.toLowerCase().startsWith(typed)) return null;
  const suggestion = `${number} ${JAMES_SQUARE_STREET}`;
  return suggestion === input.trim() ? null : suggestion;
}
