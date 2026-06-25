import React, { createContext, useContext, useState, useEffect } from 'react';

const DossierContext = createContext();

export const DossierProvider = ({ children }) => {
    // État des dossiers
    const [dossiers, setDossiers] = useState([]);

    // Chargement initial depuis localStorage (persistance)
    useEffect(() => {
        const stored = localStorage.getItem('dossiers');
        if (stored) {
            setDossiers(JSON.parse(stored));
        } else {
            // Dossiers par défaut pour démonstration
            const defaultDossiers = [
                {
                    id: 'DOS-001',
                    nom: 'Rapports annuels',
                    description: 'Rapports financiers et techniques',
                    assigneA: 'Ahmed Benali',
                    statut: 'En cours',
                    statutValidation: 'en_attente', // 'en_attente' | 'valide' | 'refuse'
                    validationCommentaire: '',
                    validePar: null,
                    dateValidation: null,
                    dateCreation: '2026-01-10'
                },
                {
                    id: 'DOS-002',
                    nom: 'Correspondance fournisseurs',
                    description: 'Échanges avec les fournisseurs',
                    assigneA: 'Fatima Zahra',
                    statut: 'Traité',
                    statutValidation: 'en_attente', // 'en_attente' | 'valide' | 'refuse'
                    validationCommentaire: '',
                    validePar: null,
                    dateValidation: null,
                    dateCreation: '2026-02-15'
                },
            ];
            setDossiers(defaultDossiers);
            localStorage.setItem('dossiers', JSON.stringify(defaultDossiers));
        }
    }, []);

    // Sauvegarde automatique à chaque modification
    const updateDossiers = (newDossiers) => {
        setDossiers(newDossiers);
        localStorage.setItem('dossiers', JSON.stringify(newDossiers));
    };

    // CRUD
    const createDossier = (dossier) => {
        const newDossier = {
            ...dossier,
            id: `DOS-${String(Date.now()).slice(-6)}`,
            dateCreation: new Date().toISOString().split('T')[0],
            courrierIds: [], // ids des courriers associés
            statutValidation: 'en_attente',
            validationCommentaire: '',
            validePar: null,
            dateValidation: null,
        };
        updateDossiers([newDossier, ...dossiers]);
        return newDossier;
    };

    const updateDossier = (id, updates) => {
        const updated = dossiers.map(d => d.id === id ? { ...d, ...updates } : d);
        updateDossiers(updated);
    };

    const deleteDossier = (id) => {
        updateDossiers(dossiers.filter(d => d.id !== id));
    };

    const assignCourrierToDossier = (dossierId, courrierId) => {
        const dossier = dossiers.find(d => d.id === dossierId);
        if (!dossier) return;
        if (!dossier.courrierIds) dossier.courrierIds = [];
        if (!dossier.courrierIds.includes(courrierId)) {
            const updated = dossiers.map(d =>
                d.id === dossierId
                    ? { ...d, courrierIds: [...d.courrierIds, courrierId] }
                    : d
            );
            updateDossiers(updated);
        }
    };

    const removeCourrierFromDossier = (dossierId, courrierId) => {
        const dossier = dossiers.find(d => d.id === dossierId);
        if (!dossier) return;
        const updated = dossiers.map(d =>
            d.id === dossierId
                ? { ...d, courrierIds: d.courrierIds.filter(id => id !== courrierId) }
                : d
        );
        updateDossiers(updated);
    };

    const getCourriersByDossier = (dossierId) => {
        const dossier = dossiers.find(d => d.id === dossierId);
        if (!dossier) return [];
        // On va chercher les courriers dans le contexte global (si on a un accès)
        // On suppose que les courriers sont stockés dans un contexte séparé (ou on les injecte via props)
        // Pour l'instant, on retourne juste les IDs, l'affichage se fera en passant la liste complète.
        return dossier.courrierIds || [];
    };

    const validerDossier = (id, decision, commentaire) => {
        const updated = dossiers.map(d =>
            d.id === id
                ? {
                    ...d,
                    statutValidation: decision ? 'valide' : 'refuse',
                    validationCommentaire: commentaire || '',
                    validePar: 'Responsable', // ou l'utilisateur connecté
                    dateValidation: new Date().toISOString().split('T')[0],
                }
                : d
        );
        updateDossiers(updated);
    };

    return (
        <DossierContext.Provider value={{
            dossiers,
            createDossier,
            updateDossier,
            deleteDossier,
            assignCourrierToDossier,
            removeCourrierFromDossier,
            getCourriersByDossier,
            validerDossier
        }}>
            {children}
        </DossierContext.Provider>
    );
};

export const useDossiers = () => useContext(DossierContext);