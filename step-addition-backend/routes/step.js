
const express = require('express');
const User = require('../models/step');

const router = express.Router();

app.get('/api/results', async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;

  try {
    const offset = (parseInt(page.toString(), 10) - 1) * parseInt(pageSize.toString(), 10);
    const { rows: results, rowCount: totalResults } = await pool.query(
      `SELECT result_json FROM results ORDER BY id DESC OFFSET $1 LIMIT $2`,
      [offset, pageSize]
    );

    res.json({ results, totalResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve results' });
  }
});


app.post('/api/steps', async (req, res) => {
  const { number1, number2 } = req.body;

  // Validate the request body using regex to accept only positive numbers
  const numberRegex = /^\d+$/;
  if (!numberRegex.test(number1) || !numberRegex.test(number2)) {
    return res.status(400).json({ error: 'Invalid numbers provided' });
  }

  // Perform the step addition process
  const steps = [];
  let carry = 0;
  let sumString = '';

  for (let i = 0; i < Math.max(number1.length, number2.length); i++) {
    const digit1 = parseInt(number1[number1.length - 1 - i] || '0', 10);
    const digit2 = parseInt(number2[number2.length - 1 - i] || '0', 10);

    const sum = digit1 + digit2 + carry;
    const unitDigit = sum % 10;
    carry = Math.floor(sum / 10);

    sumString = unitDigit + sumString;
    steps.push({ step: i + 1, sumString, carryString: carry.toString() });
  }

  if (carry > 0) {
    steps.push({ step: steps.length + 1, sumString: carry.toString(), carryString: '' });
  }

  res.json(steps);
});

app.post('/api/save-results', async (req, res) => {
  const { steps } = req.body;

  try {
    await pool.query('INSERT INTO results (result_json) VALUES ($1)', [JSON.stringify(steps)]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save results' });
  }
});

module.exports = router;
