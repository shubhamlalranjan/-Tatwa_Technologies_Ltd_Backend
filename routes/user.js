const { getAllModulesByUserId } = require("../controllers/userModule");

const router = require("express").Router();

router.get("/getAllModulesByUserId/:userId", getAllModulesByUserId);

module.exports = router;
