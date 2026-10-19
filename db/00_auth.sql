-- =====================================================================
-- ESQUEMA BASE DE AUTENTICACION
-- Crea el esquema auth y la tabla auth.users para compatibilidad total
-- con PostgreSQL estandar y entornos contenerizados en Docker.
-- =====================================================================

CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
