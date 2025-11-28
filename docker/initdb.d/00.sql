-- Active l'extension pour générer des UUIDs automatiquement
-- doc: https://docs.postgresql.fr/15/pgcrypto.html
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABLE USERS (Informations publiques du Freelance)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL, -- ex: "thibault-dev"
    full_name TEXT NOT NULL,
    bio TEXT,
    job_title TEXT, -- "Spécialité"
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLE AUTH_ACCOUNTS (Données sensibles séparées)
-- Relation 1-1 avec users
CREATE TABLE IF NOT EXISTS auth_accounts (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLE LINKS (Le Linktree)
CREATE TABLE IF NOT EXISTS links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL, -- ex: "Mon GitHub"
    url TEXT NOT NULL,
    icon_key TEXT, -- ex: "github", "linkedin" (pour l'affichage front)
    position INTEGER DEFAULT 0, -- Pour gérer l'ordre d'affichage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLE AVAILABILITIES (Disponibilités)
-- J'ai ajouté start_time et end_time, car une date seule ne suffit pas
CREATE TABLE IF NOT EXISTS availabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Option A: Disponibilité récurrente (ex: Tous les Lundis = 1)
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), 
    
    -- Option B: Date spécifique (ex: 2023-12-25) - Prioritaire sur le jour de semaine
    specific_date DATE,

    start_time TIME NOT NULL, -- ex: 09:00:00
    end_time TIME NOT NULL,   -- ex: 18:00:00
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLE APPOINTMENTS (Les RDV)
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    freelance_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Infos du client (stockées ici car pas de table Client dédiée)
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    client_company TEXT,
    
    -- Créneau réservé
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Statut (pending, confirmed, cancelled)
    status TEXT DEFAULT 'confirmed',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour accélérer les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_links_user ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_freelance ON appointments(freelance_id);
CREATE INDEX IF NOT EXISTS idx_appointments_dates ON appointments(start_date);