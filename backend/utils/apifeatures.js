class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query; // Figure out how this is resetted upon function calls
    this.queryStr = queryStr;
  }

  search() {
    // Custom query object
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    // Perform query
    this.query = this.query.find({ ...keyword });

    return this;
  }

  filter() {
    // Create copy of object
    const queryCopy = { ...this.queryStr };

    // Remove non filters
    const removeFields = ["keyword", "page", "limit"];

    // Retain only filters
    removeFields.forEach((key) => delete queryCopy[key]);

    // Add $ infront of keys to prep for mongoDB query
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|)\b/g, (key) => "$" + key);

    // Perform query
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resultsPerPage) {
    // Extract page from queryStr
    const currentPage = Number(this.queryStr.page) || 1;

    // Elements to skip based on page number
    const skip = resultsPerPage * (currentPage - 1);

    // Perform query
    this.query = this.query.limit(resultsPerPage).skip(skip);

    return this;
  }
}

export default ApiFeatures;
