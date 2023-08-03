const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const { join } = require("path");
const db = require("./models");
const routes = require("./routes");
db.sequelize.sync({ alter: true });
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

app.use("/auth", routes.userRoutes);
app.use("/address", routes.addressRoutes);
app.use("/admin", routes.adminRoutes);
app.use("/book", routes.bookRoutes);
app.use("/branch", routes.branchRoutes);
app.use("/cart", routes.cartRoutes);
app.use("/category", routes.categoryRoutes);
app.use("/discount", routes.discountRoutes);
app.use("/order", routes.orderRoutes);
app.use("/orderdetail", routes.orderDetailRoutes);
app.use("/stock", routes.stockRoutes);
app.use("/stockhistory", routes.stockHistoryRoutes);
app.use("/voucher", routes.voucherRoutes);
app.use("/city", routes.cityRoutes);
app.use("/province", routes.provinceRoutes);

app.use("/bookImage", express.static(`${__dirname}/public/book`));

//#region API ROUTES

// ===========================
// NOTE : Add your routes here

// app.get("/api", (req, res) => {
// 	res.send(`Hello, this is my API`);
// });

// app.get("/api/greetings", (req, res, next) => {
// 	res.status(200).json({
// 		message: "Hello, Student !",
// 	});
// });

// ===========================

// not found
// app.use((req, res, next) => {
// 	if (req.path.includes("/api/")) {
// 		res.status(404).send("Not found !");
// 	} else {
// 		next();
// 	}
// });

// error
// app.use((err, req, res, next) => {
// 	if (req.path.includes("/api/")) {
// 		console.error("Error : ", err.stack);
// 		res.status(500).send("Error !");
// 	} else {
// 		next();
// 	}
// });

//#endregion

//#region CLIENT
// const clientPath = "../../client/build";
// app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
// app.get("*", (req, res) => {
// 	res.sendFile(join(__dirname, clientPath, "index.html"));
// });

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
