import { FaBirthdayCake, FaRulerVertical, FaMoneyBillWave, FaBriefcase, FaPrayingHands } from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { MdOutlineDiversity2 } from "react-icons/md";
import { ConvertCmToFeetInches } from "../../utilityFunctions";

const PreferenceCard = ({ preferences }) => {
  const {
    preferredAgeRange,
    preferredHeight,
    preferredCaste,
    preferredEducation,
    preferredIncome,
    preferredOccupation,
    preferredReligion,
    otherPreferences,
  } = preferences;

  return (
    <div className="max-w-full mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold  text-gray-800 dark:text-white">Partner Preferences</h2>

      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
        <FaBirthdayCake className="text-pink-500" />
        <span className="font-medium">Age:</span>
        <span>{preferredAgeRange.min} - {preferredAgeRange.max} yrs</span>
      </div>

      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
        <FaRulerVertical className="text-blue-500" />
        <span className="font-medium">Height:</span>
        <span>{ConvertCmToFeetInches(preferredHeight.min)} - {ConvertCmToFeetInches(preferredHeight.max)}</span>
      </div>

      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
        <MdOutlineDiversity2 className="text-green-500" />
        <span className="font-medium">Caste:</span>
        <span>{preferredCaste}</span>
      </div>

      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
        <GiGraduateCap className="text-indigo-500" />
        <span className="font-medium">Education:</span>
        <span>{preferredEducation}</span>
      </div>

      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
        <FaMoneyBillWave className="text-yellow-500" />
        <span className="font-medium">Income:</span>
        <span>PKR {preferredIncome.min.toLocaleString()} - {preferredIncome.max.toLocaleString()}</span>
      </div>

      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
        <FaBriefcase className="text-purple-500" />
        <span className="font-medium">Occupation:</span>
        <span>{preferredOccupation}</span>
      </div>

      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
        <FaPrayingHands className="text-red-500" />
        <span className="font-medium">Religion:</span>
        <span>{preferredReligion}</span>
      </div>

      {otherPreferences && otherPreferences !== "na" && (
        <div className="pt-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Other Preferences:</span> {otherPreferences}
        </div>
      )}
    </div>
  );
};

export default PreferenceCard;
