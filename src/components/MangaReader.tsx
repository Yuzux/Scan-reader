import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

interface Params {
    mangaId: string;
    [key: string]: string | undefined;
}

interface PageData {
    pages: string[];
}

const MangaReader: React.FC = () => {
    const { mangaId } = useParams<Params>();
    const [pages, setPages] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const observer = useRef<IntersectionObserver>();

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const response = await fetch(`/scans/${mangaId}/pages.json`);
                const data: PageData = await response.json();
                setPages(data.pages);
            } catch (error) {
                console.error("Erreur lors du chargement des pages:", error);
            }
        };

        fetchPages();
    }, [mangaId]);

    const lastImageRef = useCallback(
        (node: HTMLImageElement) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && currentPage < pages.length) {
                    setLoading(true);
                    setCurrentPage(prevPage => prevPage + 10); // Charger 10 pages de plus à chaque fois
                    setLoading(false);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, currentPage, pages.length]
    );

    return (
        <Box sx={{ textAlign: 'center' }}>
            {pages.slice(0, currentPage + 10).map((page, index) => {
                if (index === currentPage + 9) {
                    return (
                        <img
                            key={index}
                            src={`/scans/${mangaId}/${page}`}
                            alt={`Page ${index + 1}`}
                            ref={lastImageRef}
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                    );
                } else {
                    return (
                        <img
                            key={index}
                            src={`/scans/${mangaId}/${page}`}
                            alt={`Page ${index + 1}`}
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                    );
                }
            })}
            {loading && <CircularProgress />}
        </Box>
    );
};

export default MangaReader;
