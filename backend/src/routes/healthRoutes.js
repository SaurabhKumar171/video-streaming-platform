const express = require("express");
const router = express.Router();
const {
  livenessCheck,
  readinessCheck,
} = require("../controllers/healthController");

router.get("/live", livenessCheck);
router.get("/ready", readinessCheck);

module.exports = router;
