const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

// Local db path
const DB = process.env.DATABASE_LOCAL;

// Connect with local db using mongoose
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
    })
    .then((con) => {
        console.log("DB connection successful! 📈");
    });

// App runner with specific port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`\nApp running on port ${port}. 👋`);
});
