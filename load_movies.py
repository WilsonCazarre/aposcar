import json
import logging
import os
from uuid import uuid4
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DATABASE_URL = os.getenv('DATABASE_URL')

def load_movies():
    try:
        # Create database connection
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind=engine)
        session = Session()

        # Load JSON data
        with open('json/movies.json', 'r', encoding='utf-8') as file:
            movies = json.load(file)

        # Insert movies into nominees table
        for movie in movies:
            # Generate UUID for the movie
            movie_id = str(uuid4())

            # Create insert query
            query = text("""
                INSERT INTO aposcar_nominees 
                (id, slug, name, description, image, type, tagline, backdrop, letterboxd)
                VALUES 
                (:id, :slug, :name, :description, :image, :type, :tagline, :backdrop, :letterboxd)
                ON CONFLICT (slug) DO NOTHING
            """)

            # Execute insert
            session.execute(query, {
                'id': movie_id,
                'slug': movie['slug'],
                'name': movie['name'],
                'description': movie['description'],
                'image': movie['image'],
                'type': movie['type'],
                'tagline': movie['tagline'],
                'backdrop': movie['backdrop'],
                'letterboxd': movie['letterboxd']
            })

        # Commit the transaction
        session.commit()
        logger.info(f"Successfully loaded {len(movies)} movies into database")

    except SQLAlchemyError as e:
        logger.error(f"Database error: {str(e)}")
        session.rollback()
        raise
    except Exception as e:
        logger.error(f"Error loading movies: {str(e)}")
        raise
    finally:
        session.close()


if __name__ == "__main__":
    load_movies()
