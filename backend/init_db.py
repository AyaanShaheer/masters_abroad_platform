from app.database.session import engine, Base
from app.models.user import User
from app.models.profile import UserProfile
from app.models.program import Program
from app.models.scholarship import Scholarship
from app.models.application import Application

print("Dropping all tables...")
Base.metadata.drop_all(bind=engine)

print("Creating all tables...")
Base.metadata.create_all(bind=engine)

print("Tables created successfully!")
print("\nTables in database:")
from sqlalchemy import inspect
inspector = inspect(engine)
for table_name in inspector.get_table_names():
    print(f"  - {table_name}")
