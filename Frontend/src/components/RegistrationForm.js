import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

export default function ModelingRegistrationForm() {
  const [step, setStep] = useState(1);
  const [banner, setBanner] = useState(null);
  const [headshots, setHeadshots] = useState([]);
  const [fullBody, setFullBody] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  // Handle uploads
  const handleUpload = (event, setter, current) => {
    const files = Array.from(event.target.files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setter([...current, ...urls].slice(0, 3)); // only allow 3
  };

  const handleRemove = (index, setter, current) => {
    setter(current.filter((_, i) => i !== index));
  };

  // Render placeholders with captions
  const Placeholders = ({ images, setter }) => (
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="relative bg-white/20 backdrop-blur-md rounded-xl overflow-hidden shadow-lg"
        >
          {images[i] ? (
            <div className="relative">
              <img
                src={images[i]}
                alt={`uploaded-${i}`}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => handleRemove(i, setter, images)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-white">
              <img
                src={`https://via.placeholder.com/200x300?text=Portrait+${i + 1}`}
                alt="placeholder"
                className="h-40 w-auto rounded-md"
              />
              <p className="text-sm mt-2">Click upload to replace</p>
            </div>
          )}
        </div>
      ))}
      <div className="col-span-3 flex justify-center mt-4">
        <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer">
          Upload Images
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleUpload(e, setter, images)}
          />
        </label>
      </div>
    </div>
  );

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));
  const handleSubmit = () => setSubmitted(true);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4">
      {submitted && <Confetti />}

      {/* Banner */}
      <div className="w-full max-w-4xl mb-10">
        <div className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
          {banner ? (
            <img
              src={banner}
              alt="banner"
              className="w-full h-60 object-cover"
            />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
              alt="placeholder banner"
              className="w-full h-60 object-cover"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <label className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg cursor-pointer">
              {banner ? "Change Banner" : "Upload Banner"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setBanner(URL.createObjectURL(e.target.files[0]))
                }
              />
            </label>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === s ? "bg-blue-600" : "bg-gray-600"
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-4">Headshots</h2>
              <Placeholders images={headshots} setter={setHeadshots} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-4">Full Body Shots</h2>
              <Placeholders images={fullBody} setter={setFullBody} />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
              <Placeholders images={portfolio} setter={setPortfolio} />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-4">Review & Submit</h2>
              <p className="mb-6">Make sure all your photos are uploaded.</p>
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
              >
                Submit Application
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
            >
              Back
            </button>
          )}
          {step < 4 && (
            <button
              onClick={handleNext}
              className="ml-auto bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
