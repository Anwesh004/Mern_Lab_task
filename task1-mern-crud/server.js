const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

let items = [
  { id: 1, name: "Book", price: 250 },
  { id: 2, name: "Pen", price: 25 }
];

let nextId = 3;

function validateItem(body) {
  if (!body || typeof body.name !== "string") return null;

  const name = body.name.trim();
  const price = Number(body.price);

  if (!name || body.price === undefined || body.price === null || body.price === "" || !Number.isFinite(price) || price < 0) {
    return null;
  }

  return { name, price };
}

app.get("/api/items", (req, res) => {
  res.json(items);
});

app.post("/api/items", (req, res) => {
  const validItem = validateItem(req.body);

  if (!validItem) {
    return res.status(400).json({ message: "Enter a valid name and price." });
  }

  const item = { id: nextId++, ...validItem };
  items.push(item);
  res.status(201).json(item);
});

app.put("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = items.find((entry) => entry.id === id);
  const validItem = validateItem(req.body);

  if (!validItem) {
    return res.status(400).json({ message: "Enter a valid name and price." });
  }

  if (!item) {
    return res.status(404).json({ message: "Item not found." });
  }

  item.name = validItem.name;
  item.price = validItem.price;
  res.json(item);
});

app.delete("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = items.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Item not found." });
  }

  items.splice(index, 1);
  res.json({ message: "Item deleted successfully." });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
