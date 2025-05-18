
# Credit Card Fraud Detection using Neural Networks

This notebook demonstrates the complete end-to-end workflow for detecting fraudulent credit card transactions using a deep learning model, including data exploration, preprocessing, handling class imbalance with SMOTE, model training using Keras, and evaluation.

## 📦 Requirements

```bash
!pip install scikit-learn==1.3.2 imbalanced-learn==0.11.0
```

---

## 🧾 Dataset

- **Input File:** `/kaggle/input/creditcardfraud/creditcard.csv`
- **Test File:** `/kaggle/input/classification-test-file-csv/Classification_Test_file.csv`

The dataset contains anonymized features (V1 to V28), `Time`, `Amount`, and a binary `Class` label indicating fraudulent (1) or legitimate (0) transactions.

---

## 📊 Steps Overview

### 1. **Data Loading & Exploration**
- Displays first few rows and random samples.
- Provides summary statistics and dataset information.
- Checks for duplicates and missing values.

### 2. **Handling Imbalance**
- The dataset is highly imbalanced (very few fraud cases).
- SMOTE (Synthetic Minority Over-sampling Technique) is applied to balance the dataset.

### 3. **Preprocessing**
- Split the resampled dataset into training and validation sets.
- Scaled using `RobustScaler` to handle outliers.
- External test file also scaled accordingly.
- The scaler is saved using `joblib`.

### 4. **Modeling (Keras Neural Network)**
- A Sequential model is built with 3 hidden layers.
- Uses `Adam` optimizer and `sparse_categorical_crossentropy` loss.
- Early stopping is used to avoid overfitting.
- Training and validation metrics are plotted for visualization.

### 5. **Evaluation**
- Model predictions are evaluated using F1-score (macro average).
- Loss and accuracy curves are plotted.
- Keras model architecture is visualized.
- Predictions on the test set are saved as a CSV file.
- Final model is saved as `.keras` file.

---

## 🧠
