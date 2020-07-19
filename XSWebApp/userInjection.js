const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost:27017/lil18").then(
    async () => {
        console.log(`\tMongoDB Connected`);
        const User = require("./src/server/models/user");
            let newUser = new User({
                primary_email: `admin@admin.com`,
                username: "admin",
                password: "admin"
            });
            try {
                await newUser.save();
                console.log(newUser.username);
            } catch (err) {
                console.log(err);
            }

        mongoose.disconnect();
    },
    err => {
        console.log(`Mongo Error: ${err}`);
        process.exit();
    }
);