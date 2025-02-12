import React, {useState} from "react";
import Sidebar from "./components/Sidebar";
import {Route, Routes} from "react-router-dom";

import Home from "./views/Home";
import CreateSurvey from "./views/CreateSurvey";
import ImportSurvey from "./views/ImportSurvey";
import NotFound from "./views/NotFound";
import {ToastContainer} from "react-toastify";
import ListSurveys from "./views/ListSurveys";
import SurveyProfile from "./views/SurveyProfile";
import SurveyRanking from "./views/SurveyRanking";

function App() {

    const [collapsed, setCollapsed] = useState(false);

    const handleCollapsedChange = () => {
        setCollapsed(!collapsed);
    };

    return (
        <>
            <div style={{display: 'flex'}}>
                <div>
                    <Sidebar collapsed={collapsed} onCollapsed={handleCollapsedChange}/>
                </div>
                <div className={`content transition-all duration-300 ${
                    collapsed ? "ml-[80px]" : "ml-[250px]"
                }`}>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/surveys" element={<ListSurveys/>}/>
                        <Route path="/surveys/create" element={<CreateSurvey/>}/>
                        <Route path="/surveys/import" element={<ImportSurvey/>}/>
                        <Route path="/surveys/:id" element={<SurveyProfile />} />
                        <Route path="/surveys/:id/ranking" element={<SurveyRanking />} />
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>
            </div>
            <ToastContainer/>
        </>
    );
}

export default App;