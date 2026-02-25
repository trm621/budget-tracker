const router = require("express").Router();
const Transaction = require("../models/transaction");

// POST /api/transaction
router.post("/api/transaction", async (req, res) => {
  try {
    const data = Array.isArray(req.body)
      ? await Transaction.insertMany(req.body)
      : await Transaction.create(req.body);

    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET /api/transaction
router.get("/api/transaction", async (req, res) => {
  try {
    const data = await Transaction.find({}).sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;