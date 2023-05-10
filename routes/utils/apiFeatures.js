class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // query
    this.queryString = queryString; // example {sort: '-price,-ratingsAverage',limit: '10',fields: 'price,difficulty,name'}"
  }

  filter() {
    // 1A) Filtering
    const queryObject = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => {
      delete queryObject[el];
    });

    // 2B) Advanced filtering
    const obj = JSON.parse(
      JSON.stringify(queryObject).replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      )
    );
    this.query = this.query.find(obj);
    // let query = Tour.find(obj);
    return this; // all methods return the object to allow chaining
  }

  sort() {
    // 2) Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      // sort('price ratingsAverage')
    } else this.query = this.query.sort('-createdAt');
    return this;
  }

  limitFields() {
    // 3) Field limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query.select('-__v'); // sending all fields except "__v"
    }
    return this;
  }

  paginate() {
    // 4) Pagination
    const page = this.queryString.page * 1 || 1;
    const limitNumber = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limitNumber;
    // page=2&limit=10 1-10, page 1, 11-20, page 2 ...
    this.query = this.query.skip(skip).limit(limitNumber);
    return this;
  }
}

module.exports = APIFeatures;
