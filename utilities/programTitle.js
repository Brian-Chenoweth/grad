function cleanFieldValue(value = '') {
  const normalized = String(value ?? '')
    .replace(/<[^>]+>/g, '')
    .trim();

  if (!normalized) return '';
  if (/^(null|undefined|n\/a|na)$/i.test(normalized)) return '';
  if (/^[:;,-]+$/.test(normalized)) return '';

  return normalized;
}

function toTitleCase(value) {
  if (!value) return '';
  const minorWords = new Set(['and', 'or', 'of', 'the', 'in', 'for', 'to', 'a']);
  return String(value)
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      if (!word) return word;
      if (index > 0 && minorWords.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function isTruthySpecialization(value) {
  return (
    value === true ||
    value === 1 ||
    /^(1|true|yes|on)$/i.test(String(value ?? '').trim())
  );
}

export default function formatProgramDisplayTitle(title = '', specialization = '', specializationIn = '') {
  const baseTitle = cleanFieldValue(title);
  const specializationInValue = toTitleCase(
    cleanFieldValue(specializationIn).replace(/[_-]+/g, ' ')
  );

  if (isTruthySpecialization(specialization) && baseTitle && specializationInValue) {
    return `${specializationInValue}, Specialization in ${baseTitle}`;
  }

  return baseTitle;
}
