import './index.css'
import api from '../../api/index'
import { useEffect, useState } from "react";
import { useParams, useNavigate } from'react-router-dom'


export default function Sobre(){
    const navigate = useNavigate()
    const { id } = useParams();
    const [ pokemonData, setPokemonData ] = useState({});
    const [loading, setLoading] = useState(true)

        useEffect(()=>{
            async function loadPokemon(){
                await api.get(`/${id}`)
                .then((response)=>{
                    setPokemonData(response.data)
                    setLoading(false)
                })
                .catch(()=>{
                    console.log('pokemon não encontrado')
                    navigate("/", {replace: true})
                    return
                })
            }
            loadPokemon();
                
        }, [ navigate, id])

    return(
        <>
        <div className='container-sobre'>
            <div className='sobre'>
                 <h1 className='nome'>{pokemonData.name}</h1>
                 <div className='foto'>
                 {pokemonData.sprites && <img src={pokemonData.sprites.front_default} alt={pokemonData.name}></img>}
                 </div>     
                 <div className='skills'>
                    <div className='stats'>
                        <div className='spanAtk'>
                            <span>HP</span>  
                            <span>ATK</span>  
                            <span>DEF</span>  
                            <span>SPATK</span>  
                            <span>SPDEF</span> 
                            <span>SPD</span> 
                        </div>
                        <div  className='spanNumbers'>
                        {pokemonData.stats && pokemonData.stats.map((item, index) => (
                                <span key={index}>{item.base_stat}</span>
                            ))}
                        </div>
                       <div className='linhas'>
                       {pokemonData.stats && pokemonData.stats.map((item) => (
                                <div className='linha' key={item.stat.name}>
                                    <div
                                        className='linhaPreenchida'
                                        style={{ width: `${item.base_stat}%` }}
                                    ></div>
                                </div>
                            ))}
                       </div>
                    </div>             
                 </div>           
            </div>
        </div>
           
        </>
    )
}