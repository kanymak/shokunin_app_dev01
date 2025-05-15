import os
from app import app, db
import sqlite3

# Ensure the instance folder exists
try:
    os.makedirs(app.instance_path, exist_ok=True)
    print(f"Instance path '{app.instance_path}' checked/created.")
except OSError as e:
    print(f"Error creating instance path '{app.instance_path}': {e}")

# Create database tables within an application context
with app.app_context():
    print("Creating database tables...")
    # db.create_all() # Remove this line

    conn = sqlite3.connect('instance/local_data.db')
    cursor = conn.cursor()

    # Drop existing tables first
    print("Dropping existing tables...")
    tables_to_drop = [
        'employees',
        'okrs',
        'admin_okr_settings',
        'one_on_one_records',
        'job_skill_levels',
        'job_task_lists',
        'ai_support_records',
        'user',
        'competency_item',
        'competency_evaluation'
    ]
    for table in tables_to_drop:
        try:
            cursor.execute(f"DROP TABLE IF EXISTS {table};")
            print(f"Dropped table {table} if it existed.")
        except sqlite3.Error as e:
            print(f"Error dropping table {table}: {e}")

    # Execute the schema script
    print("Executing schema script...")
    with open('schema.sql', 'r', encoding='utf-8') as f:
        schema = f.read()
        cursor.executescript(schema)

    conn.commit()
    print("Schema script executed and changes committed.")
    conn.close()
    print("Database tables created successfully from schema.sql.")

print("Database initialization complete.")
