CREATE TABLE product_types (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL UNIQUE,
  is_default  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE customers (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  phone       TEXT,
  notes       TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_phone ON customers(phone);

CREATE TABLE production_entries (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  entry_date       TEXT NOT NULL,
  product_type_id  INTEGER NOT NULL DEFAULT 1 REFERENCES product_types(id),
  roll_count       INTEGER NOT NULL CHECK (roll_count > 0),
  notes            TEXT,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at       TEXT
);
CREATE INDEX idx_production_date ON production_entries(entry_date);

CREATE TABLE sales (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  sale_date        TEXT NOT NULL,
  customer_id      INTEGER NOT NULL REFERENCES customers(id),
  vehicle_number   TEXT,
  product_type_id  INTEGER NOT NULL DEFAULT 1 REFERENCES product_types(id),
  roll_count       INTEGER NOT NULL CHECK (roll_count > 0),
  notes            TEXT,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at       TEXT
);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_customer ON sales(customer_id);

CREATE TABLE stock_adjustments (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  adjustment_date  TEXT NOT NULL,
  product_type_id  INTEGER NOT NULL DEFAULT 1 REFERENCES product_types(id),
  quantity_delta   INTEGER NOT NULL CHECK (quantity_delta != 0),
  reason           TEXT NOT NULL,
  notes            TEXT,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at       TEXT
);
CREATE INDEX idx_adjustments_date ON stock_adjustments(adjustment_date);

CREATE TABLE stock_ledger (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  entry_date       TEXT NOT NULL,
  product_type_id  INTEGER NOT NULL DEFAULT 1 REFERENCES product_types(id),
  entry_type       TEXT NOT NULL CHECK (entry_type IN ('PRODUCTION','SALE','ADJUSTMENT')),
  quantity         INTEGER NOT NULL,
  reference_table  TEXT NOT NULL,
  reference_id     INTEGER NOT NULL,
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_ledger_date ON stock_ledger(entry_date);
CREATE UNIQUE INDEX uq_ledger_ref ON stock_ledger(reference_table, reference_id);

CREATE VIEW current_stock AS
  SELECT product_type_id, COALESCE(SUM(quantity), 0) AS stock_count
  FROM stock_ledger
  GROUP BY product_type_id;