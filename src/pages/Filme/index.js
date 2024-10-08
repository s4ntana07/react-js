import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './filme-info.css'
import api from '../../services/api';
import { toast } from 'react-toastify'

function Filme() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [filme, setFilme] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFilmes() {
            await api.get(`/movie/${id}`, {
                params: {
                    api_key: "07d80ac17d896060bb667412d2b53b61",
                    language: "pt-BR",
                    page: 1,
                }
            })
                .then((response) => {
                    setFilme(response.data);
                    console.log(response.data)
                    setLoading(false)
                })
                .catch(() => {
                    console.log("Filme não Encontrado");
                    navigate("/", { replace: true })
                    return;
                })
        }

        loadFilmes();

        return () => {
            console.log("Componente foi Desmontado")
        }
    }, [navigate, id])

    function salvarFilme() {
        const minhaLista = localStorage.getItem("@primeflix")

        let filmesSalvos = JSON.parse(minhaLista) || [];

        const hasFilme = filmesSalvos.some((filmesSalvos) => filmesSalvos.id === filme.id)

        if (hasFilme) {
            toast.warn("Esse Filme ja está em sua Lista")
            return;
        }

        filmesSalvos.push(filme);
        localStorage.setItem("@primeflix", JSON.stringify(filmesSalvos));
        toast.success("Filme salvo com sucesso")

    }

    if (loading) {
        return (
            <div className="filme-info">
                <h1>Carregando Detalhes...</h1>
            </div>
        )
    }

    return (
        <div className="filme-info">
            <h1>{filme.title}</h1>
            <img src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`} alt={filme.title} />

            <h3>Sinopse</h3>
            <span>{filme.overview}</span><br />
            <strong>Avalição: {filme.vote_average} / 10</strong><br />
            <strong>Data de Lançamento: {filme.release_date}</strong><br />

            <div className="area-buttons">
                <button onClick={salvarFilme}>Salvar</button>
                <button>
                    <a target="blank" rel="external" href={`https://youtube.com/results?search_query=${filme.title} Trailer`}>
                        Trailer
                    </a>
                </button>
            </div>

        </div>
    )
}

export default Filme;