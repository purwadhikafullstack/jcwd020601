const db = require("../models");
const Sequelize = require("sequelize");
const { Op } = db.Sequelize;
const { default: axios } = require("axios");
const fs = require("fs");
const path = require("path");
const {
  orderServices,
  orderDetailServices,
  stockServices,
  stockHistoryServices,
  cartServices,
} = require("../services");

const orderController = {
  getByFilter: async (req, res) => {
    try {
      const result = await orderServices.getByFilter(
        req.body,
        req.query.page,
        req.query.limit
      );
      res.send(result);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getTotalSalesOnLastWeek: async (req, res) => {
    try {
      const result = await orderServices.getTotalSalesOnLastWeek(req.query);
      res.send(result);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getPendingByUserId: async (req, res) => {
    try {
      const result = await orderServices.getPendingByUserId(req.params);
      res.send(result);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getHistoryByUserId: async (req, res) => {
    try {
      const result = await orderServices.getHistoryByUserId(req.params);
      res.send(result);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getAllBranchOrder: async (req, res) => {
    try {
      const result = await orderServices.getAllBranchOrder(
        req.query.page,
        req.query.limit
      );
      res.send(result);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getBranchOrder: async (req, res) => {
    try {
      const result = await orderServices.getBranchOrder(
        req.body,
        req.query.page,
        req.query.limit
      );
      res.send(result);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getSalesOnTime: async (req, res) => {
    try {
      const result = await orderServices.getSalesOnTime(req.query.time);
      res.send(result);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getSalesFromBranchIdOnTime: async (req, res) => {
    try {
      const result = await orderServices.getSalesFromBranchIdOnTime(
        req.params.BranchId,
        req.query.time
      );
      res.send(result);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getSalesQuantityOnTime: async (req, res) => {
    try {
      const result = await orderServices.getSalesQuantityOnTime(req.query.time);
      res.send(result);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getSalesQuantityFromBranchIdOnTime: async (req, res) => {
    try {
      const result = await orderServices.getSalesQuantityFromBranchIdOnTime(
        req.params.BranchId,
        req.query.time
      );
      res.send(result);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getTransactionOnTime: async (req, res) => {
    try {
      const result = await orderServices.getTransactionOnTime(req.query.time);
      res.send(result);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getTransactionFromBranchIdOnTime: async (req, res) => {
    try {
      const result = await orderServices.getTransactionFromBranchIdOnTime(
        req.params.BranchId,
        req.query.time
      );
      res.send(result);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  insertOrder: async (req, res) => {
    const trans = await db.sequelize.transaction();
    try {
      const { UserId, BranchId, AddressId, shipping, courier } = req.body;

      // check shipping
      if (shipping == undefined || shipping <= 0) {
        throw Error("Select the shipping method");
      }

      // get the order from cart
      const cart = await cartServices.getCartUserId({
        UserId,
        BranchId,
        raw: true,
      });

      // Order weight
      const weight = cart.reduce((prev, curr) => {
        return prev + curr["Stock.Book.weight"];
      }, 0);

      // Price maping (discount)
      const list = cart.map((val) => {
        if (val["Stock.DiscountId"]) {
          if (val["Stock.Discount.isPercent"]) {
            // "percent discount"
            return (
              (val["Stock.Book.price"] -
                val["Stock.Book.price"] *
                  val["Stock.Discount.discount"] *
                  0.01) *
              val["quantity"]
            );
          } else {
            // "minus discount"
            return (
              (val["Stock.Book.price"] - val["Stock.Discount.discount"]) *
              val["quantity"]
            );
          }
        } else {
          // "no discount";
          return val["Stock.Book.price"] * val["quantity"];
        }
      });

      // Total Price of Order
      const t = list.reduce((prev, curr) => {
        return prev + curr;
      }, 0);
      const total = Number(t) + Number(shipping);

      // orderDetails generete
      const orderDetails = cart.map((val, idx) => ({
        quantity: val.quantity,
        price: list[idx], // price with discount
        StockId: val["Stock.id"],
      }));

      // Create Order
      const order = await orderServices.createOrder({
        total,
        UserId,
        BranchId,
        AddressId,
        shipping,
        courier,
        weight,
        trans,
      });

      // post multiple orderdetails from order
      for (const detail of orderDetails) {
        await orderDetailServices.createOrderDetail({
          ...detail,
          OrderId: order.id,
          trans,
        });
      }

      // update multiple bucket in stocks
      for (const detail of orderDetails) {
        const { quantity, StockId } = detail;
        const stock = await stockServices.getStockById({ StockId });
        const updatedStock = stock.bucket + quantity;
        await stockServices.updateBucket({ updatedStock, StockId, trans });
      }

      // delete cart by UserId
      await cartServices.destroyCart({ UserId, trans });
      await trans.commit();
      return res.status(200).send(order);
    } catch (err) {
      await trans.rollback();
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  //
  // Uploud Payment Img
  //
  uploadPayment: async (req, res) => {
    const trans = await db.sequelize.transaction();
    try {
      console.log("masuk");
      const { id } = req.body;
      const { filename } = req.file;
      console.log(filename);
      const payment_url = process.env.payment_img + filename;
      await orderServices.uploadPayment({ payment_url, id, trans });
      await trans.commit();
      res.status(200).send("payment proof uploaded");
    } catch (err) {
      await trans.rollback();
      return res.status(500).send({
        message: err.message,
      });
    }
  },

  //
  // ------------ Update Status ---------- //
  //
  updateStatus: async (req, res) => {
    const trans = await db.sequelize.transaction();
    try {
      const { status, OrderId } = req.body;
      console.log({ this: status });
      //
      const data = await orderDetailServices.getOrderDetail({ OrderId });
      // console.log(data);

      const data2 = await orderServices.getOrder({ OrderId });

      console.log(data2.status);
      if (data2.status === "delivery confirm") {
        return res.status(400).send("The order has completed");
      } else if (data2.status === "canceled") {
        return res.status(400).send("The order has been permanently canceled");
      } else if (data2.status === "sending") {
        if (status === "delivery confirm") {
          await orderServices.updateStatus({ OrderId, status, trans });
        } else {
          return res.status(400).send("The order has been send");
        }
      } else {
        // check if cancel
        console.log("MMMMMAUSK");
        if (status === "canceled") {
          // update multiple buckets on stock
          console.log("masuk-cancel");
          for (const detail of data) {
            const { quantity, StockId } = detail;
            console.log({ quantity, StockId });
            const stock = await stockServices.getStockById({ StockId });
            console.log({ bucket: stock.bucket });
            const bucket = stock.bucket - quantity;
            console.log({ bucket });
            await stockServices.updateStock({ bucket, StockId, trans });
          }
          // update status
          await orderServices.updateStatus({ OrderId, status, trans });
        } else if (status === "sending") {
          // update multiple stocks
          // update multiple stocksHistory
          console.log("masuk-sending");
          for (const detail of data) {
            const { quantity, StockId } = detail;
            console.log({ quantity, StockId });

            const stock = await stockServices.getStockById({ StockId });
            const updatedStock = stock.stock - quantity;
            const bucket = stock.bucket - quantity;

            const sH = await stockHistoryServices.getStockHistory({ StockId });
            console.log(sH);

            await stockServices.updateStock({
              updatedStock,
              bucket,
              quantity,
              StockId,
              trans,
            });

            await stockHistoryServices.createStockHistory({
              StockId,
              updatedStock,
              quantity,
              tB: sH.totalAfter,
              trans,
            });
          }
          // update status
          await orderServices.updateStatus({ OrderId, status, trans });
        } else if (status === "waiting for payment") {
          console.log("masuk-WFP");
          console.log(status);
          await orderServices.updateStatus({ OrderId, status, trans });

          // delete image payment
          // Find the order to get the payment image URL
          const order = await orderServices.getOrder({ OrderId });
          console.log(order);
          if (!order) {
            return res.status(404).send({ message: "Order not found" });
          }

          // Extract the filename from the payment_url
          const paymentImageUrl = order.payment_url;
          console.log(paymentImageUrl);
          const filename = paymentImageUrl.split("/").pop();

          // Construct the file path
          const filePath = path.join(
            __dirname,
            "../public/paymentImg",
            filename
          );
          // Delete the file if it exists
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          // Update the order's payment_url to null
          await orderServices.deletePayment({ id: OrderId, trans });
        } else {
          console.log("masuk-else");
          await orderServices.updateStatus({ OrderId, status, trans });
        }
      }
      await trans.commit();
      return await orderServices
        .getOrder({ OrderId })
        .then((result) => res.send(result));
    } catch (err) {
      await trans.rollback();
      console.log(err.message);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  updateStatusUser: async (req, res) => {
    const trans = await db.sequelize.transaction();
    try {
      const { status, OrderId } = req.body;
      console.log(status);

      const data = await orderDetailServices.getOrderDetail({ OrderId });
      const data2 = await orderServices.getOrder({ OrderId });

      console.log(data2.status);
      if (data2.status === "delivery confirm") {
        return res.status(400).send("The order has completed");
      } else if (data2.status === "canceled") {
        return res.status(400).send("The order has been permanently canceled");
      } else if (data2.status === "sending") {
        if (status === "delivery confirm") {
          await orderServices.updateStatus({ OrderId, status, trans });
        } else {
          return res.status(400).send("The order has been send");
        }
      } else {
        // check if cancel
        if (status === "canceled") {
          // update multiple buckets on stock
          for (const detail of data) {
            const { quantity, StockId } = detail;
            console.log({ quantity, StockId });
            const stock = await stockServices.getStockById({ StockId });
            console.log({ bucket: stock.bucket });
            const bucket = stock.bucket - quantity;
            console.log({ bucket });
            await stockServices.updateStock({ bucket, StockId, trans });
          }
          // update status
          await orderServices.updateStatus({ OrderId, status, trans });
        } else if (status === "waiting for payment confirmation") {
          await orderServices.updateStatus({ OrderId, status, trans });
        } else {
          return res.status(400).send("Unauthorized");
        }
      }
      await trans.commit();
      return await orderServices
        .getOrder({ OrderId })
        .then((result) => res.send(result));
    } catch (err) {
      await trans.rollback();
      console.log(err);
      res.status(500).send(err);
    }
  },
  getShipping: async (req, res) => {
    try {
      const { origin, destination, weight, courier } = req.body;

      const response = await axios.post(
        "https://api.rajaongkir.com/starter/cost",
        { origin, destination, weight, courier },
        {
          headers: { key: process.env.RAJA_ONGKIR },
        }
      );
      // await db.Province.bulkCreate(response.data.rajaongkir.results);
      return res.status(200).send(response.data.rajaongkir.results[0].costs);
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  },
};

module.exports = orderController;