const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  )
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error)
  }
}

/* ***************************
 *  Get a single vehicle by inventory id
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
       WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]  // return a single vehicle object
  } catch (error) {
    console.error("getVehicleById error:", error)
    throw error
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    const result = await pool.query(sql, [classification_name])
    return result.rows[0]
  } catch (error) {
    console.error("addClassification error:", error)
    return null
  }
}

/* ***************************
 *  Add new inventory
 * ************************** */
async function addInventory(data) {
  try {
    const sql = `INSERT INTO inventory 
      (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`
    const values = [
      data.classification_id,
      data.inv_make,
      data.inv_model,
      data.inv_year,
      data.inv_description,
      data.inv_image,
      data.inv_thumbnail,
      data.inv_price,
      data.inv_miles,
      data.inv_color
    ]
    const result = await pool.query(sql, values)
    return result.rows[0]
  } catch (err) {
    console.error("addInventory error:", err)
    return null
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(data) {
  const {
    inv_id, classification_id, inv_make, inv_model, inv_year,
    inv_description, inv_image, inv_thumbnail,
    inv_price, inv_miles, inv_color
  } = data

  const sql = `
    UPDATE public.inventory
    SET classification_id = $1,
        inv_make = $2,
        inv_model = $3,
        inv_year = $4,
        inv_description = $5,
        inv_image = $6,
        inv_thumbnail = $7,
        inv_price = $8,
        inv_miles = $9,
        inv_color = $10
    WHERE inv_id = $11
    RETURNING *;
  `

  const values = [
    classification_id, inv_make, inv_model, inv_year,
    inv_description, inv_image, inv_thumbnail,
    inv_price, inv_miles, inv_color, inv_id
  ]

  return pool.query(sql, values)
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql = 'DELETE FROM public.inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    console.error("Delete Inventory Error", error)
    throw error
  }
}


module.exports = { 
  getClassifications, 
  getInventoryByClassificationId, 
  getVehicleById,
  addClassification,
  addInventory,
  updateInventory,
  deleteInventory
}
