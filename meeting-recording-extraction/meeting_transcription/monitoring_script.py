import os
import time
import speech_recognition as sr
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from pydub import AudioSegment
import tempfile

# Define directories for recordings and transcripts
RECORDINGS_DIR = os.path.abspath("recordings/")
TRANSCRIPTS_DIR = os.path.abspath("transcripts/")

# Ensure directories exist
os.makedirs(RECORDINGS_DIR, exist_ok=True)
os.makedirs(TRANSCRIPTS_DIR, exist_ok=True)

class MonitorHandler(FileSystemEventHandler):
    def on_created(self, event):
        """Handle new file creation events."""
        if not event.is_directory and event.src_path.endswith(('.wav', '.mp3')):
            print(f"New file detected: {event.src_path}")
            process_file(event.src_path)

def process_file(file_path):
    """Process and transcribe the audio file."""
    file_name = os.path.basename(file_path)
    transcript_path = os.path.join(TRANSCRIPTS_DIR, f"{file_name}.txt")
    
    # Get a temporary directory
    temp_dir = tempfile.gettempdir()
   
    # Convert MP3 to WAV if needed
    if file_path.endswith('.mp3'):
        audio = AudioSegment.from_mp3(file_path)
        wav_path = f"{temp_dir}/{file_name.replace('.mp3', '.wav')}" 
        audio.export(wav_path, format="wav")

    # Perform transcription
    recognizer = sr.Recognizer()
    with sr.AudioFile(wav_path) as source:
        print("Processing and transcribing audio...")

        while True:        
            try:
                audio_data = recognizer.record(source,duration=30) # read the audio file on 30 sec chunks
                # Use Google Speech Recognition
                transcript = recognizer.recognize_google(audio_data)
                #print(f"Transcript: {transcript}")

                # Save transcript to file
                with open(transcript_path, "a") as f:
                    f.write(transcript)
                
            except EOFError:
                print("End of audio reached.")
                break
            except sr.UnknownValueError:
                print("Audio could not be understood.")
                break
            except sr.RequestError as e:
                print(f"Google API error: {e}")
                break
        
        print(f"Transcript saved to {transcript_path}")


def start_monitoring():
    """Start monitoring the recordings directory."""
    print(f"Monitoring {RECORDINGS_DIR} for new files...")
    event_handler = MonitorHandler()
    observer = Observer()
    observer.schedule(event_handler, RECORDINGS_DIR, recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    start_monitoring()
