/* eslint-disable react/prop-types */
import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import { useCities } from "../contexts/CitiesContext";

function CountryList() {
  const { cities } = useCities();
  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country, i) => (
        <CountryItem country={country} key={i} />
      ))}
    </ul>
  );
}

export default CountryList;
