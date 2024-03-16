import React, { useState, useEffect } from 'react';
import Api from '../../api/index';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './index.css'

export default function Home() {
  const [pokemonData, setPokemonData] = useState([]);
  const [nomePokemon, setNomePokemon] = useState('');
  const [pesquisa, setPesquisa] = useState(null);
  const [filtrados, setFiltrados] = useState([]);
  const [filterClass, setFilterClass] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Estado para controlar a página atual
  const [itemsPerPage] = useState(32); // Número de itens por página
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pokemons = [];

        for (let i = 1; i <= 300; i++) {
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

  useEffect(() => {
    filterPokemonByType(); // Chamando a função de filtro inicialmente
  }, [pokemonData, filterClass, currentPage]); // Atualize sempre que houver mudanças nos dados, na classe de filtro ou na página atual

  const filterPokemonByType = () => {
    let filteredData = pokemonData; // Comece com os dados brutos

    if (nomePokemon.trim() !== '') {
      // Se um nome de Pokemon estiver sendo pesquisado, aplique a filtragem
      filteredData = filteredData.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(nomePokemon.toLowerCase())
      );
    }

    if (filterClass !== '') {
      // Se houver uma classe selecionada, filtre os resultados
      filteredData = filteredData.filter((pokemon) =>
        pokemon.types.some((type) => type.type.name === filterClass)
      );
    }

    // Calcule o índice do primeiro e último item na página atual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Atualize os resultados para exibir apenas os itens da página atual
    setFiltrados(filteredData.slice(indexOfFirstItem, indexOfLastItem));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // Atualize a página atual
  };

  const searchPokemon = async () => {
    console.log("Pesquisando Pokémon:", nomePokemon);
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${nomePokemon}`
      );
      console.log("Resposta da API:", response.data);
      setPesquisa(response.data);
      setFiltrados([]);
      setNomePokemon(''); // Limpa o campo de pesquisa
      setFilterClass(''); // Limpa a classe de filtro
    } catch (error) {
      console.log('Erro na pesquisa', error);
      setPesquisa(null);
      setFiltrados([]);
    }
  };
  
  
  

  const clearSearch = () => {
    setNomePokemon('');
    setPesquisa(null);
    setFilterClass('');
    navigate('/');
    setCurrentPage(1); // Resetar a página atual para 1
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <button className='top' onClick={scrollToTop}>
        top
      </button>
      <div className='inputs'>
        <input
          type='text'
          placeholder='Não encontrou ? Pesquise o nome do seu pokemon'
          value={nomePokemon}
          onChange={(e) => setNomePokemon(e.target.value)}
        />
        <button onClick={searchPokemon}>Pesquisar</button>
        <button onClick={clearSearch}>Limpar e voltar</button>
        <select
          name=''
          id=''
          onChange={(e) => setFilterClass(e.target.value)}
        >
          <option value=''>Todos</option>
          <option value='normal'>normal</option>
          <option value='water'>water</option>
          <option value='electric'>eletric</option>
          <option value='flying'>flying</option>
          <option value='fire'>fire</option>
          <option value='poison'>poison</option>
          <option value='grass'>grass</option>
          <option value='bug'>bug</option>
          <option value='ground'>ground</option>
        </select>
      </div>
      <div className='container'>
        {pesquisa ? ( // Verifica se há um Pokémon pesquisado
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
                {pesquisa.abilities.map((ability, index) => (
                  <span key={index}>{ability.ability.name}</span>
                ))}
              </div>
              <Link className='link' to={`/sobre/${pesquisa.id}`}>
                Ver Sobre
              </Link>
            </div>
          </div>
        ) : (
          // Se não houver um Pokémon pesquisado, exibe os Pokémon filtrados
          <div className='container'>
            {filtrados.length > 0 ? (
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
                      {item.abilities.map((ability, index) => (
                        <span key={index}>{ability.ability.name}</span>
                      ))}
                    </div>
                    <Link className='link' to={`/sobre/${item.id}`}>
                      Ver Sobre
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div>Nenhum Pokémon encontrado.</div>
            )}
          </div>
        )}
      </div>
      {/* Adicionar botões de paginação */}
      <div>
        {filtrados.length > 0 && (
          <ul className='pagination'>
            {[...Array(Math.ceil(pokemonData.length / itemsPerPage)).keys()].map(
              (number) => (
                <li
                  key={number + 1}
                  className={
                    number + 1 === currentPage ? 'active' : undefined
                  }
                >
                  <button onClick={() => handlePageChange(number + 1)}>
                    {number + 1}
                  </button>
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </>
  );
  
}
