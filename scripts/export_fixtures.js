// scripts/export_fixtures.js
const fs = require('fs');
const path = require('path');

// 1. Read productStore.js
const pStore = fs.readFileSync(path.join(__dirname, '../src/utils/productStore.js'), 'utf8');
const pMatch = pStore.match(/export const defaultProducts = (\[[\s\S]*?\n\];)/);
let products = [];
if (pMatch) {
  const code = 'const defaultProducts = ' + pMatch[1] + '; module.exports = defaultProducts;';
  const tmpFile = path.join(__dirname, 'tmp_products.js');
  fs.writeFileSync(tmpFile, code);
  products = require(tmpFile);
  fs.unlinkSync(tmpFile);
}

// 2. Read orderStore.js
const oStore = fs.readFileSync(path.join(__dirname, '../src/utils/orderStore.js'), 'utf8');
const supMatch = oStore.match(/const defaultSuppliers = (\[[\s\S]*?\n\];)/);
let suppliers = [];
if (supMatch) {
  const code = 'const s = ' + supMatch[1] + '; module.exports = s;';
  const tmpFile = path.join(__dirname, 'tmp_suppliers.js');
  fs.writeFileSync(tmpFile, code);
  suppliers = require(tmpFile);
  fs.unlinkSync(tmpFile);
}

const ordMatch = oStore.match(/const defaultOrders = (\[[\s\S]*?\n\];)/);
let orders = [];
if (ordMatch) {
  const code = 'const o = ' + ordMatch[1] + '; module.exports = o;';
  const tmpFile = path.join(__dirname, 'tmp_orders.js');
  fs.writeFileSync(tmpFile, code);
  orders = require(tmpFile);
  fs.unlinkSync(tmpFile);
}

const userMatch = oStore.match(/const defaultUsers = (\[[\s\S]*?\n\];)/);
let users = [];
if (userMatch) {
  const code = 'const u = ' + userMatch[1] + '; module.exports = u;';
  const tmpFile = path.join(__dirname, 'tmp_users.js');
  fs.writeFileSync(tmpFile, code);
  users = require(tmpFile);
  fs.unlinkSync(tmpFile);
}

// 3. Read adminStore.js
const aStore = fs.readFileSync(path.join(__dirname, '../src/utils/adminStore.js'), 'utf8');
const subMatch = aStore.match(/export const defaultSubcategories = (\[[\s\S]*?\n\];)/);
let subcategories = [];
if (subMatch) {
  const code = 'const sub = ' + subMatch[1] + '; module.exports = sub;';
  const tmpFile = path.join(__dirname, 'tmp_sub.js');
  fs.writeFileSync(tmpFile, code);
  subcategories = require(tmpFile);
  fs.unlinkSync(tmpFile);
}

const varMatch = aStore.match(/export const defaultVariants = (\[[\s\S]*?\n\];)/);
let variants = [];
if (varMatch) {
  const code = 'const v = ' + varMatch[1] + '; module.exports = v;';
  const tmpFile = path.join(__dirname, 'tmp_var.js');
  fs.writeFileSync(tmpFile, code);
  variants = require(tmpFile);
  fs.unlinkSync(tmpFile);
}

const exportData = {
  products,
  suppliers,
  orders,
  users,
  subcategories,
  variants
};

fs.writeFileSync(path.join(__dirname, '../backend/all_seed_data.json'), JSON.stringify(exportData, null, 2));
console.log('Successfully exported all fixtures:');
console.log('- Products count:', products.length);
console.log('- Suppliers count:', suppliers.length);
console.log('- Orders count:', orders.length);
console.log('- Users count:', users.length);
console.log('- Subcategories count:', subcategories.length);
console.log('- Variants count:', variants.length);
