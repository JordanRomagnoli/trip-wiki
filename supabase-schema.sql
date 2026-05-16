-- SQL Schema for Trip Wiki

-- 1. Cities table
CREATE TABLE IF NOT EXISTS cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  center FLOAT8[] NOT NULL,
  zoom INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. POIs table
CREATE TABLE IF NOT EXISTS pois (
  id TEXT PRIMARY KEY,
  city_id TEXT REFERENCES cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  coordinates FLOAT8[] NOT NULL,
  category TEXT NOT NULL,
  visited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Itineraries table
CREATE TABLE IF NOT EXISTS itineraries (
  id TEXT PRIMARY KEY,
  city_id TEXT REFERENCES cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  poi_ids TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE pois ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies
DROP POLICY IF EXISTS "Allow public read access for cities" ON cities;
DROP POLICY IF EXISTS "Allow public read access for pois" ON pois;
DROP POLICY IF EXISTS "Allow public read access for itineraries" ON itineraries;
DROP POLICY IF EXISTS "Allow public update of visited status" ON pois;
DROP POLICY IF EXISTS "Allow public insert of itineraries" ON itineraries;
DROP POLICY IF EXISTS "Allow public insert of pois" ON pois;

-- Create policies for public read access
CREATE POLICY "Allow public read access for cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Allow public read access for pois" ON pois FOR SELECT USING (true);
CREATE POLICY "Allow public read access for itineraries" ON itineraries FOR SELECT USING (true);

-- Create policy for public update of 'visited' status on POIs (simplified for this app)
CREATE POLICY "Allow public update of visited status" ON pois FOR UPDATE USING (true) WITH CHECK (true);
-- Create policy for public creation of itineraries
CREATE POLICY "Allow public insert of itineraries" ON itineraries FOR INSERT WITH CHECK (true);
-- Create policy for public creation of pois
CREATE POLICY "Allow public insert of pois" ON pois FOR INSERT WITH CHECK (true);
