import express from "express";
import expressWs from "express-ws";

const App = express();
const WSS = expressWs(App);
const Port = 3001;

/**
 * This is a newer way to do the work commonly seen with `bodyParser`
 */
App.use(express.urlencoded({ extended: true }));
App.use(express.json());
App.use(express.raw());

/**
 * This activates CORS
 */
App.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //? Whatever middleware work .next() is doing is ESSENTIAL to actually making this work
    next();
});
    
App.use(function (req, res, next) {
    console.log("middleware");
    req.testing = "testing";

    return next();
});

App.get("/", function(req, res, next){
    console.log("get route", req.testing);
    res.end();
});

App.ws("/", function(ws, req) {
    ws.on("message", function(msg) {
        console.log(msg);

        ws.send("Cats");
    });
    console.log("socket", req.testing);
});

App.listen(Port, () =>
    console.log(`WebSocket server is listening on port ${ Port }!`),
);