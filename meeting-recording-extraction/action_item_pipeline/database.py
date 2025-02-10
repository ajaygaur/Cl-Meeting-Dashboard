from sqlalchemy import create_engine, Column, Integer, String, MetaData, Table

DB_URI = "sqlite:///action_items.db"

def setup_database():
    engine = create_engine(DB_URI)
    metadata = MetaData()
    action_items_table = Table(
        "action_items", metadata,
        Column("id", Integer, primary_key=True, autoincrement=True),
        Column("item", String, nullable=False),
    )
    metadata.create_all(engine)
    return engine, action_items_table

def save_to_db(engine, action_items_table, action_items):
    with engine.connect() as conn:
        for item in action_items.split("\n"):
            conn.execute(action_items_table.insert().values(item=item))
