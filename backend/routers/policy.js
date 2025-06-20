// routes/policy.js
const express = require('express');
const router = express.Router();


const {
  getPolicies
} = require("../controllers/policy");

// GET /policy/get
router.get('/get', getPolicies);


module.exports = router;
