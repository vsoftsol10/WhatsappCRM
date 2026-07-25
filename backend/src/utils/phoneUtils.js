// Normalize Indian mobile number to Meta format (91XXXXXXXXXX)
const normalizeIndianPhone = (phone) => {
  if (!phone) return null;

  // Remove spaces, +, -, brackets, etc.
  const normalized = phone.replace(/\D/g, "");

  // Already in Meta format
  if (/^91[6-9]\d{9}$/.test(normalized)) {
    return normalized;
  }

  // Normal 10-digit Indian mobile number
  if (/^[6-9]\d{9}$/.test(normalized)) {
    return `91${normalized}`;
  }

  // Invalid number
  return null;
};

module.exports = {
  normalizeIndianPhone,
};