import React, { useEffect, useState } from "react";

function App() {
  const [imgUrl, setImgUrl] = useState([]);
  const [randomList, setRandomList] = useState([]);
  const [clickedSet, setClickedSet] = useState(new Set());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const fetchPokemons = async () => {
      const urls = [];
      for (let i = 1; i <= 20; i++) {
        urls.push(`https://pokeapi.co/api/v2/pokemon/${i}`);
      }

      const fetchedImages = await Promise.all(
        urls.map(async (url) => {
          const response = await fetch(url);
          const data = await response.json();
          return {
            id: data.id,
            sprite:
              data.sprites.versions["generation-iii"]["firered-leafgreen"]
                .front_default,
          };
        })
      );

      setImgUrl(fetchedImages);
    };

    fetchPokemons();
  }, []);

  useEffect(() => {
    if (imgUrl.length > 0) {
      setRandomList(getRandomPokemon(imgUrl, 10));
    }
  }, [imgUrl]);

  function getRandomPokemon(arr, numElements) {
    let shuffled = arr.slice();
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, numElements);
  }

  function handleClick(e) {
    const imgSrc = e.currentTarget.querySelector("img").src;

    setClickedSet((prevSet) => {
      const newSet = new Set(prevSet);
      if (newSet.has(imgSrc)) {
        if (score > highScore) {
          setHighScore(score);
        }
        setScore(0);
        return new Set();
      } else {
        const newScore = score + 1;
        setScore(newScore);
        newSet.add(imgSrc);
        setRandomList(getRandomPokemon(imgUrl, 10));
        return newSet;
      }
    });
  }

  return (
    <>
      <div className="container m-auto grid grid-cols-5 gap-5">
        {randomList.map(({ id, sprite }) => (
          <div
            key={id}
            onClick={handleClick}
            className="border rounded-sm flex justify-center items-center cursor-pointer"
          >
            <img src={sprite} alt={`Pokemon ${id}`} />
          </div>
        ))}
      </div>
      <div className="scoreboard mt-4 text-center">
        <h2>Score: {score}</h2>
        <h2>High Score: {highScore}</h2>
      </div>
    </>
  );
}

export default App;
