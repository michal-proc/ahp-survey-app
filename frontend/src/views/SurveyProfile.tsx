import {Link, useParams} from 'react-router-dom';
import {FaSpinner, FaUserAlt, FaListAlt, FaUsers, FaDownload, FaTrophy} from "react-icons/fa";
import {MdError} from "react-icons/md";
import React, {useState, useEffect} from "react";
import ColorManager from "../helpers/ColorManager";
import {Model} from "../interfaces/Model";
import {toast} from "react-toastify";
import AhpForm from "../components/AhpForm";

const API_URL = import.meta.env.VITE_API_URL;
const API_PREFIX = import.meta.env.VITE_API_PREFIX;
const colorManager = new ColorManager();

function SurveyProfile() {
    const [survey, setSurvey] = useState<Model | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {id} = useParams();

    const fetchSurvey = async () => {
        try {
            const response = await fetch(`${API_URL}${API_PREFIX}/models/${id}`);
            if (response.status === 200) {
                const responseData = await response.json();
                setSurvey(responseData.data as Model);
                // @ts-ignore
                document.title = `RedPill Surveys - ${responseData.data.name}`;
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.detail || "Wystąpił błąd podczas pobierania danych ankiety.";
                if (!toast.isActive("toast")) {
                    toast.error(errorMessage, {toastId: "toast"});
                }
                setError(errorMessage);
            }
        } catch (err: unknown) {
            const errorMessage =
                (err as { detail?: string }).detail || "Wystąpił błąd podczas pobierania danych ankiety.";
            if (!toast.isActive("toast")) {
                toast.error(errorMessage, {toastId: "toast"});
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const downloadSurvey = async () => {
        try {
            const response = await fetch(`${API_URL}${API_PREFIX}/models/${id}/export`);
            if (response.status === 200) {
                const json = await response.json();
                const blob = new Blob([JSON.stringify(json.data, null, 2)], {type: "application/json"});
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                const now = new Date();
                const dateString = now.toISOString().split("T")[0];
                link.download = `survey_${dateString}.json`;
                link.click();
                URL.revokeObjectURL(url);
                toast.success("Plik został pobrany!");
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.detail || "Wystąpił błąd podczas eksportu ankiety.";
                toast.error(errorMessage);
            }
        } catch (err) {
            const errorMessage = "Nie udało się pobrać pliku.";
            toast.error(errorMessage);
        }
    };


    useEffect(() => {
        fetchSurvey().then(() => {
            // Nothing to do
        });
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

    return (
        <div className="container mx-auto p-6 space-y-6">
            <header className="mb-6">
                <h1 className="text-4xl font-bold">
                    <span style={{color: colorManager.getColor("black")}}>Profil Ankiety</span>
                </h1>
            </header>

            {survey && (
                <div className="space-y-6">
                    <div
                        className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                        <div
                            className="w-20 h-20 flex items-center justify-center rounded-full text-white font-bold text-3xl"
                            style={{backgroundColor: colorManager.getColor("color1")}}
                        >
                            {survey.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">
                                <span style={{color: colorManager.getColor("color1")}}>{survey.name}</span>
                            </h2>
                            <div className="flex space-x-6">
                                <div className="flex items-center space-x-2">
                                    <FaListAlt className="text-gray-600"/>
                                    <p className="text-gray-700">
                                        Alternatywy: <span className="font-semibold">{survey.alternatives.length}</span>
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FaUserAlt className="text-gray-600"/>
                                    <p className="text-gray-700">
                                        Kryteria: <span className="font-semibold">{survey.criteria.length}</span>
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FaUsers className="text-gray-600"/>
                                    <p className="text-gray-700">
                                        Odpowiedzi ekspertów: <span className="font-semibold">{survey.expert_inputs.length}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-end w-full md:w-auto">
                            <Link
                                to={`/surveys/${survey.model_id}/ranking`}
                                className="text-blue-500 font-semibold flex items-center space-x-2 mb-4"
                            >
                                <FaTrophy style={{color: colorManager.getColor("color4")}}/>
                                <span style={{color: colorManager.getColor("color4")}}>Zobacz wyniki</span>
                            </Link>
                            <button
                                onClick={downloadSurvey}
                                className="text-blue-500 font-semibold flex items-center space-x-2"
                            >
                                <FaDownload style={{color: colorManager.getColor("color4")}}/>
                                <span style={{color: colorManager.getColor("color4")}}>Pobierz JSON</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="text-xl font-bold mb-4" style={{color: colorManager.getColor("color2")}}>
                                Alternatywy
                            </h3>
                            <ul className="space-y-4">
                                {survey.alternatives.map((alternative) => (
                                    <li key={alternative.id} className="flex items-center space-x-4">
                                        <div
                                            className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold"
                                            style={{backgroundColor: colorManager.getColor("color1")}}
                                        >
                                            {alternative.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-gray-800">{alternative.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="text-xl font-bold mb-4" style={{color: colorManager.getColor("color3")}}>
                                Kryteria
                            </h3>
                            <ul className="space-y-4">
                                {survey.criteria.map((criterion) => (
                                    <li key={criterion.id} className="flex items-center space-x-4">
                                        <div
                                            className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold"
                                            style={{backgroundColor: colorManager.getColor("color2")}}
                                        >
                                            {criterion.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-gray-800">{criterion.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <AhpForm survey={survey} onSaveSuccess={fetchSurvey}/>
                </div>
            )}
        </div>
    );
}

export default SurveyProfile;
