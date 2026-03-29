# Data Model

## Overview
This document describes the normalized data model for the application, including entity relationships and transformation rules from TMDB API responses.

## Normalized Schema

### Tables

#### Movies
- `id` (integer, primary key)
- `title` (string)
- `overview` (text)
- `release_date` (date)
- `runtime` (integer, minutes)
- `vote_average` (float)
- `poster_path` (string)
- `backdrop_path` (string)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### Genres
- `id` (integer, primary key)
- `name` (string)

#### Movie_Genres (junction table)
- `movie_id` (integer, foreign key to Movies)
- `genre_id` (integer, foreign key to Genres)

#### Persons
- `id` (integer, primary key)
- `name` (string)
- `biography` (text)
- `birthday` (date)
- `deathday` (date, nullable)
- `profile_path` (string)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### Cast
- `id` (integer, primary key)
- `movie_id` (integer, foreign key to Movies)
- `person_id` (integer, foreign key to Persons)
- `character` (string)
- `order` (integer)

#### Crew
- `id` (integer, primary key)
- `movie_id` (integer, foreign key to Movies)
- `person_id` (integer, foreign key to Persons)
- `job` (string)
- `department` (string)

## Transformation Rules

### From TMDB Movie Object to Movies Table
- `id` → `id`
- `title` → `title`
- `overview` → `overview`
- `release_date` → `release_date` (parse to date)
- `runtime` → `runtime`
- `vote_average` → `vote_average`
- `poster_path` → `poster_path`
- `backdrop_path` → `backdrop_path`
- Set `created_at` and `updated_at` to current timestamp

### Genres Processing
- For each genre in `genres` array:
  - Insert or update Genres table
  - Create entry in Movie_Genres

### Credits Processing
- For each cast member:
  - Insert or update Persons table
  - Insert into Cast table with movie_id, person_id, character, order
- For each crew member:
  - Insert or update Persons table
  - Insert into Crew table with movie_id, person_id, job, department

### Data Validation
- Ensure `release_date` is valid date
- Trim whitespace from text fields
- Handle null values appropriately
- Update `updated_at` on modifications