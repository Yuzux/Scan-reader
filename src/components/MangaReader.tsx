import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Fab from '@mui/material/Fab';
import HomeIcon from '@mui/icons-material/Home';

interface Params extends Record<string, string | undefined> {
    mangaId: string;
    chapterId: string;
}

interface Chapter {
    id: string;
    title: string;
    pages: string[];
}

interface Manga {
    id: string;
    title: string;
    cover: string;
    description: string;
    backgroundImage: string;
    chapters: Chapter[];
}

const MangaReader: React.FC = () => {
    const { mangaId, chapterId } = useParams<Params>();
    const navigate = useNavigate();
    const [manga, setManga] = useState<Manga | null>(null);
    const [pages, setPages] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const observer = useRef<IntersectionObserver>();

    useEffect(() => {
        const fetchChapter = async () => {
            try {
                const response = await fetch('/mangas.json');
                const data = await response.json();
                const foundManga = data.mangas.find((m: Manga) => m.id === mangaId);
                setManga(foundManga);
                const foundChapter = foundManga?.chapters.find((chap: Chapter) => chap.id === chapterId);
                setPages(foundChapter?.pages || []);
            } catch (error) {
                console.error("Erreur lors du chargement du chapitre:", error);
            }
        };

        fetchChapter();
    }, [mangaId, chapterId]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [chapterId]);

    const lastImageRef = useCallback(
        (node: HTMLImageElement) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && currentPage < pages.length) {
                    setLoading(true);
                    setCurrentPage(prevPage => prevPage + 10);
                    setLoading(false);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, currentPage, pages.length]
    );

    const currentChapterIndex = manga?.chapters.findIndex((chap) => chap.id === chapterId) || 0;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {/* Image de fond floue */}
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
                        filter: 'blur(8px)',
                        zIndex: -1,
                    }}
                />
            )}
            <Box sx={{ width: '60%', textAlign: 'center' }}>
            <Box
                    sx={{
                        width: '97.5%',
                        textAlign: 'center',
                        position: 'relative',
                        backgroundColor: '#4d4a4a', // Gris avec transparence
                        borderRadius: '8px',
                        padding: '16px',
                        margin: '0 auto',
                        zIndex: 1,
                        color: '#11bdb3',
                    }}
                >
                    {manga && (
                        <>
                            {/* Titre du manga et du chapitre */}
                            <Typography variant="h4" component="div" sx={{ marginBottom: 2 }}>
                                {manga.title} - {manga.chapters[currentChapterIndex]?.title}
                            </Typography>

                            {/* Dropdown pour sélectionner un chapitre */}
                            <FormControl sx={{ minWidth: 200, marginBottom: 2 }}>
                                <Select
                                    value={chapterId}
                                    sx={{
                                        '& .MuiSelect-select': {
                                            color: 'black', // Couleur du texte
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'transparent', // Couleur de la bordure
                                        },
                                        backgroundColor: 'white', // Couleur de fond
                                    }}
                                    onChange={(e) => {
                                        const selectedChapterId = e.target.value as string;
                                        navigate(`/reader/${mangaId}/${selectedChapterId}`);
                                    }}
                                >
                                    {manga.chapters.map((chap) => (
                                        <MenuItem key={chap.id} value={chap.id}>
                                            {chap.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Boutons Chapitre Précédent et Suivant */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                <Button
                                    variant="contained"
                                    disabled={currentChapterIndex <= 0}
                                    onClick={() => {
                                        const prevChapterId = manga.chapters[currentChapterIndex - 1].id;
                                        navigate(`/reader/${mangaId}/${prevChapterId}`);
                                    }}
                                >
                                    Chapitre Précédent
                                </Button>
                                <Button
                                    variant="contained"
                                    disabled={currentChapterIndex >= manga.chapters.length - 1}
                                    onClick={() => {
                                        const nextChapterId = manga.chapters[currentChapterIndex + 1].id;
                                        navigate(`/reader/${mangaId}/${nextChapterId}`);
                                    }}
                                >
                                    Chapitre Suivant
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>

                 {/* Affichage des pages */}
                 {pages.slice(0, currentPage + 10).map((page, index) => {
                    if (index === currentPage + 9) {
                        return (
                            <Box
                                key={index}
                                sx={{
                                    position: 'relative',
                                    marginBottom: '10px',
                                    overflow: 'hidden',
                                    height: 'auto'
                                }}
                            >
                                <img
                                    src={`/scans/${mangaId}/${chapterId}/${page}`}
                                    alt={`Page ${index + 1}`}
                                    ref={lastImageRef}
                                    style={{ width: '100%', pointerEvents: 'none', userSelect: 'none' }}
                                />
                                {/* Overlay transparent */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0)', // Transparence
                                        zIndex: 2
                                    }}
                                />
                            </Box>
                        );
                    } else {
                        return (
                            <Box
                                key={index}
                                sx={{
                                    position: 'relative',
                                    marginBottom: '10px',
                                    overflow: 'hidden',
                                    height: 'auto'
                                }}
                            >
                                <img
                                    src={`/scans/${mangaId}/${chapterId}/${page}`}
                                    alt={`Page ${index + 1}`}
                                    style={{ width: '100%', pointerEvents: 'none', userSelect: 'none' }}
                                />
                                {/* Overlay transparent */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0)', // Transparence
                                        zIndex: 2
                                    }}
                                />
                            </Box>
                        );
                    }
                })}
                {loading && <CircularProgress />}

                <Box
                    sx={{
                        width: '97.5%',
                        textAlign: 'center',
                        position: 'relative',
                        backgroundColor: '#4d4a4a', // Gris avec transparence
                        borderRadius: '8px',
                        padding: '16px',
                        margin: '0 auto',
                        zIndex: 1,
                        color: '#11bdb3',
                    }}
                >
                    {manga && (
                        <>
                            {/* Dropdown pour sélectionner un chapitre */}
                            <FormControl sx={{ minWidth: 200, marginBottom: 2 }}>
                                <Select
                                    value={chapterId}
                                    sx={{
                                        '& .MuiSelect-select': {
                                            color: 'black', // Couleur du texte
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'transparent', // Couleur de la bordure
                                        },
                                        backgroundColor: 'white', // Couleur de fond
                                    }}
                                    onChange={(e) => {
                                        const selectedChapterId = e.target.value as string;
                                        navigate(`/reader/${mangaId}/${selectedChapterId}`);
                                    }}
                                >
                                    {manga.chapters.map((chap) => (
                                        <MenuItem key={chap.id} value={chap.id}>
                                            {chap.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Boutons Chapitre Précédent et Suivant */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                <Button
                                    variant="contained"
                                    disabled={currentChapterIndex <= 0}
                                    onClick={() => {
                                        const prevChapterId = manga.chapters[currentChapterIndex - 1].id;
                                        navigate(`/reader/${mangaId}/${prevChapterId}`);
                                    }}
                                >
                                    Chapitre Précédent
                                </Button>
                                <Button
                                    variant="contained"
                                    disabled={currentChapterIndex >= manga.chapters.length - 1}
                                    onClick={() => {
                                        const nextChapterId = manga.chapters[currentChapterIndex + 1].id;
                                        navigate(`/reader/${mangaId}/${nextChapterId}`);
                                    }}
                                >
                                    Chapitre Suivant
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>

                {/* Bouton pour remonter en haut de la page */}
                <Fab
                    color="primary"
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <ArrowUpwardIcon />
                </Fab>

                {/* Bouton pour retourner à la page d'accueil */}
                <Fab
                    color="secondary"
                    sx={{ position: 'fixed', bottom: 16, left: 16 }}
                    onClick={() => navigate('/')}
                >
                    <HomeIcon />
                </Fab>
            </Box>
        </Box>
    );
};

export default MangaReader;
