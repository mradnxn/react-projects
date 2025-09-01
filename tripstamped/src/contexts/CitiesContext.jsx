/* eslint-disable react/prop-types */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const BASE_URL = "http://localhost:8000";

const CitiesProvider = createContext();
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };

    case "rejected":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case "cities/loaded":
      return {
        ...state,
        cities: action.payload,
        isLoading: false,
      };

    case "city/selected":
      return {
        ...state,
        currentCity: action.payload,
        isLoading: false,
      };

    case "city/uploaded":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      };
    default:
      throw new Error("undefined action type");
  }
}

function CitiesContext({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function FetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "there was an error loading data",
        });
      }
    }
    FetchCities();
  }, []);

  const getCity = useCallback(async function getCity(id) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/selected", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "there was an error getting city data",
      });
    }
  }, []);

  async function postCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/uploaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "there was an error uploading data",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "there was an error deleting data",
      });
    }
  }

  return (
    <CitiesProvider.Provider
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
        postCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesProvider.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesProvider);
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { CitiesContext, useCities };
