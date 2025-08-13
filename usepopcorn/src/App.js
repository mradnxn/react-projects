import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovie } from "./useMovies";
import { useLocalStorage } from "./useLocalStorage";
import { useKey } from "./useKey";

const KEY = "5a52a96d";
export default function App() {
  const [query, setQuery] = useState("");
  // const [watched, setWatched] = useState(function () {
  //   const saved = localStorage.getItem("watched");
  //   return JSON.parse(saved);
  // });
  // const [movies, setMovies] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  // const defQuery = "tenet";
  const { movies, isLoading, error } = useMovie(query);
  const [watched, setWatched] = useLocalStorage([], "watched");

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleBackButton() {
    setSelectedId(null);
  }

  function onAddWatchList(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function onDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar query={query} setQuery={setQuery}>
        <NumResult movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} handleSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              handleBackButton={handleBackButton}
              onAddWatchList={onAddWatchList}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                onDeleteWatched={onDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}
function Loader() {
  return <p className="loader">Loading...</p>;
}

function NavBar({ query, setQuery, children }) {
  return (
    <nav className="nav-bar">
      <Logo />

      <SearchBar query={query} setQuery={setQuery} />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchBar({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey("Enter", () => {
    if (document.activeElement === inputEl.current) {
      return;
    }
    inputEl.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, handleSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handleSelectMovie={handleSelectMovie}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handleSelectMovie }) {
  return (
    <li on onClick={() => handleSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
function MovieDetails({
  selectedId,
  handleBackButton,
  onAddWatchList,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAddWatchlist() {
    const movie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      userRating,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
    };
    onAddWatchList(movie);
    handleBackButton();
  }

  useKey("Escape", handleBackButton);

  useEffect(
    function () {
      async function fetchDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      fetchDetails();
    },
    [selectedId]
  );

  useEffect(function () {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return function () {
      document.title = "usePopcorn";
    };
  });

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleBackButton}>
              &larr;
            </button>
            <img src={poster} alt={`Poster Of ${title}`}></img>
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAddWatchlist}>
                      + Add to watchlist
                    </button>
                  )}
                </>
              ) : (
                <p>
                  you rated this movie {watchedUserRating}
                  <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(
    watched.map((movie) => movie.imdbRating)
  ).toFixed(1);
  const avgUserRating = average(
    watched.map((movie) => movie.userRating)
  ).toFixed(2);
  const avgRuntime = average(watched.map((movie) => movie.runtime)).toFixed(2);
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          x
        </button>
      </div>
    </li>
  );
}
