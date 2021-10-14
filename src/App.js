import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Card from './components/Card';
import { getPokemon, getAllPokemon } from './services/pokemon';
import './App.css';


function App() {
  const [pokemonData, setPokemonData] = useState([])
  const [nextPgUrl, setnextPgUrl] = useState('');
  const [prevPgUrl, setprevPgUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const initialURL = 'https://pokeapi.co/api/v2/pokemon?limit=50&offset=200.'



  useEffect(() => {


    async function fetchData() {
      let response = await getAllPokemon(initialURL)
      setnextPgUrl(response.next);
      setprevPgUrl(response.previous);
      await loadPk(response.results);
      setLoading(false);
    }

    fetchData();


  }, [])

  const prevPg = async () => {
    if (!prevPgUrl) return;
    setLoading(true);
    let data = await getAllPokemon(prevPgUrl);
    await loadPk(data.results);
    setnextPgUrl(data.next);
    setprevPgUrl(data.previous);
    setLoading(false);
  }



  const nextPg = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextPgUrl);
    await loadPk(data.results);
    setnextPgUrl(data.next);
    setprevPgUrl(data.previous);
    setLoading(false);
  }

  const loadPk = async (data) => {
    let _pokemonData = await Promise.all(data.map(async pokemon => {
      let pokemonRecord = await getPokemon(pokemon)
      return pokemonRecord
    }))
    setPokemonData(_pokemonData);
  }
  // eslint-disable-next-line
  return (
    <>
      <Header />
      <div>
        {loading ? <h1 style={{ textAlign: 'center' }}>Carregando...</h1> : (
          <>
            <div className="btn">
              <button onClick={prevPg}>Anterior</button>
              <button onClick={nextPg}>Próximo</button>
            </div>
            <a href="">
              <div className="grid-container">
                {pokemonData.map((pokemon, i) => {
                  return <Card key={i} pokemon={pokemon} />
                })}
              </div>
            </a>
          </>
        )}
      </div>
    </>
  );
}

export default App;