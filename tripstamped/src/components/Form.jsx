// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import Spinner from "./Spinner";
import Message from "./Message";
import { useLatLng } from "../hooks/useLatLng";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const navigate = useNavigate();
  const { postCity, isLoading } = useCities();

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [lat, lng] = useLatLng();
  const [isloadingCityData, setIsLoadingCityData] = useState(false);
  const [errorInCityData, setErrorInCityData] = useState("");
  const [emoji, setEmoji] = useState("");

  useEffect(
    function () {
      async function fetchCityData() {
        try {
          setIsLoadingCityData(true);
          setErrorInCityData("");
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();

          if (!data.countryCode) {
            throw new Error(
              "This does not seem to be a city,choose any other place"
            );
          }

          setCityName(data.city || data.locality || "");
          setEmoji(convertToEmoji(data.countryCode));
          setCountry(data.countryName || "");
        } catch (err) {
          setErrorInCityData(err.message);
        } finally {
          setIsLoadingCityData(false);
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    await postCity(newCity);
    navigate("/app/cities");
  }

  if (isloadingCityData) return <Spinner />;
  if (errorInCityData) return <Message message={errorInCityData} />;
  if (!lat && !lng)
    return <Message message={"try again by clicking on the map"} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>

        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type={"primary"}>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
