import './index.css';
import React, { useState, useEffect } from 'react';
import Api from '../../api/index';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [pokemonData, setPokemonData] = useState([]);
  const [nomePokemon, setNomePokemon] = useState('');
  const [pesquisa, setPesquisa] = useState(null);
  const [filtrados, setFiltrados] = useState([]);
  const [filterClass, setFilterClass] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pokemons = [];

        for (let i = 1; i <= 100; i++) {
          const pokemonResponse = await Api.get(`/${i}`);
          pokemons.push(pokemonResponse.data);
        }

        setPokemonData(pokemons);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const enterClique = async (e) => {
    if (e.key === 'Enter') {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nomePokemon}`);
        setPesquisa(response.data);
        setFiltrados([]);
      } catch (error) {
        console.log('Erro na pesquisa', error);
        setPesquisa(null);
        setFiltrados([]);
      }
    }
  };

  const clearSearch = () => {
    setNomePokemon('');
    setPesquisa(null);
    setFilterClass(''); // Reset the filterClass state to its initial value
    navigate('/');
    // Reset the filtrados state to the original pokemonData
    setFiltrados(pokemonData);
  };
  

  useEffect(() => {
    const filteredData = pokemonData.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(nomePokemon.toLowerCase())
    );
    setFiltrados(filteredData);
  }, [pokemonData, nomePokemon]);

  console.log(filterClass)

// Define your filter function
const filterPokemonByType = () => {
  if (filterClass === '') {
    // If filterClass is empty, display all Pokémon
    setFiltrados(pokemonData);
  } else {
    const classFilter = pokemonData.filter((pokemon) => {
      return pokemon.types.some((type) => type.type.name === filterClass);
    });
    setFiltrados(classFilter);
  }
};

useEffect(() => {
  filterPokemonByType(); // Call the filtering function
}, [pokemonData, filterClass]);



  return (
    <>
      <div className='inputs'>
        <input
          type="text"
          onKeyDown={enterClique}
          placeholder='Digite o nome do Pokémon e pressione Enter'
          value={nomePokemon}
          onChange={(e) => setNomePokemon(e.target.value)}
        />
        <button onClick={clearSearch}>Limpar e voltar</button>
        <select name="" id="" onChange={(e) => setFilterClass(e.target.value)}>
        <option value="normal" >normal</option>
        <option value="water" >water</option>
        <option value="electric" >eletric</option>
        <option value="flying">flying</option>
        <option value="fire" >fire</option>
        <option value="poison" >poison</option>
        <option value="grass" >grass</option>
        <option value="bug" >bug</option>
        <option value="ground" >ground</option>
      </select>
      </div>
      <div className='container'>
        {pesquisa ? (
          <div className='pokemon-container' key={pesquisa.id}>
            <div className='descriptionPokemon'>
              <div className='nomePokemon'>
                <h2>NAME:</h2>
                <span>{pesquisa.name}</span>
              </div>
              <div className='classePokemon'>
                <h2>CLASS:</h2>
                <ul>
                  {pesquisa.types.map((type, index) => (
                    <li key={index}>{type.type.name}</li>
                  ))}
                </ul>
              </div>
              <div className='image-pokemon'>
                <img src={pesquisa.sprites.front_default} alt={pesquisa.name} />
              </div>
              <div className='habilidades'>
                <h2>Powers</h2>
                {pesquisa.abilities.map((ability) => (
                  <span key={ability.ability.name}>
                    {ability.ability.name}<br></br>
                  </span>
                ))}
              </div>
              <Link to={`/sobre/${pesquisa.id}`}>Ver Sobre</Link>
            </div>
          </div>
        ) : (
          filtrados.map((item) => (
            <div className='pokemon-container' key={item.id}>
              <div className='descriptionPokemon'>
                <div className='nomePokemon'>
                  <h2>NAME:</h2>
                  <span>{item.name}</span>
                </div>
                <div className='classePokemon'>
                  <h2>CLASS:</h2>
                  <ul>
                    {item.types.map((type, index) => (
                      <li key={index}>{type.type.name}</li>
                    ))}
                  </ul>
                </div>
                <div className='image-pokemon'>
                  <img src={item.sprites.front_default} alt={item.name} />
                </div>
                <div className='habilidades'>
                  <h2>Powers</h2>
                  {item.abilities.map((ability) => (
                    <span key={ability.ability.name}>
                      {ability.ability.name}<br></br>
                    </span>
                  ))}
                </div>
                <Link className='link' to={`/sobre/${item.id}`}>Ver Sobre</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
