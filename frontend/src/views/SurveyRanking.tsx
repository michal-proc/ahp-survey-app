import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {FaSpinner, FaArrowLeft} from "react-icons/fa";
import {MdError} from "react-icons/md";
import ColorManager from "../helpers/ColorManager";
import {Model, ModelResults} from "../interfaces/Model";
import RankingTable from "../components/RankingTable";

const API_URL = import.meta.env.VITE_API_URL;
const API_PREFIX = import.meta.env.VITE_API_PREFIX;
const colorManager = new ColorManager();

function SurveyRanking() {
    const {id} = useParams();

    const [survey, setSurvey] = useState<Model | null>(null);
    const [surveyResults, setSurveyResults] = useState<ModelResults | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSurvey = async () => {
        try {
            const response = await fetch(`${API_URL}${API_PREFIX}/models/${id}`);
            if (response.status === 200) {
                const responseData = await response.json();
                setSurvey(responseData.data as Model);
                document.title = `RedPill Surveys - ${responseData.data.name}`;
            } else {
                const errorData = await response.json();
                toast.error(errorData.detail || "Wystąpił błąd podczas pobierania danych ankiety.");
                setError(errorData.detail || "Wystąpił błąd podczas pobierania danych ankiety.");
            }
        } catch (err) {
            toast.error("Wystąpił błąd podczas pobierania danych ankiety.");
            setError("Wystąpił błąd podczas pobierania danych ankiety.");
        }
    };

    const fetchSurveyResults = async () => {
        try {
            const response = await fetch(`${API_URL}${API_PREFIX}/models/${id}/rankings`);
            if (response.status === 200) {
                const responseData = await response.json();
                setSurveyResults(responseData.data as ModelResults);
            } else {
                const errorData = await response.json();
                toast.error(errorData.detail || "Wystąpił błąd podczas pobierania wyników ankiety.");
                setError(errorData.detail || "Wystąpił błąd podczas pobierania wyników ankiety.");
            }
        } catch (err) {
            toast.error("Wystąpił błąd podczas pobierania wyników ankiety.");
            setError("Wystąpił błąd podczas pobierania wyników ankiety.");
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchSurvey(), fetchSurveyResults()]).finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <FaSpinner className="animate-spin text-4xl text-gray-500"/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <MdError className="text-red-500 text-6xl mb-4"/>
                <h1 className="text-4xl font-bold">
                    <span style={{color: colorManager.getColor("color5")}}>Wystąpił błąd serwera</span>
                </h1>
            </div>
        );
    }

    const getPlaceColor = (index: number) => {
        switch (index) {
            case 1:
                return "gold";
            case 2:
                return "silver";
            case 3:
                return "#804A00";
            default:
                return colorManager.getColor("color1");
        }
    };

    const overallRanking = Object.entries(surveyResults?.overall_scores || {})
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
        .map(([id, score]) => ({
            id,
            name: survey?.alternatives.find((alt) => alt.id === id)?.name || "Nieznana",
            score: score * 100,
        }));

    const alternativeRankings = surveyResults
        ? Object.entries(surveyResults.alternative_weights).map(([criterionId, weights]) => ({
            criterion: survey?.criteria.find((crit) => crit.id === criterionId)?.name || "Nieznane kryterium",
            alternatives: Object.entries(weights)
                .sort(([, weightA], [, weightB]) => weightB - weightA)
                .map(([altId, weight]) => ({
                    id: altId,
                    name: survey?.alternatives.find((alt) => alt.id === altId)?.name || "Nieznana",
                    score: weight * 100,
                })),
        }))
        : [];

    const criterionRanking = Object.entries(surveyResults?.criteria_weights || {})
        .sort(([, weightA], [, weightB]) => weightB - weightA)
        .map(([id, weight]) => ({
            id,
            name: survey?.criteria.find((crit) => crit.id === id)?.name || "Nieznane kryterium",
            score: weight * 100,
        }));

    const alternativeConsistencyRatios = Object.entries(surveyResults?.alternative_consistency_ratios || {}).map(
        ([criterionId, ratio]) => ({
            criterion: survey?.criteria.find((crit) => crit.id === criterionId)?.name || "Nieznane kryterium",
            ratio: ratio.toFixed(4),
        })
    );

    const criteriaConsistencyRatio = surveyResults?.criteria_consistency_ratio?.toFixed(4);

    return (
        <div className="container mx-auto p-6">
            <header className="mb-6 flex items-center justify-between">
                <h1 className="text-4xl font-bold">
                    <span style={{color: colorManager.getColor("black")}}>Wyniki ankiety</span>
                </h1>
                <Link
                    to={`/surveys/${id}`}
                    className="flex items-center space-x-2 group"
                    style={{color: colorManager.getColor("color2")}}
                >
                    <FaArrowLeft className="text-4xl transition-transform duration-300 group-hover:-translate-x-1 mr-10" />
                </Link>
            </header>

            <div className="mb-10">
                <RankingTable
                    title="Główny Ranking Alternatyw"
                    data={overallRanking}
                    getPlaceColor={getPlaceColor}
                />
            </div>

            <h2 className="text-2xl font-bold mb-6">
                <span style={{color: colorManager.getColor("blackRed")}}>Rankingi alternatyw</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {alternativeRankings.map((ranking, index) => (
                    <RankingTable
                        key={index}
                        title={`Ranking dla kryterium: ${ranking.criterion}`}
                        data={ranking.alternatives}
                        getPlaceColor={getPlaceColor}
                    />
                ))}
            </div>

            {criterionRanking.length > 1 && (
                <>
                    <h2 className="text-2xl font-bold mb-6">
                        <span style={{color: colorManager.getColor("blackRed")}}>Ranking kryteriów</span>
                    </h2>
                    <div className="mb-10">
                        <RankingTable
                            title="Ranking Kryteriów"
                            data={criterionRanking}
                            getPlaceColor={getPlaceColor}
                        />
                    </div>
                </>
            )}

            <h2 className="text-2xl font-bold mb-6">
                <span style={{color: colorManager.getColor("blackRed")}}>Macierze niespójności</span>
            </h2>

            <p className="text-gray-700 ml-6 mb-2">
                <strong>Dla kryteriów =</strong> {criteriaConsistencyRatio}
            </p>
            {alternativeConsistencyRatios.map((item, index) => (
                <p key={index} className="text-gray-700 mb-2 ml-6">
                    <strong>Dla alternatywy {item.criterion} =</strong> {item.ratio}
                </p>
            ))}
        </div>
    );
}

export default SurveyRanking;
