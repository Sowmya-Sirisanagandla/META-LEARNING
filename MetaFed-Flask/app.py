from flask import Flask, request, jsonify
import torch, joblib
import pandas as pd
import numpy as np

from model_definitions import HybridGRUTransformerMTL

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# DEFAULT: Client A model
MODEL_PATH = "models/personalized_A_state.pt"
SCALER_PATH = "models/final_heart_scaler_A.pkl"

# Load model + scaler FIRST
state = torch.load(MODEL_PATH, map_location=DEVICE)
scaler = joblib.load(SCALER_PATH)

# ✅ Now scaler exists → print expected column names
print("\nScaler expects columns:\n", scaler.feature_names_in_, "\n")

feature_dim = scaler.mean_.shape[0]
model = HybridGRUTransformerMTL(feature_dim).to(DEVICE)
model.load_state_dict(state, strict=False)
model.eval()

app = Flask(__name__)

@app.get("/")
def index():
    return "MetaFed Flask is running. Try /health or POST /predict_heart"

@app.get("/health")
def health():
    return {"status": "ok"}

@app.route('/predict_heart', methods=['POST'])
def predict_heart():
    # ----------------------------
    # 1. Read incoming JSON safely
    # ----------------------------
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({
            "error": "Invalid or empty JSON. Send a proper JSON body."
        }), 400

    # ----------------------------
    # 2. Validate required fields
    # ----------------------------
    REQUIRED = [
        'age','sex','cp','trestbps','chol','fbs','restecg',
        'thalach','exang','oldpeak','slope','ca','thal','Subject'
    ]

    missing = [f for f in REQUIRED if f not in data]
    if missing:
        return jsonify({
            "error": "Missing required features.",
            "missing_fields": missing,
            "required_fields": REQUIRED
        }), 400

    # ----------------------------
    # 3. Convert JSON -> DataFrame
    # ----------------------------
    try:
        df = pd.DataFrame([[data[f] for f in REQUIRED]], columns=REQUIRED)
    except Exception as e:
        return jsonify({"error": "Data formatting failed", "details": str(e)}), 400

    # ----------------------------
    # 4. Numeric fix + scaling
    # ----------------------------
    df = df.apply(pd.to_numeric, errors="coerce").fillna(0)

    try:
        x = scaler.transform(df)
    except Exception as e:
        return jsonify({"error": "Scaler transform failed", "details": str(e)}), 500

    x = torch.tensor(x, dtype=torch.float32).to(DEVICE)

    # ----------------------------
    # 5. Create dummy sequence input
    #    (your model requires 2 inputs)
    # ----------------------------
    seq = torch.zeros((1, 30, 1), device=DEVICE)

    # ----------------------------
    # 6. Model prediction
    # ----------------------------
    try:
        with torch.no_grad():
            logits, _ = model(x, seq)
            pred = int(logits.argmax(dim=1).item())
    except Exception as e:
        return jsonify({"error": "Model inference failed", "details": str(e)}), 500

    # ----------------------------
    # 7. Successful response
    # ----------------------------
    return jsonify({
        "heart_risk_class": pred,
        "status": "success"
    })

@app.route('/predict_diabetes', methods=['POST'])

def predict_diabetes():
    data = request.json  # expects {"cgm_values": [...]}

    seq = data["cgm_values"]

    # Convert to tensor: shape (1, seq_len, 1)
    seq = torch.tensor(seq, dtype=torch.float32).unsqueeze(0).unsqueeze(-1).to(DEVICE)

    # Dummy heart input (not used for diabetes prediction)
    dummy = torch.zeros((1, feature_dim), device=DEVICE)

    model.eval()
    with torch.no_grad():
        _, logits_d = model(dummy, seq)
        pred = logits_d.argmax(dim=1).item()

    return jsonify({"glucose_trend_class": int(pred)})




app.run(debug=True)
