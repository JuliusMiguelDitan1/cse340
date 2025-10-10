const pool = require("../database/")

async function addItem(account_id, inv_id, quantity) {
  return await pool.query(
    `INSERT INTO cart (account_id, inv_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (account_id, inv_id)
     DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity`,
    [account_id, inv_id, quantity]
  )
}

async function getItems(account_id) {
  return await pool.query(
    `SELECT i.inv_id, i.inv_make, i.inv_model, i.inv_price, i.inv_thumbnail, c.quantity
     FROM cart c
     JOIN inventory i ON c.inv_id = i.inv_id
     WHERE c.account_id = $1`,
    [account_id]
  )
}


async function removeItem(account_id, inv_id) {
  return await pool.query(
    `DELETE FROM cart
     WHERE account_id = $1 AND inv_id = $2`,
    [account_id, inv_id]
  )
}

module.exports = { addItem, getItems, removeItem }
