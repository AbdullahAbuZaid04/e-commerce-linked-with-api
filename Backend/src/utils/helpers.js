const serialize = (data) =>
  JSON.parse(JSON.stringify(data, (_key, value) =>
    typeof value === "object" && value?.constructor?.name === "Decimal"
      ? Number(value)
      : value
  ));

const generateSlug = (name) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-+|-+$/g, "");
};



module.exports = {
  serialize,
  generateSlug
};
