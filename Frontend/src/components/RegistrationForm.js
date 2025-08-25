import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { registerModel } from "../api"; // adjust path

export default function ModelApplicationForm() {
  const [step, setStep] = useState(1);
  const totalSteps = 10;
  const [showToast, setShowToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);

  // Form fields
  const [personalInfo, setPersonalInfo] = useState({ name: "", email: "", phone: "" });
  const [measurements, setMeasurements] = useState({ height: "", bust: "", waist: "", hips: "" });
  const [social, setSocial] = useState({ facebook: "", instagram: "", tiktok: "" });
  const [bio, setBio] = useState("");

  // Image states
  const [headshots, setHeadshots] = useState([null, null, null]);
  const [closeUps, setCloseUps] = useState([null, null, null]);
  const [fullBody, setFullBody] = useState([null, null, null]);
  const [pants, setPants] = useState([null, null, null]);
  const [sportswear, setSportswear] = useState([null, null, null]);

  // Default placeholder images
  const defaultImages = {
    headshots: [
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
    ],
    closeUps: [
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
      "https://images.pexels.com/photos/3778613/pexels-photo-3778613.jpeg",
      "https://images.pexels.com/photos/3778680/pexels-photo-3778680.jpeg",
    ],
    fullBody: [
      "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg",
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    ],
    pants: [
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
      "https://images.pexels.com/photos/3258762/pexels-photo-3258762.jpeg",
    ],
    sportswear: [
      "https://images.pexels.com/photos/3763871/pexels-photo-3763871.jpeg",
      "https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg",
      "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg",
    ],
  };

  // Load draft from localStorage
  useEffect(() => {
    const draft = localStorage.getItem("modelForm");
    if (draft) {
      const parsed = JSON.parse(draft);
      setPersonalInfo(parsed.personalInfo);
      setMeasurements(parsed.measurements);
      setSocial(parsed.social);
      setBio(parsed.bio);
      setHeadshots(parsed.headshots);
      setCloseUps(parsed.closeUps);
      setFullBody(parsed.fullBody);
      setPants(parsed.pants);
      setSportswear(parsed.sportswear);
    }
  }, []);

  // Save draft to localStorage
  useEffect(() => {
    localStorage.setItem("modelForm", JSON.stringify({ personalInfo, measurements, social, bio, headshots, closeUps, fullBody, pants, sportswear }));
  }, [personalInfo, measurements, social, bio, headshots, closeUps, fullBody, pants, sportswear]);

  // Handle image upload
  const handleUpload = (event, setter, index) => {
    const file = event.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setter(prev => prev.map((img, i) => (i === index ? url : img)));
  };

  // Remove image
  const handleRemove = (setter, index) => {
    setter(prev => prev.map((img, i) => (i === index ? null : img)));
  };

  // Step validation
  const isStepValid = () => {
    switch(step){
      case 1: return personalInfo.name && personalInfo.email && personalInfo.phone;
      case 2: return headshots.every(img => img);
      case 3: return closeUps.every(img => img);
      case 4: return fullBody.every(img => img);
      case 5: return pants.every(img => img);
      case 6: return sportswear.every(img => img);
      case 7: return measurements.height && measurements.bust && measurements.waist && measurements.hips;
      case 8: return social.facebook || social.instagram || social.tiktok;
      case 9: return bio.trim().length > 0;
      case 10: return true;
      default: return false;
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { personalInfo, measurements, social, bio, images: { headshots, closeUps, fullBody, pants, sportswear } };

    try {
      const response = await registerModel(formData);
      if(response.status === 201 || response.status === 200){
        setShowToast(true);
        setTimeout(()=>setShowToast(false), 3000);
        localStorage.removeItem("modelForm"); // clear draft

        // Reset form
        setStep(1);
        setPersonalInfo({ name: "", email: "", phone: "" });
        setMeasurements({ height: "", bust: "", waist: "", hips: "" });
        setSocial({ facebook: "", instagram: "", tiktok: "" });
        setBio("");
        setHeadshots([null,null,null]);
        setCloseUps([null,null,null]);
        setFullBody([null,null,null]);
        setPants([null,null,null]);
        setSportswear([null,null,null]);
      }
    } catch(err){
      console.error("Submission failed", err);
      setErrorToast(true);
      setTimeout(()=>setErrorToast(false),3000);
    }
  };

  // Image Step Component
  const ImageStep = ({images,setter,category,title}) => (
    <div className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold text-yellow-400">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {images.map((img,i)=>{
          const src = img || defaultImages[category][i];
          return (
            <div
              key={i}
              className="relative w-full h-40 rounded-xl overflow-hidden shadow-lg border border-yellow-500/30"
              onDragOver={e=>e.preventDefault()}
              onDrop={e=>{
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if(!file) return;
                const url = URL.createObjectURL(file);
                setter(prev=>prev.map((img,index)=> index===i? url : img));
              }}
            >
              <img src={src} alt={`${category}-${i}`} className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center gap-1 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                {img && <span className="bg-yellow-500/80 text-black text-xs px-2 py-0.5 rounded">{category}</span>}
                <div className="flex gap-2">
                  <label className="bg-blue-600 px-2 py-1 rounded text-white text-xs cursor-pointer hover:bg-blue-700">
                    Replace
                    <input type="file" accept="image/*" className="hidden" onChange={e=>handleUpload(e,setter,i)}/>
                  </label>
                  {img && <button type="button" onClick={()=>handleRemove(setter,i)} className="bg-red-600 px-2 py-1 rounded text-white text-xs hover:bg-red-700">Remove</button>}
                </div>
              </div>
              <p className="absolute bottom-1 right-1 text-xs text-yellow-300">{images.filter(img=>img).length}/3 uploaded</p>
            </div>
          )
        })}
      </div>
    </div>
  );

  const progressPercent = (step/totalSteps)*100;

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-lg px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-lg md:max-w-3xl p-6 sm:p-10 rounded-2xl shadow-2xl bg-gradient-to-br from-black via-zinc-900/90 to-black border border-yellow-500/20">

        {/* Progress */}
        <div className="w-full bg-yellow-500/20 h-2 rounded-full mb-6">
          <motion.div className="h-2 rounded-full bg-yellow-500" initial={{width:0}} animate={{width:`${progressPercent}%`}} transition={{duration:0.4}}/>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Personal Info */}
          {step===1 && (
            <motion.div key="step1" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400">👤 Personal Info</h2>
              <input type="text" placeholder="Full Name" value={personalInfo.name} onChange={e=>setPersonalInfo({...personalInfo,name:e.target.value})} className={`w-full p-3 rounded-lg bg-zinc-900/60 border ${!personalInfo.name && step===1?'border-red-500 animate-pulse':'border-yellow-500/30'} text-white`}/>
              <input type="email" placeholder="Email" value={personalInfo.email} onChange={e=>setPersonalInfo({...personalInfo,email:e.target.value})} className={`w-full p-3 rounded-lg bg-zinc-900/60 border ${!personalInfo.email && step===1?'border-red-500 animate-pulse':'border-yellow-500/30'} text-white`}/>
              <input type="tel" placeholder="Phone" value={personalInfo.phone} onChange={e=>setPersonalInfo({...personalInfo,phone:e.target.value})} className={`w-full p-3 rounded-lg bg-zinc-900/60 border ${!personalInfo.phone && step===1?'border-red-500 animate-pulse':'border-yellow-500/30'} text-white`}/>
            </motion.div>
          )}

          {step===2 && <motion.div key="step2" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}><ImageStep images={headshots} setter={setHeadshots} category="headshots" title="📸 Headshots"/></motion.div>}
          {step===3 && <motion.div key="step3" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}><ImageStep images={closeUps} setter={setCloseUps} category="closeUps" title="🔍 Close-ups"/></motion.div>}
          {step===4 && <motion.div key="step4" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}><ImageStep images={fullBody} setter={setFullBody} category="fullBody" title="🧍 Full Body"/></motion.div>}
          {step===5 && <motion.div key="step5" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}><ImageStep images={pants} setter={setPants} category="pants" title="👖 Pants/Jeans"/></motion.div>}
          {step===6 && <motion.div key="step6" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}><ImageStep images={sportswear} setter={setSportswear} category="sportswear" title="🏊 Sportswear/Swimwear"/></motion.div>}

          {/* Step 7: Measurements */}
          {step===7 && (
            <motion.div key="step7" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400">📏 Measurements</h2>
              <input type="text" placeholder="Height" value={measurements.height} onChange={e=>setMeasurements({...measurements,height:e.target.value})} className="w-full p-3 rounded-lg bg-zinc-900/60 border border-yellow-500/30 text-white"/>
              <input type="text" placeholder="Bust" value={measurements.bust} onChange={e=>setMeasurements({...measurements,bust:e.target.value})} className="w-full p-3 rounded-lg bg-zinc-900/60 border border-yellow-500/30 text-white"/>
              <input type="text" placeholder="Waist" value={measurements.waist} onChange={e=>setMeasurements({...measurements,waist:e.target.value})} className="w-full p-3 rounded-lg bg-zinc-900/60 border border-yellow-500/30 text-white"/>
              <input type="text" placeholder="Hips" value={measurements.hips} onChange={e=>setMeasurements({...measurements,hips:e.target.value})} className="w-full p-3 rounded-lg bg-zinc-900/60 border border-yellow-500/30 text-white"/>
            </motion.div>
          )}

          {/* Step 8: Social */}
          {step===8 && (
            <motion.div key="step8" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400">🌐 Social Media</h2>
              <input type="text" placeholder="Facebook" value={social.facebook} onChange={e=>setSocial({...social,facebook:e.target.value})} className="w-full p-3 rounded-lg bg-zinc-900/60 border border-yellow-500/30 text-white"/>
              <input type="text" placeholder="Instagram" value={social.instagram} onChange={e=>setSocial({...social,instagram:e.target.value})} className="w-full p-3 rounded-lg bg-zinc-900/60 border border-yellow-500/30 text-white"/>
              <input type="text" placeholder="TikTok" value={social.tiktok} onChange={e=>setSocial({...social,tiktok:e.target.value})} className="w-full p-3 rounded-lg bg-zinc-900/60 border border-yellow-500/30 text-white"/>
            </motion.div>
          )}

          {/* Step 9: Bio */}
          {step===9 && (
            <motion.div key="step9" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400">📝 Bio</h2>
              <textarea placeholder="Short bio about yourself" value={bio} onChange={e=>setBio(e.target.value)} className="w-full p-3 rounded-lg bg-zinc-900/60 border border-yellow-500/30 text-white h-32 resize-none"/>
            </motion.div>
          )}

          {/* Step 10: Review & Submit */}
          {step===10 && (
            <motion.div key="step10" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}} className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 text-center">✅ Review & Submit</h2>
              <p className="text-center text-yellow-300">Make sure all fields and images are correct before submitting.</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[...headshots,...closeUps,...fullBody,...pants,...sportswear].map((img,i)=>(
                  <img key={i} src={img || "https://via.placeholder.com/100"} className="w-full h-24 object-cover rounded"/>
                ))}
              </div>

              <button type="submit" disabled={!isStepValid()} className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg text-white font-bold transition-transform duration-200 hover:scale-105">Submit Application</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step>1 && <button type="button" onClick={()=>setStep(s=>s-1)} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg">Back</button>}
          {step<10 && <button type="button" onClick={()=>isStepValid()&&setStep(s=>s+1)} disabled={!isStepValid()} className="ml-auto bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg disabled:opacity-50">Next</button>}
        </div>
      </form>

      {/* Success Toast */}
      {showToast && (
        <motion.div initial={{y:50,opacity:0}} animate={{y:0,opacity:1}} exit={{y:50,opacity:0}} className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl">
          🎉 Registration Successful!
        </motion.div>
      )}

      {/* Error Toast */}
      {errorToast && (
        <motion.div initial={{y:50,opacity:0}} animate={{y:0,opacity:1}} exit={{y:50,opacity:0}} className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-xl shadow-xl">
          ❌ Submission Failed. Please try again.
        </motion.div>
      )}
    </div>
  );
}
