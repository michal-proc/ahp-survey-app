import {useParams} from "react-router-dom";
import React, {useState, useEffect} from "react";
import {toast} from "react-toastify";
import {Model} from "../interfaces/Model";
import {ExpertInputForm, CriteriaComparison, AlternativesComparison} from "../interfaces/Input";
import ColorManager from "../helpers/ColorManager";
import {FaSpinner} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;
const API_PREFIX = import.meta.env.VITE_API_PREFIX;
const colorManager = new ColorManager();

function AhpForm({survey, onSaveSuccess}: { survey: Model; onSaveSuccess: () => void }) {
    const {id} = useParams();

    const [loading, setLoading] = useState<boolean>(false);
    const [hover, setHover] = useState(false);
    const [formData, setFormData] = useState<ExpertInputForm>({
        criteria_comparisons: [],
        alternatives_comparisons: {},
    });

    const ahpScale = [
        {value: 1 / 9, label: "1/9"},
        {value: 1 / 8, label: "1/8"},
        {value: 1 / 7, label: "1/7"},
        {value: 1 / 6, label: "1/6"},
        {value: 1 / 5, label: "1/5"},
        {value: 1 / 4, label: "1/4"},
        {value: 1 / 3, label: "1/3"},
        {value: 1 / 2, label: "1/2"},
        {value: 1, label: "1"},
        {value: 2, label: "2"},
        {value: 3, label: "3"},
        {value: 4, label: "4"},
        {value: 5, label: "5"},
        {value: 6, label: "6"},
        {value: 7, label: "7"},
        {value: 8, label: "8"},
        {value: 9, label: "9"},
    ];

    useEffect(() => {
        const initialCriteriaComparisons: CriteriaComparison[] = [];
        const initialAlternativesComparisons: AlternativesComparison = {};

        for (let i = 0; i < survey.criteria.length; i++) {
            for (let j = i + 1; j < survey.criteria.length; j++) {
                initialCriteriaComparisons.push({
                    element_a_id: survey.criteria[i].id,
                    element_b_id: survey.criteria[j].id,
                    value: null,
                });
            }
        }

        survey.criteria.forEach((criterion) => {
            const comparisons: CriteriaComparison[] = [];
            for (let i = 0; i < survey.alternatives.length; i++) {
                for (let j = i + 1; j < survey.alternatives.length; j++) {
                    comparisons.push({
                        element_a_id: survey.alternatives[i].id,
                        element_b_id: survey.alternatives[j].id,
                        value: null,
                    });
                }
            }
            initialAlternativesComparisons[criterion.id] = comparisons;
        });

        setFormData({
            criteria_comparisons: initialCriteriaComparisons,
            alternatives_comparisons: initialAlternativesComparisons,
        });
    }, [survey]);

    const handleChange = (
        type: "criteria_comparisons" | "alternatives_comparisons",
        criterionId: string | null,
        index: number,
        value: number | null
    ) => {
        setFormData((prev) => {
            const updatedFormData = {...prev};
            if (type === "criteria_comparisons") {
                updatedFormData.criteria_comparisons[index].value = value;
            } else if (criterionId) {
                updatedFormData.alternatives_comparisons[criterionId][index].value = value;
            }
            return updatedFormData;
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const filteredFormData = {
            criteria_comparisons: formData.criteria_comparisons.filter(
                (comp) => comp.value !== null
            ),
            alternatives_comparisons: Object.fromEntries(
                Object.entries(formData.alternatives_comparisons).map(([key, comparisons]) => [
                    key,
                    comparisons.filter((comp) => comp.value !== null),
                ])
            ),
        };

        try {
            const response = await fetch(`${API_URL}${API_PREFIX}/models/${id}/experts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(filteredFormData),
            });

            if (response.status === 200) {
                toast.success("Dane zostały zapisane pomyślnie.");
                onSaveSuccess();
            } else {
                toast.error("Wystąpił błąd podczas zapisywania danych.");
            }
        } catch {
            toast.error("Wystąpił błąd podczas zapisywania danych.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white shadow-md rounded-lg p-6 border"
                 style={{borderColor: colorManager.getColor("color4")}}>
                <h3 className="text-lg font-bold mb-4">Macierz Porównań Kryteriów</h3>
                <div className="overflow-auto">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr>
                            <th className="border p-2 bg-gray-100"></th>
                            {survey.criteria.map((criterion) => (
                                <th key={criterion.id} className="border p-2 bg-gray-100 text-center">
                                    {criterion.name}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {survey.criteria.map((critA, rowIndex) => (
                            <tr key={critA.id}>
                                <td className="border p-2 bg-gray-100 font-medium">{critA.name}</td>
                                {survey.criteria.map((critB, colIndex) => (
                                    <td key={`${critA.id}-${critB.id}`} className="border p-2">
                                        {rowIndex < colIndex ? (
                                            <select
                                                value={
                                                    formData.criteria_comparisons.find(
                                                        (comp) =>
                                                            comp.element_a_id === critA.id &&
                                                            comp.element_b_id === critB.id
                                                    )?.value || ""
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        "criteria_comparisons",
                                                        null,
                                                        formData.criteria_comparisons.findIndex(
                                                            (comp) =>
                                                                comp.element_a_id === critA.id &&
                                                                comp.element_b_id === critB.id
                                                        ),
                                                        parseFloat(e.target.value) || null
                                                    )
                                                }
                                                className="p-2 border rounded-lg w-full"
                                            >
                                                <option value="">Wybierz</option>
                                                {ahpScale.map((scale) => (
                                                    <option key={scale.value} value={scale.value}>
                                                        {scale.label}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : rowIndex === colIndex ? (
                                            <span className="text-gray-400">1</span>
                                        ) : (
                                            <select
                                                disabled
                                                className="p-2 border rounded-lg w-full bg-gray-200 cursor-not-allowed"
                                            >
                                                <option>—</option>
                                            </select>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {survey.criteria.map((criterion) => (
                <div key={criterion.id} className="bg-white shadow-md rounded-lg p-6 border"
                     style={{borderColor: colorManager.getColor("color4")}}>
                    <h3 className="text-lg font-bold mb-4">
                        Macierz Porównań Alternatyw dla: {criterion.name}
                    </h3>
                    <div className="overflow-auto">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr>
                                <th className="border p-2 bg-gray-100"></th>
                                {survey.alternatives.map((alt) => (
                                    <th key={alt.id} className="border p-2 bg-gray-100 text-center">
                                        {alt.name}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {survey.alternatives.map((altA, rowIndex) => (
                                <tr key={altA.id}>
                                    <td className="border p-2 bg-gray-100 font-medium">{altA.name}</td>
                                    {survey.alternatives.map((altB, colIndex) => (
                                        <td key={`${altA.id}-${altB.id}`} className="border p-2">
                                            {rowIndex < colIndex ? (
                                                <select
                                                    value={
                                                        formData.alternatives_comparisons[criterion.id]?.find(
                                                            (comp) =>
                                                                comp.element_a_id === altA.id &&
                                                                comp.element_b_id === altB.id
                                                        )?.value || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "alternatives_comparisons",
                                                            criterion.id,
                                                            formData.alternatives_comparisons[criterion.id]?.findIndex(
                                                                (comp) =>
                                                                    comp.element_a_id === altA.id &&
                                                                    comp.element_b_id === altB.id
                                                            ),
                                                            parseFloat(e.target.value) || null
                                                        )
                                                    }
                                                    className="p-2 border rounded-lg w-full"
                                                >
                                                    <option value="">Wybierz</option>
                                                    {ahpScale.map((scale) => (
                                                        <option key={scale.value} value={scale.value}>
                                                            {scale.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : rowIndex === colIndex ? (
                                                <span className="text-gray-400">1</span>
                                            ) : (
                                                <select
                                                    disabled
                                                    className="p-2 border rounded-lg w-full bg-gray-200 cursor-not-allowed"
                                                >
                                                    <option>—</option>
                                                </select>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

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
                {loading ? <FaSpinner className="animate-spin inline-block"/> : "Zapisz odpowiedzi"}
            </button>
        </form>
    );
}

export default AhpForm;
