DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products(
    item_id INT NOT NULL,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price DECIMAL(10,2),
    stock_quantity INT,

  PRIMARY KEY (item_id)
);

SELECT * FROM products;
