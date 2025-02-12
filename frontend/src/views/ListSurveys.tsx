import React, {useEffect, useState} from "react";
import {Model} from "../interfaces/Model";
import {FaChartBar, FaEye, FaSpinner, FaTrashAlt} from "react-icons/fa";
import {toast} from "react-toastify";
import ColorManager from "../helpers/ColorManager";
import {MdError} from "react-icons/md";
import {Link} from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const API_PREFIX = import.meta.env.VITE_API_PREFIX;
const colorManager = new ColorManager();

function ListSurveys() {
    const [models, setModels] = useState<Model[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const deleteModel = async (modelId: string) => {
        try {
            const response = await fetch(`${API_URL}${API_PREFIX}/models/${modelId}`, {
                method: "DELETE",
            });

            if (response.status === 200) {
                const responseData = await response.json();
                toast.success(`Model "${responseData.data.name}" został usunięty`);
                setModels((prevModels) => prevModels.filter((model) => model.model_id !== modelId));
            } else {
                toast.error("Wystąpił błąd podczas usuwania modelu");
            }
        } catch (error) {
            toast.error("Wystąpił błąd podczas usuwania modelu");
        }
    };

    useEffect(() => {
        document.title = `RedPill Surveys - Lista ankiet`;

        const fetchModels = async () => {
            try {
                const response = await fetch(`${API_URL}${API_PREFIX}/models`);
                const responseData = await response.json();
                const data: Model[] = responseData.data;
                setModels(data);
            } catch (err: unknown) {
                if (!toast.isActive("toast")) {
                    toast.error("Wystąpił błąd podczas ładowania listy ankiet", {toastId: "toast"});
                }
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchModels().then(() => {
            // Nothing to do
        });
    }, []);

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
        <div className="container mx-auto p-6">
            <header className="mb-6">
                <h1 className="text-4xl font-bold">
                    <span style={{color: colorManager.getColor("black")}}>Lista ankiet</span>
                </h1>
            </header>
            <div className="overflow-x-auto">
                {models.length === 0 ? (
                    <div className="text-center py-6">
                        <p className="text-gray-500">
                            Nie znaleziono żadnych modeli decyzyjnych. Możesz je dodać w panelu "Stwórz ankietę".
                        </p>
                    </div>
                ) : (
                    <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300"></th>
                            <th className="border border-gray-300 px-6 py-3 text-left font-medium text-gray-600">
                                Nazwa
                            </th>
                            <th className="border border-gray-300 px-6 py-3 text-left font-medium text-gray-600">
                                Liczba Alternatyw
                            </th>
                            <th className="border border-gray-300 px-6 py-3 text-left font-medium text-gray-600">
                                Liczba Kryteriów
                            </th>
                            <th className="border border-gray-300 px-6 py-3 text-left font-medium text-gray-600">
                                Liczba Ekspertów
                            </th>
                            <th className="border border-gray-300 px-6 py-3 text-left font-medium text-gray-600">
                                Akcje
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {models.map((model) => (
                            <tr key={model.model_id} className="hover:bg-gray-50 even:bg-gray-50/50">
                                <td className="border border-gray-300 px-3 py-3 text-center">
                                    <div
                                        className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold mx-auto"
                                        style={{backgroundColor: colorManager.getColor("color1")}}
                                    >
                                        {model.name.charAt(0).toUpperCase()}
                                    </div>
                                </td>
                                <td className="border border-gray-300 px-6 py-4">{model.name}</td>
                                <td className="border border-gray-300 px-6 py-4">
                                    {model.alternatives.length}
                                </td>
                                <td className="border border-gray-300 px-6 py-4">
                                    {model.criteria.length}
                                </td>
                                <td className="border border-gray-300 px-6 py-4">
                                    {model.expert_inputs.length}
                                </td>
                                <td className="border border-gray-300 px-6 py-4">
                                    <div className="flex flex-row space-x-2 items-center">
                                        <Link
                                            to={`/surveys/${model.model_id}`}
                                            className="text-blue-500 flex items-center hover:underline"
                                        >
                                            <FaEye className="inline" title="Odpowiedz na pytania"/>
                                        </Link>
                                        <Link
                                            to={`/surveys/${model.model_id}/rankings`}
                                            className="text-green-500 flex items-center hover:underline"
                                        >
                                            <FaChartBar className="inline" title="Zobacz ranking"/>
                                        </Link>
                                        <button
                                            onClick={() => deleteModel(model.model_id)}
                                            className="text-red-500 flex items-center hover:underline"
                                        >
                                            <FaTrashAlt className="inline" title="Usuń model decyzyjny"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default ListSurveys;
