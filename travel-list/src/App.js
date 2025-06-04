import { useState } from "react";
import Form from "./form";
import Logo from "./logo";
import PackingList from "./PackingList";
import Stats from "./Stats";
// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: true },
//   { id: 2, description: "Socks", quantity: 12, packed: false },
// ];

export default function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  function handleOnClick(id) {
    setItems(items.filter((item) => item.id !== id));
  }

  function handleReset() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all the items?"
    );
    if (confirmed) setItems([]);
  }

  function handleCheckbox(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        handleOnClick={handleOnClick}
        handleCheckbox={handleCheckbox}
        handleReset={handleReset}
      />
      <Stats items={items} />
    </div>
  );
}
