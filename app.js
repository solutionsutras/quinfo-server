const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
var favicon = require('serve-favicon');
var path = require('path');

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));

require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/errorHandler');

app.use(cors());
app.options('*', cors());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

// Routes
const serviceCategoriesRouter = require('./routers/servicecategories');
const busesRouter = require('./routers/buses');
const usersRouter = require('./routers/users');
// const ordersRouter = require('./routers/orders');
// const iqRouter = require('./routers/itemquality');
// const unitsRouter = require('./routers/units');
// const vehiclesRouter = require('./routers/vehicles');
const otpSmsRouter = require('./routers/otpsms');
// const transactionsRouter = require('./routers/transactions');
// const controlsRouter = require('./routers/controls');
// const orderStatusRouter = require('./routers/orderstatus');
// const logisticsRouter = require('./routers/logistics');
// const orderItemsRouter = require('./routers/orderitems');
const homeBannersRouter = require('./routers/homebanner');
const filsRouter = require('./routers/fileupload');

const api = process.env.API_URL;

//Routers
app.use(`${api}/buses`, busesRouter);
app.use(`${api}/services`, serviceCategoriesRouter);
app.use(`${api}/users`, usersRouter);
// app.use(`${api}/orders`, ordersRouter);
// app.use(`${api}/itemquality`, iqRouter);
// app.use(`${api}/units`, unitsRouter);
// app.use(`${api}/vehicles`, vehiclesRouter);
app.use(`${api}/otpsms`, otpSmsRouter);
// app.use(`${api}/transactions`, transactionsRouter);
// app.use(`${api}/controls`, controlsRouter);
// app.use(`${api}/orderstatus`, orderStatusRouter);
// app.use(`${api}/logistics`, logisticsRouter);
// app.use(`${api}/orderitems`, orderItemsRouter);
app.use(`${api}/homebanners`, homeBannersRouter);
app.use(`${api}/files`, filsRouter);

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useunifiedTopology: false,
  })
  .then(() => {
    console.log('Database Connection Sucessfull');
  })
  .catch((err) => {
    console.log('Database Conenction Error: ' + err);
  });

// Development
// app.listen(3000, ()=>{
//     console.log("Server Running at http://3000")
// })

// Production
var server = app.listen(process.env.PORT || 7000, function () {
  var port = server.address().port;
  console.log('Server Running at port: ' + port);
});
