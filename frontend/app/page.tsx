'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import Fuse from "fuse.js";
import { Dumbbell, HeartPulse, Leaf, Shield } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

const knownSymptoms = [
  "itching", "skin_rash", "nodal_skin_eruptions", "continuous_sneezing", "shivering",
  "chills", "joint_pain", "stomach_pain", "acidity", "ulcers_on_tongue", "muscle_wasting",
  "vomiting", "burning_micturition", "spotting_urination", "fatigue", "weight_gain",
  "anxiety", "cold_hands_and_feets", "mood_swings", "weight_loss", "restlessness",
  "lethargy", "patches_in_throat", "irregular_sugar_level", "cough", "high_fever",
  "sunken_eyes", "breathlessness", "sweating", "dehydration", "indigestion", "headache",
  "yellowish_skin", "dark_urine", "nausea", "loss_of_appetite", "pain_behind_the_eyes",
  "back_pain", "constipation", "abdominal_pain", "diarrhoea", "mild_fever", "yellow_urine",
  "yellowing_of_eyes", "acute_liver_failure", "fluid_overload"
];

const fuse = new Fuse(knownSymptoms, { threshold: 0.4 });

const getSuggestions = (input: string): { valid: string[], unknown: string[], suggestions: { input: string, suggestion: string }[] } => {
  const words = input.toLowerCase().split(/,|\s+/).map(w => w.trim()).filter(Boolean);
  const suggestions: { input: string, suggestion: string }[] = [];
  const valid: string[] = [];
  const unknown: string[] = [];

  for (const word of words) {
    if (knownSymptoms.includes(word)) {
      valid.push(word);
    } else {
      unknown.push(word);
      const match = fuse.search(word)[0];
      if (match && match.item !== word) {
        suggestions.push({ input: word, suggestion: match.item });
      }
    }
  }

  return { valid, unknown, suggestions };
};
interface PredictionData {
  disease: string;
  description: string;
  workout: string[];
  diet: string[];
  precaution: string[];
  medication: string[];
}



export default function Home() {
  const [symptoms, setSymptoms] = useState("");
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { valid, unknown, suggestions } = getSuggestions(symptoms);
  
  
  const handleSuggestionClick = (input: string, suggestion: string) => {
    const regex = new RegExp(`\\b${input}\\b`, 'gi');
    const updated = symptoms.replace(regex, suggestion);
    setSymptoms(updated);
  };
  
  const handleSubmit = async () => {
    if (unknown.length > 0) {
      alert("Please correct the unknown symptoms before submitting.");
      return;
    }
    
    
    setLoading(true);
    setData(null);
    try{
      const res = await axios.post("/api/proxy", {symptoms})
      
      setData(res?.data);
      
      setLoading(false)
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 text-center font-semibold text-xl shadow-md">
        🏥 Health Assistant – Medicine Predictor

        <Button
  onClick={() => signOut({ callbackUrl: "/login" })}
  className="bg-white text-blue-600 font-semibold px-4 py-2 rounded shadow hover:bg-blue-100 transition"
>
  Sign Out
</Button>

      </header>

      <main className="flex-1 max-w-2xl mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-600">
          🩺 Predict Disease Based on Symptoms
        </h1>

        <Textarea
          placeholder="Enter your symptoms (e.g. headache, fatigue)"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className="resize-none"
        />

        {suggestions.length > 0 && (
          <div className="bg-yellow-50 text-yellow-800 p-2 rounded-md border border-yellow-300">
            <p className="font-medium">We found some unknown symptoms. Click to correct:</p>
            <ul className="list-disc list-inside text-sm">
              {suggestions.map((s, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleSuggestionClick(s.input, s.suggestion)}
                    className=" hover:text-blue-700 transition"
                  >
                    {s.suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button onClick={handleSubmit} disabled={loading || unknown.length > 0} className="w-full">
          {loading ? "Predicting..." : "Predict Disease"}
        </Button>
        {data && (
  <>
    <div className="space-y-4">
      {/* Disease & Description */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-xl font-semibold text-red-600">
            <HeartPulse className="w-5 h-5" /> {data.disease}
          </div>
          <p className="text-gray-700">{data.description}</p>
        </CardContent>
      </Card>

      {/* Workout */}
      {data.workout?.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center gap-2 font-medium">
              <Dumbbell className="w-5 h-5 text-indigo-500" /> Recommended Workout
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {data.workout.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Diet */}
      {data.diet?.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center gap-2 font-medium">
              <Leaf className="w-5 h-5 text-green-600" /> Suggested Diet
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {data.diet.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Precaution */}
      {data.precaution?.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center gap-2 font-medium">
              <Shield className="w-5 h-5 text-yellow-600" /> Precautionary Measures
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {data.precaution.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Medication */}
      {data.medication && (
        <Card>
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center gap-2 font-medium">
              💊 Recommended Medications
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {(
                data.medication?.length === 1 && data.medication[0].startsWith("[")
                  ? JSON.parse(data.medication[0].replace(/'/g, '"'))
                  : data.medication
              ).map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  </>
)}

      </main>

      <footer className="bg-gray-100 text-center text-sm text-gray-600 py-2 border-t">
        © {new Date().getFullYear()} Health Assistant. All rights reserved.
      </footer>
    </div>
  );
}
