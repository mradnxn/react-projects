/* eslint-disable react/prop-types */

import styles from "./CityList.module.css";
import CityItem from "./CityItem";
import { useCities } from "../contexts/CitiesContext";
import Spinner from "./Spinner";

function CityList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
