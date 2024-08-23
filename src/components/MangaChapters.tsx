import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useParams } from 'react-router-dom';

interface Chapter {
    id: string;
    title: string;
    description: string;
    cover: string;
}

interface Manga {
    id: string;
    title: string;
    cover: string;
    backgroundImage: string;
    description: string;
    chapters: Chapter[];
}

const MangaChapters: React.FC = () => {
    const { mangaId } = useParams<{ mangaId: string }>();
    const [manga, setManga] = React.useState<Manga | null>(null);

    React.useEffect(() => {
        const fetchManga = async () => {
            try {
                const response = await fetch('/mangas.json');
                const data = await response.json();
                const foundManga = data.mangas.find((m: Manga) => m.id === mangaId);
                setManga(foundManga);
            } catch (error) {
                console.error("Erreur lors du chargement du manga:", error);
            }
        };

        fetchManga();
    }, [mangaId]);

    return (
        <Box sx={{ position: 'relative', minHeight: '100vh' }}>
            {/* Image de fond claire fixe */}
            {manga && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${manga.backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: -1,
                    }}
                />
            )}

            {/* Conteneur principal pour la liste des chapitres et la description */}
            <Box sx={{ padding: '20px', zIndex: 1 }}>

                {/* Description du manga sur fond noir transparent */}
                {manga && (
                    <Box
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Noir transparent
                        color: 'white',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                    }}
                    >
                    <img
                        src={`${manga.cover}`}
                        alt={`${manga.title} Cover`}
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: '8px',
                        }}
                    />
                        <Typography variant="h4" component="div" sx={{ marginBottom: 2 }}>
                            {manga.title}
                        </Typography>
                        <Typography variant="body1">
                            {manga.description}
                        </Typography>
                    </Box>
                )}

                {/* Liste des chapitres */}
                {manga && (
                    <Box
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Noir transparent
                        color: 'white',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                    }}
                    >
                    <List>
                        {manga.chapters.map((chapter) => (
                            <ListItem key={chapter.id} button 
                                onClick={() => window.location.href = `/reader/${mangaId}/${chapter.id}`}>
                                <ListItemText
                                    primary={chapter.title}
                                    secondary={chapter.description}
                                />
                            </ListItem>
                        ))}
                    </List>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default MangaChapters;
