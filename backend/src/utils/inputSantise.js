export function sanitiseInputEmail(input) {
  return String(input).trim().toLowerCase();
}

export function sanitiseInputText(input) {
  return String(input).trim();
}
