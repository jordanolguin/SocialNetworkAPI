const formatDate = function (timestamp) {
  const today = new Date(timestamp);

  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: "true",
  };

  return today.toLocaleDateString("en-US", options);
};

module.exports = formatDate;
