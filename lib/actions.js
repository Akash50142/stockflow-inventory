"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { createSession, destroySession, requireUser } from "@/lib/auth";

const num = (v) =>
  v === null || v === undefined || String(v).trim() === "" ? null : Number(v);
const go = (path, msg) => redirect(`${path}?error=${encodeURIComponent(msg)}`);

export async function signup(formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");
  const orgName = String(formData.get("orgName") || "").trim();

  if (!email.includes("@")) go("/signup", "Enter a valid email");
  if (password.length < 6) go("/signup", "Password must be at least 6 characters");
  if (password !== confirm) go("/signup", "Passwords do not match");
  if (!orgName) go("/signup", "Organization name is required");

  const exists = await query("SELECT id FROM users WHERE email=$1", [email]);
  if (exists.rows.length) go("/signup", "Email already registered");

  const org = await query(
    "INSERT INTO organizations(name) VALUES($1) RETURNING id",
    [orgName]
  );
  const hash = await bcrypt.hash(password, 10);
  const user = await query(
    "INSERT INTO users(email,password_hash,organization_id) VALUES($1,$2,$3) RETURNING id, organization_id",
    [email, hash, org.rows[0].id]
  );
  await createSession(user.rows[0]);
  redirect("/dashboard");
}

export async function login(formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (!email || !password) go("/login", "Email and password are required");

  const res = await query("SELECT * FROM users WHERE email=$1", [email]);
  const user = res.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    go("/login", "Invalid email or password");
  }
  await createSession(user);
  redirect("/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}

function readProduct(fd) {
  const name = String(fd.get("name") || "").trim();
  const sku = String(fd.get("sku") || "").trim();
  const description = String(fd.get("description") || "").trim() || null;
  const quantity = Number(fd.get("quantity") || 0);
  const cost = num(fd.get("costPrice"));
  const sell = num(fd.get("sellingPrice"));
  const thr = num(fd.get("threshold"));

  let error = null;
  if (!name || !sku) error = "Name and SKU are required";
  else if (!Number.isInteger(quantity) || quantity < 0)
    error = "Quantity must be a whole number (0 or more)";
  else if (
    (cost !== null && (isNaN(cost) || cost < 0)) ||
    (sell !== null && (isNaN(sell) || sell < 0))
  )
    error = "Prices must be 0 or more";
  else if (thr !== null && (!Number.isInteger(thr) || thr < 0))
    error = "Low stock threshold must be a whole number (0 or more)";

  return { error, p: { name, sku, description, quantity, cost, sell, thr } };
}

export async function createProduct(formData) {
  const user = await requireUser();
  const { error, p } = readProduct(formData);
  if (error) go("/products/new", error);

  let err = null;
  try {
    await query(
      `INSERT INTO products(organization_id,name,sku,description,quantity,cost_price,selling_price,low_stock_threshold,last_updated_by)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [user.orgId, p.name, p.sku, p.description, p.quantity, p.cost, p.sell, p.thr, user.id]
    );
  } catch (e) {
    err = e.code === "23505" ? "SKU already exists in your organization" : "Something went wrong";
  }
  if (err) go("/products/new", err);
  redirect("/products");
}

export async function updateProduct(formData) {
  const user = await requireUser();
  const id = Number(formData.get("id"));
  const { error, p } = readProduct(formData);
  if (error) go(`/products/${id}`, error);

  let err = null;
  try {
    await query(
      `UPDATE products SET name=$1, sku=$2, description=$3, quantity=$4, cost_price=$5,
       selling_price=$6, low_stock_threshold=$7, last_updated_by=$8, updated_at=now()
       WHERE id=$9 AND organization_id=$10`,
      [p.name, p.sku, p.description, p.quantity, p.cost, p.sell, p.thr, user.id, id, user.orgId]
    );
  } catch (e) {
    err = e.code === "23505" ? "SKU already exists in your organization" : "Something went wrong";
  }
  if (err) go(`/products/${id}`, err);
  redirect("/products");
}

export async function deleteProduct(formData) {
  const user = await requireUser();
  const id = Number(formData.get("id"));
  await query("DELETE FROM products WHERE id=$1 AND organization_id=$2", [id, user.orgId]);
  redirect("/products");
}

export async function saveSettings(formData) {
  const user = await requireUser();
  const v = Number(formData.get("threshold"));
  if (!Number.isInteger(v) || v < 0) go("/settings", "Enter a whole number (0 or more)");
  await query("UPDATE organizations SET default_low_stock=$1 WHERE id=$2", [v, user.orgId]);
  redirect("/settings?saved=1");
}