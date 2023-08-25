const { join } = require("path");
const dotenv = require("dotenv");
dotenv.config({path:join(__dirname, "../.env")});
const express = require("express");
const cors = require("cors");
const db = require("./models");
const routes = require("./routes");
// db.sequelize.sync({ alter: true });

const PORT = process.env.PORT || 8000;
const app = express();
app.use(
  cors({
    credentials: true,
    // origin: [
    //   process.env.WHITELISTED_DOMAIN &&
    //     process.env.WHITELISTED_DOMAIN.split(","),
    // ],
  })
);

app.use(express.json());

app.use("/paymentImg", express.static(`${__dirname}/public/paymentImg`));

app.use("/avatar", express.static(`${__dirname}/public/avatar`));

app.use("/api/auth", routes.userRoutes);
app.use("/api/address", routes.addressRoutes);
app.use("/api/admin", routes.adminRoutes);
app.use("/api/book", routes.bookRoutes);
app.use("/api/branch", routes.branchRoutes);
app.use("/api/cart", routes.cartRoutes);
app.use("/api/category", routes.categoryRoutes);
app.use("/api/discount", routes.discountRoutes);
app.use("/api/order", routes.orderRoutes);
app.use("/api/orderdetail", routes.orderDetailRoutes);
app.use("/api/stock", routes.stockRoutes);
app.use("/api/stockhistory", routes.stockHistoryRoutes);
app.use("/api/voucher", routes.voucherRoutes);
app.use("/api/city", routes.cityRoutes);
app.use("/api/province", routes.provinceRoutes);

app.use("/bookImage", express.static(`${__dirname}/public/book`));

//#region API ROUTES

// ===========================
// NOTE : Add your routes here

app.get("/api", (req, res) => {
 	res.send(`Hello, this is my API`);
});

// app.get("/api/greetings", (req, res, next) => {
// 	res.status(200).json({
// 		message: "Hello, Student !",
// 	});
// });

// ===========================

// not found
app.use((req, res, next) => {
	if (req.path.includes("/api/")) {
		res.status(404).send("Not found !");
 	} else {
 		next();
 	}
});

// error
app.use((err, req, res, next) => {
 	if (req.path.includes("/api/")) {
 		console.error("Error : ", err.stack);
 		res.status(500).send("Error !");
 	} else {
 		next();
 	}
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
 	res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
