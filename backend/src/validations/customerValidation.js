function validateCustomer(data) {
  const { name, phone } = data;

  if (!name || !phone) {
    return {
      isValid: false,
      message: "Name and phone are required",
    };
  }

  return {
    isValid: true,
  };
}

module.exports = {
  validateCustomer,
};