const parseJsonField = (value, fallback = {}) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    const error = new Error("Invalid JSON format");
    error.statusCode = 400;
    throw error;
  }
};

module.exports = parseJsonField;
