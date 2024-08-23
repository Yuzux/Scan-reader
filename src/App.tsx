import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MangaList from './components/MangaList';
import MangaReader from './components/MangaReader';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MangaList />} />
                <Route path="/reader/:mangaId" element={<MangaReader />} />
            </Routes>
        </Router>
    );
};

export default App;
