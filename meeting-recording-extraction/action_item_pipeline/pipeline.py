import mlflow
from preprocess import preprocess_transcript
from action_extraction import extract_action_items
from database import setup_database, save_to_db

mlflow.set_tracking_uri("http://127.0.0.1:5000/")

def read_transcript(file_path):
    """Reads a transcript from the given file path."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            transcript = file.read()
        return transcript
    except FileNotFoundError:
        print(f"Error: The file at {file_path} was not found.")
        return None
    except Exception as e:
        print(f"An error occurred while reading the file: {e}")
        return None


def process_transcript_from_file(file_path):
    """Pipeline to process transcript from a file."""
    transcript = read_transcript(file_path)
    if transcript is None:
        return  # Exit if the file couldn't be read

    mlflow.set_experiment("callreport")
    mlflow.autolog()

    with mlflow.start_run():
        # Preprocessing
        sentences = preprocess_transcript(transcript)
        mlflow.log_metric("sentence_count", len(sentences))

        # Extract Action Items
        #action_items = extract_action_items(sentences)
        #mlflow.log_text(action_items, "action_items.txt")

        # Save to DB
        #engine, action_items_table = setup_database()
        #save_to_db(engine, action_items_table, action_items)
        #mlflow.log_metric("action_items_count", len(action_items.split("\n")))

if __name__ == "__main__":
    
    # Provide the file path as input
    file_path = "E:/MTech-2023-2024/Sem-4/Project-WorkFlow/meeting_transcription/transcripts/Test.txt"   
    process_transcript_from_file(file_path)
