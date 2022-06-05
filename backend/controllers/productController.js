import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import ProductAddHistory from "../models/productAddHistory.js";

// получаем все товары
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 4;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// получаем продукт по id
const getProductsById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// удаляем продукт
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// созадем продукт
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Initial Name",
    salePrice: 5,
    buyPrice: 5,
    user: req.user._id,
    image: "/images/initial.jpg",
    brand: "Initial Brand",
    category: "Initial Category",
    countInStock: 0,
    numReviews: 0,
    description: "Initial Description",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// обновляем данные о продукте
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    salePrice,
    buyPrice,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id);
  if (product) {
    if (countInStock > product.countInStock) {
      const count = +countInStock - product.countInStock;
      const price = count * buyPrice;
      await new ProductAddHistory({
        productId: product._id,
        count,
        price,
      }).save();
    }
    product.name = name;
    product.salePrice = salePrice;
    product.buyPrice = buyPrice;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// создаем отзыв на продукт
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// получаем 3 популярных товара по их рейтингу
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

export {
  getProducts,
  getProductsById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
