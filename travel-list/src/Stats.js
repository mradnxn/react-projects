export default function Stats({ items }) {
  if (items.length < 1) {
    return (
      <p className="stats">
        <em> Let's Start adding items in your packing list🚀</em>
      </p>
    );
  }

  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);
  return (
    <footer className="stats">
      {numPacked === numItems ? (
        <em>Wohooo you have packed all your item,Ready to go✈️</em>
      ) : (
        <em>
          💼 you have an {numItems} items on your list,and you already packed{" "}
          {numPacked} ({percentage}%)
        </em>
      )}
    </footer>
  );
}
