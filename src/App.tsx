import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MangaList from './components/MangaList';
import MangaChapters from './components/MangaChapters';
import MangaReader from './components/MangaReader';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MangaList />} />
                <Route path="/manga/:mangaId" element={<MangaChapters />} />
                <Route path="/reader/:mangaId/:chapterId" element={<MangaReader />} />
            </Routes>
        </Router>
    );
};

export default App;