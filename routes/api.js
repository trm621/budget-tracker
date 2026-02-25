const router = require("express").Router();
const Transaction = require("../models/transaction");

router.post("/api/transaction", async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const data = await Transaction.insertMany(req.body);
      return res.json(data);
    }

    const data = await Transaction.create(req.body);
    res.json(data);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/api/transaction", async (req, res) => {
  try {
    const data = await Transaction.find({}).sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;