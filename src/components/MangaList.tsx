import React from 'react';
import { Link } from 'react-router-dom';

const MangaList: React.FC = () => {
    const mangas = [
        { name: "The Little Girl Raised By Death Hold The Sword Of Death Tight", path: "/manga1" },
        { name: "Citrus", path: "/manga2" },
    ];

    return (
        <div>
            <h1>Liste des Mangas</h1>
            <ul>
                {mangas.map((manga) => (
                    <li key={manga.name}>
                        <Link to={`/reader${manga.path}`}>{manga.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MangaList;
