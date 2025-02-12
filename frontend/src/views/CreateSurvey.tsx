import React, {useEffect, useState} from "react";
import {FaPlus, FaMinus, FaSpinner} from "react-icons/fa";
import ColorManager from "../helpers/ColorManager";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;
const API_PREFIX = import.meta.env.VITE_API_PREFIX;
const colorManager = new ColorManager();

interface SurveyData {
    name: string;
    criteria: string[];
    alternatives: string[];
}

function CreateSurvey() {
    useEffect(() => {
        document.title = "RedPill Surveys - Tworzenie Ankiety";
    }, []);

    const [formData, setFormData] = useState<SurveyData>({
        name: "",
        criteria: [""],
        alternatives: [""],
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [hover, setHover] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleDynamicChange = (type: "criteria" | "alternatives", index: number, value: string) => {
        setFormData((prev) => {
            const updatedArray = [...prev[type]];
            updatedArray[index] = value;
            return {...prev, [type]: updatedArray};
        });
    };

    const addDynamicField = (type: "criteria" | "alternatives") => {
        setFormData((prev) => ({
            ...prev,
            [type]: [...prev[type], ""],
        }));
    };

    const removeDynamicField = (type: "criteria" | "alternatives", index: number) => {
        setFormData((prev) => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}${API_PREFIX}/models`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            });

            if (response.status === 200) {
                const responseData = await response.json();
                navigate(`/surveys/${responseData.data.model_id}`);
            } else {
                await response.json();
                // @ts-ignore
                toast.error("Tworzenie ankiety nie powiodło się")
            }
        } catch (error) {
            // @ts-ignore
            toast.error("Tworzenie ankiety nie powiodło się")
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <header className="mb-6">
                <h1 className="text-4xl font-bold">
                    <span style={{color: colorManager.getColor("black")}}>Stwórz ankietę</span>
                </h1>
            </header>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-lg font-medium mb-2">Nazwa ankiety</label>
                        <input
                            type="text"
                            name="name"
                            required={true}
                            value={formData.name}
                            onChange={handleInputChange}
                            className="block w-full p-3 border rounded-lg focus:outline-none"
                            placeholder="Wprowadź nazwę ankiety"
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-lg font-medium mb-2">Alternatywy</label>
                        {formData.alternatives.map((alternative, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                <input
                                    type="text"
                                    value={alternative}
                                    onChange={(e) =>
                                        handleDynamicChange("alternatives", index, e.target.value)
                                    }
                                    className="block w-full p-3 border rounded-lg focus:outline-none"
                                    placeholder={`Alternatywa ${index + 1}`}
                                />
                                {formData.alternatives.length > 1 && (
                                    <button
                                        type="button"
                                        className="p-2 text-red-500 hover:text-red-700 focus:outline-none"
                                        onClick={() => removeDynamicField("alternatives", index)}
                                    >
                                        <FaMinus/>
                                    </button>
                                )}
                                {index === formData.alternatives.length - 1 && (
                                    <button
                                        type="button"
                                        className="p-2 text-green-500 hover:text-green-700 focus:outline-none"
                                        onClick={() => addDynamicField("alternatives")}
                                    >
                                        <FaPlus/>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex-1">
                        <label className="block text-lg font-medium mb-2">Cechy</label>
                        {formData.criteria.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) =>
                                        handleDynamicChange("criteria", index, e.target.value)
                                    }
                                    className="block w-full p-3 border rounded-lg focus:outline-none"
                                    placeholder={`Cecha ${index + 1}`}
                                />
                                {formData.criteria.length > 1 && (
                                    <button
                                        type="button"
                                        className="p-2 text-red-500 hover:text-red-700 focus:outline-none"
                                        onClick={() => removeDynamicField("criteria", index)}
                                    >
                                        <FaMinus/>
                                    </button>
                                )}
                                {index === formData.criteria.length - 1 && (
                                    <button
                                        type="button"
                                        className="p-2 text-green-500 hover:text-green-700 focus:outline-none"
                                        onClick={() => addDynamicField("criteria")}
                                    >
                                        <FaPlus/>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`block w-min-[100px] p-3 font-bold rounded-lg text-white ${
                        loading ? "cursor-not-allowed" : ""
                    }`}
                    style={{
                        backgroundColor: hover
                            ? colorManager.getColor("color3")
                            : colorManager.getColor("color1"),
                    }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    {loading ? <FaSpinner className="animate-spin inline-block"/> : "Stwórz ankietę"}
                </button>
            </form>
        </div>
    );
}

export default CreateSurvey;
