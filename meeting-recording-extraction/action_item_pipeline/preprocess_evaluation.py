import re
from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords
import nltk
import spacy

from preprocess import extract_metadata,clean_text,expand_contractions,segment_text

def preprocess_transcript_evaluation():
    #nltk.download('punkt', download_dir='C:\\Users\\ajayg\\nltk_data',force=True)
    #nltk.download('punkt_tab', download_dir='C:\\Users\\ajayg\\nltk_data',force=True)
    #nltk.download('stopwords', download_dir='C:\\Users\\ajayg\\nltk_data',force=True)

    
    # Step 1: Extract metadata
    # Sample input data
    sample_transcript = """
    [00:00] Alice: Let's start the meeting. We'll discuss the new project timeline.
    [00:05] Bob: Don't forget the budget review for next quarter.
    """

    # Ground truth (gold standard)
    ground_truth_metadata = [
    {"timestamp": "00:00", "speaker": "Alice", "text": "Let's start the meeting. We'll discuss the new project timeline."},
    {"timestamp": "00:05", "speaker": "Bob", "text": "Don't forget the budget review for next quarter."}
    ]

    # Raw input transcript
    raw_input_transcript = """
        Let's start the meeting. We'll discuss the new project timeline. Don't forget the budget review for next quarter.
    """

    # Ground truth for evaluation
    ground_truth_expanded = """
        Let us start the meeting. We will discuss the new project timeline. Do not forget the budget review for next quarter.
    """

    ground_truth_sentences = [
        "Let us start the meeting.",
        "We will discuss the new project timeline.",
        "Do not forget the budget review for next quarter."
    ]
    
    # Preprocess
    metadata = extract_metadata(sample_transcript)    
    # Evaluate
    metadata_precision, metadata_recall = evaluate_metadata_extraction(metadata, ground_truth_metadata)
    
    # Step 2: Clean and normalize
    cleaned_texts = [clean_text(entry["text"]) for entry in metadata]
    cleaning_accuracy = evaluate_cleaning(cleaned_texts, ground_truth_metadata)
    
    expanded_text = expand_contractions(raw_input_transcript)
    segmented_sentences = segment_text(expanded_text)

    # Evaluation
    expansion_correct = evaluate_expansion(expanded_text, ground_truth_expanded)
    normalization_correct = evaluate_normalization(clean_text(expanded_text), clean_text(ground_truth_expanded))
    segmentation_accuracy = evaluate_segmentation(segmented_sentences, ground_truth_sentences)

    # Display results
    print("Evaluation Results:")
    print(f"Metadata Extraction - Precision: {metadata_precision:.2f}, Recall: {metadata_recall:.2f}")
    print(f"Text Cleaning - Accuracy: {cleaning_accuracy:.2f}")
    print(f"Contraction Expansion Correct: {expansion_correct}")
    print(f"Normalization Correct: {normalization_correct}")
    print(f"Segmentation Accuracy: {segmentation_accuracy:.2f}")

# Step 1: Extract Metadata
def evaluate_metadata_extraction(extracted, ground_truth):
    correct = sum(1 for e, g in zip(extracted, ground_truth) if e == g)
    total = len(ground_truth)
    precision = correct / len(extracted) if extracted else 0
    recall = correct / total if total else 0
    return precision, recall


def evaluate_cleaning(cleaned_text, ground_truth_texts):
    # Check text matches the ground truth (normalized comparison)
    ground_truth_cleaned = [clean_text(gt["text"]) for gt in ground_truth_texts]
    accuracy = sum(1 for ct, gt in zip(cleaned_text, ground_truth_cleaned) if ct == gt) / len(ground_truth_cleaned)
    return accuracy


def evaluate_expansion(expanded_text, ground_truth):
    """Evaluate contraction expansion."""
    return expanded_text.strip().lower() == ground_truth.strip().lower()

def evaluate_normalization(cleaned_text, ground_truth):
    """Evaluate normalization (punctuation removal and lowercase)."""
    return cleaned_text.strip() == ground_truth.strip().lower()

def evaluate_segmentation(segmented_sentences, ground_truth_sentences):
    """Evaluate segmentation by comparing sentences."""
    correct = sum(1 for s1, s2 in zip(segmented_sentences, ground_truth_sentences) if s1.strip().lower() == s2.strip().lower())
    return correct / len(ground_truth_sentences)


