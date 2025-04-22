import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Login } from "../redux/slice/authSlice";
import { FaSpinner } from "react-icons/fa6";

const VerifyPage = ({ onVerified }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleVerify = async () => {
    if (loading) return;

    setLoading(true);
    setError("");
    setIsChecked(true);

    try {
      const credentials = { username: "apiuser", password: "feUser@sp2!" };
      await dispatch(Login(credentials)).unwrap();
      navigate("/home");
      onVerified?.();
    } catch (err) {
      console.error("Verification error:", err);
      setError(err?.message || "Verification failed");
      setIsChecked(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="bg-white w-full max-w-5xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              bestellen-primapizza.de
            </h1>
          </div>

          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            We need to verify you're human to protect our website. Please
            complete the security check below.
          </p>

          <div className="mb-6">
            <div
              onClick={handleVerify}
              className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer max-w-sm ${
                isChecked
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center w-5 h-5 mr-3">
                  {/* <BeatLoader color="#3B82F6" size={8} /> */}
                  <FaSpinner className="animate-spin text-[#3B82F6]" />
                </div>
              ) : (
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                    isChecked
                      ? "bg-blue-500 border-blue-500"
                      : "bg-white border-gray-400"
                  }`}
                >
                  {isChecked && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              )}
              <span className="text-gray-700 font-medium">
                {loading ? "Verifying..." : "I'm not a robot"}
              </span>
              <div className="ml-auto flex items-center">
                <img
                  src="https://www.cloudflare.com/img/logo-cloudflare-dark.svg"
                  alt="Cloudflare"
                  className="h-6 opacity-70"
                />
              </div>
            </div>

            {error && (
              <div className="mt-3 text-red-500 bg-red-50 px-4 py-2 rounded-lg">
                {error}
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">
              Why am I seeing this?
            </h3>
            <p className="text-sm text-gray-500">
              bestellen-primapizza.de uses security services to protect itself
              from online attacks. This process is automatic and helps ensure
              only real humans can access our site.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
