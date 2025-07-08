// routes/policy.js
const express = require('express');
const router = express.Router();


const {
  getPolicies,
  updatePolicy,
  addPolicy,
} = require("../controllers/policy");

// GET /policy/get
router.get('/get', getPolicies);

// PATCH /policy/update
router.patch('/update', updatePolicy);

router.post('/add', addPolicy);



module.exports = router;