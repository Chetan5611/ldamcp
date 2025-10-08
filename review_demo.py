import sounddevice as sd
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import os
import soundfile as sf
import librosa
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, confusion_matrix
import joblib
import time

# --- Configuration ---
# Set the MODE to what you want to do:
# 'train': Trains the ML model using the Kaggle dataset.
# 'predict': Listens to the mic and uses the trained model for real-time prediction.
MODE = 'train'

# --- Multi-Class Sound Categories ---
# !!! CRITICAL: Update this list to exactly match the folder names in your 'kaggle_dataset' directory !!!
# Make sure to also include a 'background' category. You'll need to record this yourself.
CATEGORIES = ["Bus", "Car", "Motorcycle", "Train", "Truck", "background"]
LABEL_MAP = {label: i for i, label in enumerate(CATEGORIES)}
REVERSE_LABEL_MAP = {i: label for label, i in LABEL_MAP.items()}

# Audio settings
DEVICE = None
SAMPLERATE = 44100 # We will resample all audio to this rate
CHANNELS = 1
WINDOW_SIZE = 4096

# Data and model paths
DATA_DIR = "kaggle_dataset" # Pointing to your new dataset folder
BACKGROUND_DATA_DIR = "audio_data_multi_class/background" # A separate place for your own background recordings
MODEL_FILE = "vehicle_sound_classifier.joblib"

# --- Machine Learning Functions ---

def extract_features(audio_data, sample_rate):
    """Extracts MFCC features from audio data."""
    try:
        # Resample to a consistent rate
        if sample_rate != SAMPLERATE:
            audio_data = librosa.resample(y=audio_data, orig_sr=sample_rate, target_sr=SAMPLERATE)
        
        mfccs = librosa.feature.mfcc(y=audio_data, sr=SAMPLERATE, n_mfcc=13)
        mfccs_processed = np.mean(mfccs.T, axis=0)
        return mfccs_processed
    except Exception as e:
        print(f"Error extracting features: {e}")
        return None

def train_model():
    """Loads Kaggle audio, extracts features, trains a multi-class SVM model, and saves it."""
    print("Starting model training using Kaggle dataset...")
    features = []
    labels = []

    # Loop through each category to load data
    for category, label_index in LABEL_MAP.items():
        # Special case for 'background' noise which you record yourself
        if category == 'background':
            category_dir = BACKGROUND_DATA_DIR
            if not os.path.exists(category_dir):
                print("\n--- IMPORTANT ---")
                print("Background noise folder not found. A model trained without it will have many false positives.")
                print("Please create it by running the OLD review_demo.py script in 'record' mode and choosing 'background'.")
                print("-----------------\n")
                continue
        else:
            category_dir = os.path.join(DATA_DIR, category)

        if not os.path.exists(category_dir):
            print(f"Warning: Directory '{category_dir}' not found for category '{category}'. Skipping.")
            continue
        
        print(f"Loading data for '{category}'...")
        file_count = 0
        for filename in os.listdir(category_dir):
            if filename.endswith(('.wav', '.mp3', '.flac')):
                filepath = os.path.join(category_dir, filename)
                try:
                    # Use soundfile for broad format support, librosa for resampling
                    audio, sr = sf.read(filepath, dtype='float32')
                    # Convert to mono if stereo
                    if audio.ndim > 1:
                        audio = audio.mean(axis=1)
                    
                    feature = extract_features(audio, sr)
                    if feature is not None:
                        features.append(feature)
                        labels.append(label_index)
                        file_count += 1
                except Exception as e:
                    print(f"  Could not process file {filename}: {e}")
        print(f"  Loaded {file_count} files.")


    if len(features) < 20:
        print("Not enough data to train. Please check your data folders.")
        return

    # Split data and train the model
    X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42, stratify=labels)
    model = SVC(kernel='rbf', probability=True, C=10, gamma='scale') # Tuned parameters
    print("\nTraining the multi-class SVM model... This may take a few minutes.")
    start_time = time.time()
    model.fit(X_train, y_train)
    end_time = time.time()
    print(f"Training finished in {end_time - start_time:.2f} seconds.")

    # Evaluate and save the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nModel trained with an accuracy of: {accuracy * 100:.2f}%")
    
    # Optional: Print a confusion matrix to see what it gets wrong
    print("\nConfusion Matrix:")
    cm = confusion_matrix(y_test, y_pred)
    print("Labels:", [REVERSE_LABEL_MAP[i] for i in range(len(CATEGORIES))])
    print(cm)
    
    joblib.dump(model, MODEL_FILE)
    print(f"\nModel saved to {MODEL_FILE}")

# --- Real-Time Prediction Functions ---
if MODE == 'predict':
    try:
        model = joblib.load(MODEL_FILE)
        print("Machine learning model loaded successfully.")
    except FileNotFoundError:
        print(f"Error: Model file '{MODEL_FILE}' not found. Please train the model first by setting MODE to 'train'.")
        exit()

def predict_audio_callback(indata, frames, time, status):
    """Callback for real-time prediction."""
    if status:
        print(status, flush=True)
    
    audio_data = indata[:, 0]
    features = extract_features(audio_data, SAMPLERATE)
    
    if features is not None:
        features = features.reshape(1, -1)
        prediction_index = model.predict(features)[0]
        probability = model.predict_proba(features)
        
        predicted_label = REVERSE_LABEL_MAP[prediction_index]
        
        if predicted_label != 'background':
            confidence = np.max(probability)
            if confidence > 0.85: # Higher confidence threshold for better accuracy
                print(f"!!! DETECTED: {predicted_label.upper()} !!! (Confidence: {confidence * 100:.2f}%)")

# --- Main Program Logic ---
if MODE == 'train':
    train_model()

elif MODE == 'predict':
    # This part is for real-time visualization and prediction
    fig, ax = plt.subplots()
    def setup_plot():
        ax.set_ylim(-1, 1)
        ax.set_title("Real-Time Audio Waveform")
        ax.grid(True)
    line, = ax.plot(np.zeros(WINDOW_SIZE))
    
    def plot_callback(indata, frames, time, status):
        """This function just updates the plot."""
        line.set_ydata(indata[:, 0])

    def update_plot(frame):
        return line,

    try:
        plot_stream = sd.InputStream(device=DEVICE, channels=CHANNELS, samplerate=SAMPLERATE, blocksize=WINDOW_SIZE, callback=plot_callback)
        predict_stream = sd.InputStream(device=DEVICE, channels=CHANNELS, samplerate=SAMPLERATE, blocksize=WINDOW_SIZE, callback=predict_audio_callback)
        
        setup_plot()
        ani = FuncAnimation(fig, update_plot, blit=True, interval=50)
        
        with plot_stream, predict_stream:
            print("\nStarting live prediction... Press Ctrl+C to stop.")
            plt.show()

    except Exception as e:
        print(f"An error occurred: {e}")
else:
    print(f"Invalid MODE: '{MODE}'. Please choose 'train' or 'predict'.")

