import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import StarRating from "./StarRating";
import "./index.css";
import App from "./App";

// function Test() {
//   const [rate, setRate] = useState(0);
//   return (
//     <div>
//       <StarRating color="blue" onSetRating={setRate} />
//       <p>rating is {rate}</p>
//     </div>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={10} />
    <StarRating messages={["Terrible", "Bad", "Ok", "Good", "Amazing"]} /> */}
    {/* <Test /> */}
  </React.StrictMode>
);
