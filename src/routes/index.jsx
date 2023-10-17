import { Routes, Route } from 'react-router-dom'
import Home from '../components/Home'
import Sobre from '../components/Sobre'


export default function RoutesApp(){
    return(
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/sobre/:id' element={<Sobre/>}/>
        </Routes>
    )
}