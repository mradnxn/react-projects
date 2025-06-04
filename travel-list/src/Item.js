export default function Item({ itemObj, handleOnClick, handleCheckbox }) {
  return (
    <li>
      <input
        type="checkbox"
        value={itemObj.packed}
        onChange={() => handleCheckbox(itemObj.id)}
      ></input>

      <span style={itemObj.packed ? { textDecoration: "line-through" } : {}}>
        {itemObj.quantity} {itemObj.description}
      </span>

      <button onClick={() => handleOnClick(itemObj.id)}>❌</button>
    </li>
  );
}
