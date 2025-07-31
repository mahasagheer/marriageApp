import { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createProfile,
  updateProfile,
  fetchProfileById,
} from "../../slice/userProfile";

import { Input } from "../../Components/Layout/Input";
import { Button } from "../../Components/Layout/Button";
import {
  FiUser,
  FiUsers,
  FiHeart,
  FiCalendar,
  FiTrendingUp,
  FiBookOpen,
  FiStar,
  FiAward,
  FiBriefcase,
  FiDollarSign,
  FiAlignLeft,
  FiArrowRight,
  FiArrowLeft,
  FiUploadCloud,
  FiPenTool,
} from "react-icons/fi";
import { RadioInput } from "../../Components/Layout/radioButton";
import { genderOptions, maritalStatusOptions } from "../../utils";
import { Label } from "../../Components/Layout/Label";
import { UserCircle2, } from "lucide-react";
import { toast } from "react-toastify";

export default function CreateProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    religion: "",
    caste: "",
    education: "",
    occupation: "",
    income: "",
    maritalStatus: "",
    bio: "",
    pic: null,
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const steps = ["Personal", "Background", "Educational Details", "Files"];
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProfileById(id))
        .unwrap()
        .then((data) => setProfile(data))
        .catch((error) => console.error("Error fetching profile:", error));
    }
  }, [id, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setProfile((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const totalKeys = Object.keys(profile).length;
  const filledCount = useMemo(
    () =>
      Object.values(profile).filter((v) =>
        typeof v === "string" ? v.trim() : v !== null
      ).length,
    [profile]
  );
  const progress = Math.round((filledCount / totalKeys) * 100);


  const validateCurrentStep = () => {
    const err = {};
    if (step === 0) {
      if (!profile.name.trim()) err.name = "Name is required";
      if (!profile.age || profile.age < 18) err.age = "Age must be 18 or above";
      if (!profile.gender) err.gender = "Gender is required";
      if (!profile.height.trim()) err.height = "Height is required";
    }
    if (step === 1) {
      if (!profile.maritalStatus) err.maritalStatus = "Marital Status is required";
      if (!profile.religion.trim()) err.religion = "Religion is required";
      if (!profile.caste.trim()) err.caste = "Caste is required";
    }
    if (step === 2) {
      if (!profile.education.trim()) err.education = "Education required";
      if (!profile.occupation.trim()) err.occupation = "Occupation required";
      if (!profile.income.trim()) err.income = "Income required";
      if (!profile.bio.trim()) err.bio = "Bio required";
    }
    setErrors(err);
    if (Object.keys(err).length) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep() || isSubmitting) return;
    setIsSubmitting(true);
    const formData = new FormData();
    // Required fields
    formData.append("name", profile.name);
    formData.append("age", profile.age);
    formData.append("gender", profile.gender);
    formData.append("height", profile.height);
    formData.append("religion", profile.religion);
    formData.append("caste", profile.caste);
    formData.append("education", profile.education);
    formData.append("occupation", profile.occupation);
    formData.append("income", profile.income);
    formData.append("bio", profile.bio);
    formData.append("maritalStatus", profile.maritalStatus);

    // Optional fields
    if (profile.pic) formData.append("pic", profile.pic);
    if (profile.file) formData.append("file", profile.file);

    try {

      if (id) {

        await dispatch(updateProfile({ id: id, updates: formData }));
        toast.success("Profile updated successfully!");
        navigate(`/user/${profile?.userId}`);

      } else {
        await dispatch(createProfile(formData)).unwrap().then((res) => {
          if (res) {
            navigate(`/user/${res?.userId}`);

          }
        });
        toast.success("Profile created successfully!");

      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };


  const ErrorMsg = ({ msg }) =>
    msg ? <p className="text-xs text-red-600 dark:text-red-400  mt-1">{msg}</p> : null;

  return (
    <main className="max-w-[100%] bg-white dark:bg-gray-900 py-10 px-4 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
        {id ? (
          <>
            <FiPenTool className="w-8 h-8 text-red-600" />
            <span>Edit Profile</span>
          </>
        ) : (
          <>
            <UserCircle2 className="w-8 h-8 text-red-600" />
            <span>Create Your Matchmaking Profile</span>
          </>
        )}
      </h1>


      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
        <div
          className="bg-marriageHotPink h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>


      <div className="flex justify-between mb-8">
        {steps.map((s, idx) => (
          <div
            key={s}
            className={`flex-1 text-center text-xs ${idx === step ? "text-marriageHotPink font-semibold" : "text-gray-500 dark:text-gray-400"
              }`}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Step 0: Personal */}
      {step === 0 && (
        <div className="space-y-5">
          <div>
            <Label icon={FiUser}>Full Name</Label>
            <Input
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
            />
            <ErrorMsg msg={errors.name} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label icon={FiCalendar}>Age</Label>
              <Input
                name="age"
                type="number"
                min="18"
                value={profile.age}
                onChange={handleChange}
              />
              <ErrorMsg msg={errors.age} />
            </div>
            {/* Gender Radio Group */}
            <div>
              <Label icon={FiUsers}>Gender</Label>
              <div className="space-y-2 mt-2">
                {genderOptions.map((option) => (
                  <RadioInput
                    key={option.value}
                    name="gender"
                    value={option.value}
                    checked={profile.gender === option.value}
                    onChange={handleChange}
                    label={option.label}
                  />
                ))}
              </div>
              <ErrorMsg msg={errors.gender} />
            </div>

          </div>
          <div>
            <Label icon={FiTrendingUp}>Height</Label>
            <Input
              name="height"
              value={profile.height}
              onChange={handleChange}
              placeholder="e.g. 5'8 "
            />
            <ErrorMsg msg={errors.height} />
          </div>
        </div>
      )}

      {/* Step 1: Background */}
      {step === 1 && (
        <div className="space-y-5">
          {/* Marital Status Radio Group */}
          <div>
            <Label icon={FiHeart}>Marital Status</Label>
            <div className="space-y-2 mt-2">
              {maritalStatusOptions.map((option) => (
                <RadioInput
                  key={option.value}
                  name="maritalStatus"
                  value={option.value}
                  checked={profile?.maritalStatus === option.value}
                  onChange={handleChange}
                  label={option.label}
                />

              ))}
            </div>
            <ErrorMsg msg={errors.maritalStatus} />
          </div>
          <div>
            <Label icon={FiStar}>Religion</Label>
            <Input
              name="religion"
              value={profile.religion}
              onChange={handleChange}
            />
            <ErrorMsg msg={errors.religion} />
          </div>
          <div>
            <Label icon={FiAward}>Caste</Label>
            <Input
              name="caste"
              value={profile.caste}
              onChange={handleChange}
            />
            <ErrorMsg msg={errors.caste} />
          </div>
        </div>
      )}

      {/* Step 2: Education */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <Label icon={FiBookOpen}>Education</Label>
            <Input
              name="education"
              value={profile.education}
              onChange={handleChange}
            />
            <ErrorMsg msg={errors.education} />
          </div>
          <div>
            <Label icon={FiBriefcase}>Occupation</Label>
            <Input
              name="occupation"
              value={profile.occupation}
              onChange={handleChange}
            />
            <ErrorMsg msg={errors.occupation} />
          </div>
          <div>
            <Label icon={FiDollarSign}>Income</Label>
            <Input
              name="income"
              value={profile.income}
              onChange={handleChange}
            />
            <ErrorMsg msg={errors.income} />
          </div>
          <div>
            <Label icon={FiAlignLeft}>Short Bio</Label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 border-gray-300 dark:bg-gray-700 dark:text-white border border-marriagePink focus:outline-none focus:ring-2 focus:ring-marriageHotPink rounded-lg"
            />
            <ErrorMsg msg={errors.bio} />
          </div>
        </div>
      )}

      {/* Step 3: Profile Pic */}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <Label icon={FiUploadCloud}>Profile Picture</Label>
            {profile.pic && (
              <img
                src={`http://localhost:5000/${profile.pic}` || URL.createObjectURL(profile.pic)}
                alt="Current Profile"
                className="mb-2 h-24 w-24 object-cover rounded-full border"
              />
            )}
            <Input
              name="pic"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div>
            <Label icon={FiUploadCloud}>CNIC </Label>
            <Input
              name="file"
              type="file"
              onChange={handleFileChange}
            />
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-x-10 justify-end mt-10">
        {step > 0 && (
          <Button
            btnText="Back"
            btnColor="marriageHotPink"
            icon={<FiArrowLeft />}
            onClick={prevStep}
            type="button"
          />
        )}
        {step < steps.length - 1 ? (
          <Button
            btnText="Next"
            btnColor="marriageHotPink"
            icon={<FiArrowRight />}
            onClick={nextStep}
            type="button"
          />
        ) : (
          <Button
            btnText={id ? "Update Profile" : "Submit Profile"}
            btnColor="marriageHotPink"
            onClick={handleSubmit}
            type="button"
            disabled={isSubmitting}
          />
        )}
      </div>
    </main>
  );
}