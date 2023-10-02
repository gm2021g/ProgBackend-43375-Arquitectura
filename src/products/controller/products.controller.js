import { ProductsServices } from "../services/products.services.js";

//Mostrar todos los productos
export const getAllProductsCtr = async (req, res) => {
  try {
    const { sort, query, page, limit } = req.query;
    const options = {
      limit: limit || 5,
      page: page || 1,
      sort: { price: sort } || { price: 1 },
      lean: true,
    };

    const products = await ProductsServices.getProducts(query, options);

    res.send({
      status: "succes",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `/api/products?page=${products.prevPage}&sort=${options.sort}`
        : null,
      nextLink: products.hasNextPage
        ? `/api/products?page=${products.nextPage}&sort=${options.sort}`
        : null,
    });
  } catch (error) {
    console.log(error);

    res.send({
      status: "error",
      error: "SOMETHING WENT WRONG",
    });
  }
};

//Traer un solo prodcuto por id
export const getProductByIdCtr = async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await ProductsServices.getProductById(pid);

    res.send({
      status: "succes",
      payload: product,
    });
  } catch (error) {
    console.log(error.message);

    res.send({
      status: "error",
      error: error.message || "SOMETHING WENT WRONG",
    });
  }
};

//Agrego un nuevo producto que llega por req.body
export const addNewProductCtr = async (req, res) => {
  try {
    const newProduct = req.body;

    if (!newProduct) {
      return res.send({
        status: "error",
        error: "EMPTY PRODUCT",
      });
    }

    const result = await ProductsServices.addProduct(newProduct);

    res.send({
      status: "succes",
      payload: result,
    });
  } catch (error) {
    console.log(error);

    res.send({
      status: "error",
      error: error.message || "SOMETHING WENT WRONG",
    });
  }
};

//Actualizar un producto
export const updateProductCtr = async (req, res) => {
  try {
    const { pid } = req.params;

    const updates = req.body;

    const result = await ProductsServices.updateProduct(pid, updates);

    res.send({
      status: "succes",
      payload: result,
    });
  } catch (error) {
    console.log(error);

    res.send({
      status: "error",
      error: error.message || "SOMETHING WENT WRONG",
    });
  }
};

// Eliminar un producto
export const deleteProductCtr = async (req, res) => {
  try {
    const { pid } = req.params;

    const result = await ProductsServices.deleteProduct(pid);

    res.send({
      status: "succes",
      payload: result,
    });
  } catch (error) {
    console.log(error);

    res.send({
      status: "error",
      error: error.message || "SOMETHING WENT WRONG",
    });
  }
};
