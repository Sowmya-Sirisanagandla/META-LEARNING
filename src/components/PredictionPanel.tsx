import React, { useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

export default function PredictionPanel() {
  // HEART FORM
  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: "",
    Subject: "",
  });

  // DIABETES CGM
  const [cgmValues, setCgmValues] = useState("");

  // RESULTS
  const [heartResult, setHeartResult] = useState<string | null>(null);
  const [diabetesResult, setDiabetesResult] = useState<string | null>(null);

  // Handle heart form change
  const handleHeartChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // HEART PREDICTION
  const predictHeart = async () => {
    try {
      const res = await axios.post("http://localhost:5001/api/heart", formData);
      setHeartResult("Heart Risk Class: " + res.data.heart_risk_class);
    } catch (err) {
      setHeartResult("Error predicting heart risk");
    }
  };

  // DIABETES PREDICTION
  const predictDiabetes = async () => {
    try {
      const arr = cgmValues.split(",").map((n) => Number(n.trim()));
      const res = await axios.post("http://localhost:5001/api/diabetes", {
        cgm_values: arr,
      });
      setDiabetesResult(
        "Glucose Trend Class: " + res.data.glucose_trend_class
      );
    } catch (err) {
      setDiabetesResult("Error predicting glucose trend");
    }
  };

  return (
    <Card className="p-6 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">
          🔬 AI Prediction Panel (Heart + Diabetes)
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">

        {/* HEART PREDICTION */}
        <div>
          <h2 className="text-xl font-semibold mb-3">❤️ Heart Disease Prediction</h2>

          <div className="grid grid-cols-2 gap-4">
            {Object.keys(formData).map((field) => (
              <div key={field} className="space-y-1">
                <Label className="capitalize">{field}</Label>
                <Input
                  name={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleHeartChange}
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}
          </div>

          <Button onClick={predictHeart} className="mt-4 w-full">
            Predict Heart Risk
          </Button>

          {heartResult && (
            <div className="mt-3 p-3 rounded bg-slate-100 dark:bg-slate-700">
              {heartResult}
            </div>
          )}
        </div>

        <Separator />

        {/* DIABETES PREDICTION */}
        <div>
          <h2 className="text-xl font-semibold mb-3">💙 Diabetes Trend Prediction</h2>

          <Label>CGM Values (comma separated)</Label>
          <Input
            placeholder="120,130,128,140,150..."
            value={cgmValues}
            onChange={(e) => setCgmValues(e.target.value)}
          />

          <Button onClick={predictDiabetes} className="mt-4 w-full">
            Predict Diabetes Trend
          </Button>

          {diabetesResult && (
            <div className="mt-3 p-3 rounded bg-slate-100 dark:bg-slate-700">
              {diabetesResult}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
