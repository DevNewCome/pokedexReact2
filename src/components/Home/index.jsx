import './index.css';
import { useState, useEffect } from 'react';
import Api from '../../api/index';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
    const [pokemonData, setPokemonData] = useState([]);
    const [nomePokemon, setNomePokemon] = useState('');
    const [pokemonPesquisado, setPokemonPesquisado] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pokemons = [];

                for (let i = 1; i <= 150; i++) {
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

    const enterClique = (e) => {
        if (e.key === 'Enter') {
            buscaPokemon();
        }
    }

    async function buscaPokemon() {
        try {
            let api = `https://pokeapi.co/api/v2/pokemon/`;
            let pokemonResponse = await axios.get(`${api}${nomePokemon}`);
            setPokemonPesquisado(pokemonResponse.data);
        } catch {
            console.log('Erro');
        }
    }

    // Filtra os Pokémon com base no nome digitado
    // retorne o nome dos pokemons que incluem o nome que estou digitandoo
    const pokemonFiltrado = pokemonData.filter((pokemon) => {
        return pokemon.name.toLowerCase().includes(nomePokemon.toLowerCase())
    })

    return (
        <>
            <div className='inputs'>
                <input type="text" onKeyDown={enterClique} placeholder='digite o nome' value={nomePokemon} onChange={(e) => setNomePokemon(e.target.value)} />
            </div>
            <div className='container'>
                {nomePokemon ? (
                      pokemonFiltrado.map((item) => (
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
                            </div>
                            <div className='image-pokemon'>
                                <img src={item.sprites.front_default} alt={item.name} />
                            </div>
                            <div className='habilidades'>
                                <h2>Powers</h2>
                                {item.abilities.map((ability) => (
                                    <span key={ability.ability.name}>{ability.ability.name}<br></br></span>
                                ))}
                            </div>
                            <Link to={`/sobre/${item.id}`}>Ver Sobre</Link>
                        </div>
                    ))
                ): (
                    pokemonData.map((item) => (
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
                            </div>
                                    <div className='image-pokemon'>
                                <img src={item.sprites.front_default} alt={item.name} />
                                  </div>
                                  <div className='habilidades'>
                                <h2>Powers</h2>
                                {item.abilities.map((ability) => (
                                    <span key={ability.ability.name}>{ability.ability.name}<br></br></span>
                                ))}
                                 </div>
                                 <Link to={`/sobre/${item.id}`}>Ver Sobre</Link>
                            </div>
                    ))
                )}
            </div>
        </>
    );
}
