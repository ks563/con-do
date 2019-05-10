//assigns models to const variables

const Committee = require("./committee");
const Events = require("./event");
const Measures = require("./measure");
const School = require("./school");
const User = require("./user");

//exports variables for use in other files
module.exports = {
    Committee,
    Events,
    Measures,
    School,
    User
}
