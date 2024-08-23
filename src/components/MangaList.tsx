import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';

interface Manga {
    id: string;
    title: string;
    cover: string;
}

const MangaList: React.FC = () => {
    const [mangas, setMangas] = useState<Manga[]>([]);

    useEffect(() => {
        const fetchMangas = async () => {
            try {
                const response = await fetch('/mangas.json');
                const data = await response.json();
                setMangas(data.mangas);
            } catch (error) {
                console.error("Erreur lors du chargement de la liste des mangas:", error);
            }
        };

        fetchMangas();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {mangas.map((manga) => (
                <Card key={manga.id} sx={{ margin: 2, maxWidth: 200 }}>
                    {/* Modifiez le lien pour pointer vers la liste des chapitres */}
                    <Link to={`/manga/${manga.id}`} style={{ textDecoration: 'none' }}>
                        <CardMedia
                            component="img"
                            height="300"
                            image={manga.cover}
                            alt={manga.title}
                        />
                        <CardContent>
                            <Typography variant="h6" component="div">
                                {manga.title}
                            </Typography>
                        </CardContent>
                    </Link>
                </Card>
            ))}
        </Box>
    );
};

export default MangaList;
