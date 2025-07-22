import Product from '../models/productsModel.js';

export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, category, status } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status === 'true';
  
    const options = { limit: +limit, page: +page, lean: true };
    if (sort === 'asc') options.sort = { price: 1 };
    if (sort === 'desc') options.sort = { price: -1 };
  
    const result = await Product.paginate(filter, options);
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
  
    const makeLink = (pageNum) => {
      const params = new URLSearchParams({ ...req.query, page: pageNum });
      return `${baseUrl}?${params.toString()}`;
    };

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? makeLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? makeLink(result.nextPage) : null
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const createProducts = async (req, res) => {
    try {
      const products = await Product.create(req.body);
      res.status(201).json({ message: 'Productos creados', products });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  };