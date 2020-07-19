"use strict";

const path = require("path");
const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const redis = require('redis')
const logger = require('morgan')
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const mongoose = require("mongoose");
const envConfig = require("simple-env-config");

const env = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";

/*******/

const setupServer = async ()=>{


    // Get the app config
    const conf = await envConfig("./config/config.json", env);
    const port = process.env.PORT ? process.env.PORT : conf.port;

    // Setup our Express pipeline
    let app = express();
    if (env !== "test") app.use(logger("dev"));
    app.engine("pug", require("pug").__express);
    app.set("views", __dirname);
    app.use(express.static(path.join(__dirname, "../../public")));

    //setup redis
    app.redisClient =redis.createClient(conf.redisOptions);

    // Setup pipeline session support
    app.store = session({
        name: "session",
        store: new RedisStore({client:app.redisClient}),
        secret: conf.secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            path: "/"
        }
    });
    app.use(app.store);
    // Finish with the body parser
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Connect to MongoDB
    try {
        // Dont want to see MongooseJS deprecation warnings
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useUnifiedTopology', true );
        // Connect to the DB server
        await mongoose.connect(conf.mongodb);
        console.log(`MongoDB connected: ${conf.mongodb}`);
    } catch (err) {
        console.log(err);
        process.exit(-1);
    }

    // Import our Data Models
    app.models = {
        User: require("./models/user"),
        Novel: require("./models/novel")
    };
    // Import our routes
    require("./api")(app);

    // Give them the SPA base page
    app.get("*", (req, res) => {
        const user = req.session.user;
        let preloadedState = user
            ? {
                username: user.username
            }
            : {};
        preloadedState = JSON.stringify(preloadedState).replace(/</g, "\\u003c");
        res.render("base.pug", {
            state: preloadedState
        });
    });

    // Run the server itself
    let server = app.listen(port, () => {
        console.log(`Stand alone Xiaoshuo Update ${env} listening on: ${server.address().port}`);
    });

}

// Run the server
setupServer();