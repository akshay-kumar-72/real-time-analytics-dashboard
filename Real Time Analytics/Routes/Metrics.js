const express = require("express");
const router = express.Router();
const Metric = require("../models/Metric");

router.get("/", async (req, res) => {
  const data = await Metric.find({});
  res.json(data);
});

router.post("/", async (req, res) => {
  const { name, value } = req.body;
  const metric = new Metric({ name, value });
  await metric.save();
  res.json(metric);
});

module.exports = router;
