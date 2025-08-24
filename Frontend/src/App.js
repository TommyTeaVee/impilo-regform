import React, { useState } from "react";
import axios from "axios";

const categories = [
  "Content Creation",
  "Painting",
  "Runway",
  "Singing",
  "Other",
  "Acting",
  "Sports",
];

export default function StepperForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    category: [],
    portfolioLink: "",
    profileImage: null,
    extraImages: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (cat) => {
    setFormData((prev) => {
      const updated = prev.category.includes(cat)
        ? prev.category.filter((c) => c !== cat)
        : [...prev.category, cat];
      return { ...prev, category: updated };
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "profileImage") {
      setFormData((prev) => ({ ...prev, profileImage: files[0] }));
    } else if (name === "extraImages") {
      setFormData((prev) => ({
        ...prev,
        extraImages: [...prev.extraImages, ...files],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    formData.category.forEach((cat) => data.append("category", cat));
    data.append("portfolioLink", formData.portfolioLink);
    if (formData.profileImage) {
      data.append("profileImage", formData.profileImage);
    }
    formData.extraImages.forEach((file) =>
      data.append("extraImages", file)
    );

    try {
      const res = await axios.post("http://localhost:5050/api/registrations", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Registration successful!");
      console.log(res.data);
    } catch (error) {
      console.error(error);
      alert("Registration failed!");
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1 - Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        )}

        {/* Step 2 - Categories */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleCategoryToggle(cat)}
                  className={`px-4 py-2 rounded-full border ${
                    formData.category.includes(cat)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 - Portfolio & Images */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Portfolio & Images</h2>
            <input
              type="url"
              name="portfolioLink"
              placeholder="Portfolio Link"
              value={formData.portfolioLink}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
            <div>
              <label className="block font-medium mb-1">Profile Image</label>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Extra Images</label>
              <input
                type="file"
                name="extraImages"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Step 4 - Review & Submit */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Review Information</h2>
            <p><strong>Name:</strong> {formData.fullName}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Phone:</strong> {formData.phone}</p>
            <p><strong>Categories:</strong> {formData.category.join(", ")}</p>
            <p><strong>Portfolio:</strong> {formData.portfolioLink}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Back
            </button>
          )}
          {step < 4 && (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Next
            </button>
          )}
          {step === 4 && (
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
