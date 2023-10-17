import './index.css';
import { useState, useEffect } from 'react';
import Api from '../../api/index';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'

export default function Home() {
    const [pokemonData, setPokemonData] = useState([]);
    const navigate = useNavigate

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

    console.log(pokemonData);

    return (
        <div className='container'>
            {pokemonData.map((item) => (
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
            ))}
        </div>
    );
}
