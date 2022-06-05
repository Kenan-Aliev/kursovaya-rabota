import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import ProductAddHistory from "../models/productAddHistory.js";

const getReportForPeriod = asyncHandler(async (req, res) => {
  // console.log(req.body);
  // console.log(new Date(req.body).toISOString());
  const dates = JSON.parse(req.params.dates);
  const orders = await Order.find({
    createdAt: {
      $gte: new Date(dates.startDate),
      $lt: new Date(dates.endDate),
    },
  });
  const addedProducts = await ProductAddHistory.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(dates.startDate),
          $lte: new Date(dates.endDate),
        },
      },
    },
    {
      $group: {
        _id: "$productId",
        addedProductsForPeriod: { $sum: "$count" },
        priceOfAddedProducts: { $sum: "$price" },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "products",
      },
    },
    {
      $project: {
        addedProductsForPeriod: 1,
        priceOfAddedProducts: 1,
        "products.name": 1,
        "products.buyPrice": 1,
      },
    },
  ]);
  return res.json({ orders, addedProducts });
});

export { getReportForPeriod };
