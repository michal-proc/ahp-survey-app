import {Link, useNavigate} from 'react-router-dom';
import {useEffect} from "react";
import {toast} from "react-toastify";

function NotFound() {
    const navigate = useNavigate();

    useEffect(() => {
        toast.error("Strona nie została znaleziona, przekierowywanie do strony głównej");
        navigate("/");
    }, [navigate]);

    return null;
}

export default NotFound;
