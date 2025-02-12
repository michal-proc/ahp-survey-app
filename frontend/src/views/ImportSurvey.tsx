import React, {useCallback, useEffect, useState} from "react";
import {useDropzone} from "react-dropzone";
import {toast} from "react-toastify";
import ColorManager from "../helpers/ColorManager";
import {useNavigate} from "react-router-dom";
import {FaSpinner} from "react-icons/fa";
import {FiDownload, FiUpload} from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;
const API_PREFIX = import.meta.env.VITE_API_PREFIX;
const colorManager = new ColorManager();

function ImportSurvey() {
    useEffect(() => {
        document.title = "RedPill Surveys - Import Ankiety";
    }, []);

    const navigate = useNavigate();
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [hover, setHover] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const isJson = file.type === "application/json" || file.name.endsWith(".json");

            if (isJson) {
                setUploadedFile(file);
                toast.success("Plik JSON został zaimportowany!");
            } else {
                toast.error("Nieprawidłowy typ pliku! Wymagany format to JSON");
            }
        }
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        multiple: false,
    });

    const uploadFile = async () => {
        if (!uploadedFile) {
            toast.warn("Najpierw prześlij plik!");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", uploadedFile);

        try {
            const response = await fetch(`${API_URL}${API_PREFIX}/models/import/`, {
                method: "POST",
                body: formData,
            });

            if (response.status === 200) {
                const responseData = await response.json();
                navigate(`/surveys/${responseData.data.model_id}`);
            } else {
                const responseData = await response.json();
                console.log(responseData)
                // @ts-ignore
                toast.error("Import ankiety nie powiódł się")
            }
        } catch (error) {
            // @ts-ignore
            toast.error("Import ankiety nie powiódł się")
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="container mx-auto p-6">
            <header className="mb-6">
                <h1 className="text-4xl font-bold">
                    <span style={{color: colorManager.getColor("black")}}>Import ankiety</span>
                </h1>
            </header>
            <div
                {...getRootProps()}
                className={`flex border-2 border-dashed p-10 rounded-lg justify-center transition-all duration-300 ${
                    isDragActive ? "bg-red-500 border-gray-800" : "border-gray-400"
                }`}
                style={{
                    minHeight: "40vh",
                }}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className={`font-bold text-lg text-gray-800 my-auto`}>
                        Upuść plik tutaj...
                    </p>
                ) : (
                    <p className={`font-bold text-lg text-gray-700 my-auto`}>
                        Przeciągnij tutaj plik JSON lub kliknij, aby go wybrać
                    </p>
                )}
            </div>

            {uploadedFile && (
                <div className="mt-6">
                    <p className="text-gray-800 font-semibold">
                        Przesłany plik: <span className="text-gray-600">{uploadedFile.name}</span>
                    </p>
                </div>
            )}

            <div className="mt-6 flex gap-4">
                <button
                    onClick={uploadFile}
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
                    {loading ? <FaSpinner className="animate-spin inline-block"/> :
                        <><FiUpload className="inline-block mr-2"/>Stwórz ankietę</>}
                </button>
                <a
                    href="/files/survey.json"
                    download
                    className={`block p-3 font-bold rounded-lg text-white ${
                        loading ? "cursor-not-allowed" : ""
                    }`}
                    style={{
                        backgroundColor: colorManager.getColor("black"),
                    }}
                >
                    <FiDownload className="inline-block mr-2"/>
                    Pobierz przykładowy plik
                </a>
            </div>
        </div>
    );
}

export default ImportSurvey;
