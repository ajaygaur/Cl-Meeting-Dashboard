import re
from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords
from contractions import fix
import nltk
import spacy

def preprocess_transcript(transcript):
    #nltk.download('punkt', download_dir='C:\\Users\\ajayg\\nltk_data',force=True)
    #nltk.download('punkt_tab', download_dir='C:\\Users\\ajayg\\nltk_data',force=True)
    #nltk.download('stopwords', download_dir='C:\\Users\\ajayg\\nltk_data',force=True)

    
    # Step 1: Extract metadata
    metadata = extract_metadata(transcript)

    # Step 2: Clean and normalize
    cleaned_transcript = clean_text(transcript)
    expanded_transcript = expand_contractions(cleaned_transcript)
    normalized_transcript = normalize_text(expanded_transcript)

    # Step 3: Segment text
    chunks = segment_text(normalized_transcript)

    # Prepare final output
    results = {
        "metadata": metadata,  # Optional: Can be omitted for T5 input
        "preprocessed_chunks": chunks
    }

    # Print the results
    print("Metadata:", results["metadata"])
    print("Preprocessed Chunks:", results["preprocessed_chunks"])

    # Return preprocessed results
    return results


#---child methods-----

def chunk_text(transcript):
    #1.Chunking Large Text
    # Splitting into sentences
    sentences = sent_tokenize(transcript)

    # Create chunks of 512 tokens or less
    chunk_size = 512
    chunks = [' '.join(sentences[i:i+chunk_size]) for i in range(0, len(sentences), chunk_size)]

    return chunks

# Step 1: Extract Metadata
def extract_metadata(text):
    segments = re.findall(r"\[(.*?)\] (.*?): (.*)", text)
    metadata = []
    for timestamp, speaker, content in segments:
        metadata.append({"timestamp": timestamp, "speaker": speaker, "text": content})
    return metadata


# Step 2: Clean and Normalize Text
def clean_text(text):
    text = re.sub(r"\[.*?\]", "", text)  # Remove metadata annotations
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)  # Remove special characters
    text = text.lower()  # Lowercasing
    return text


def expand_contractions(text):
    return fix(text)


def normalize_text(text): #(Lemmatization) => Normalization + Stemming + POS Tagging.
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(text)

    # Display tokens with their POS tags
    for token in doc:
        print(f"Word: {token.text}, POS: {token.pos_}, Explanation: {spacy.explain(token.pos_)}")

    return " ".join([token.lemma_ for token in doc if not token.is_stop])


# Step 3: Segment Text
def segment_text(text, chunk_size=512):
    sentences = sent_tokenize(text)
    chunks = [' '.join(sentences[i:i+chunk_size]) for i in range(0, len(sentences), chunk_size)]
    return chunks


