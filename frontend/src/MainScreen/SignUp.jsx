import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";

import logo from "../assets/book_app_logo.png";
import api from "../services/api";

// ======================================================
// CITIES
// ======================================================

const CITIES = [
  { value: "Amritsar", label: "Amritsar" },
  { value: "Barnala", label: "Barnala" },
  { value: "Bathinda", label: "Bathinda" },
  { value: "Faridkot", label: "Faridkot" },
  { value: "Fatehgarh Sahib", label: "Fatehgarh Sahib" },
  { value: "Fazilka", label: "Fazilka" },
  { value: "Ferozepur", label: "Ferozepur" },
  { value: "Gurdaspur", label: "Gurdaspur" },
  { value: "Hoshiarpur", label: "Hoshiarpur" },
  { value: "Jalandhar", label: "Jalandhar" },
  { value: "Kapurthala", label: "Kapurthala" },
  { value: "Ludhiana", label: "Ludhiana" },
  { value: "Mansa", label: "Mansa" },
  { value: "Moga", label: "Moga" },
  { value: "Muktsar", label: "Muktsar" },
  { value: "Nawanshahr", label: "Nawanshahr" },
  { value: "Pathankot", label: "Pathankot" },
  { value: "Patiala", label: "Patiala" },
  { value: "Rupnagar", label: "Rupnagar" },
  { value: "Sangrur", label: "Sangrur" },
  { value: "SAS Nagar", label: "SAS Nagar" },
  { value: "Tarn Taran", label: "Tarn Taran" },
];

// ======================================================
// VALIDATION REGEX
// ======================================================

const NAME_REGEX = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

const PHONE_REGEX = /^[0-9]{10}$/;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// ======================================================
// SIGN UP COMPONENT
// ======================================================

export default function SignUp() {
  const navigate = useNavigate();

  // ====================================================
  // FORM STATE
  // ====================================================

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
  });

  // ====================================================
  // ERROR / UI STATE
  // ====================================================

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // ====================================================
  // VALIDATE FIELD
  // ====================================================

  const validateField = (
    name,
    value,
    allValues = form
  ) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) {
          return "Full name is required.";
        }

        if (value.trim().length < 2) {
          return "Full name is too short.";
        }

        if (!NAME_REGEX.test(value.trim())) {
          return "Only letters, spaces, hyphens and apostrophes allowed.";
        }

        return "";

      case "phone":
        if (!value.trim()) {
          return "Phone number is required.";
        }

        if (!PHONE_REGEX.test(value.trim())) {
          return "Enter exactly 10 digits.";
        }

        return "";

      case "email":
        if (!value.trim()) {
          return "Email is required.";
        }

        if (!EMAIL_REGEX.test(value.trim())) {
          return "Enter a valid email address.";
        }

        return "";

      case "password":
        if (!value) {
          return "Password is required.";
        }

        if (!PASSWORD_REGEX.test(value)) {
          return "Min 8 characters with uppercase, lowercase and number.";
        }

        return "";

      case "confirmPassword":
        if (!value) {
          return "Please confirm your password.";
        }

        if (value !== allValues.password) {
          return "Passwords do not match.";
        }

        return "";

      case "city":
        if (!value) {
          return "Please select a city.";
        }

        return "";

      default:
        return "";
    }
  };

  // ====================================================
  // HANDLE INPUT CHANGE
  // ====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone number:
    // Only numbers + maximum 10 digits
    const nextValue =
      name === "phone"
        ? value.replace(/\D/g, "").slice(0, 10)
        : value;

    const nextForm = {
      ...form,
      [name]: nextValue,
    };

    setForm(nextForm);

    // Clear previous submit error
    if (submitError) {
      setSubmitError("");
    }

    if (successMessage) {
      setSuccessMessage("");
    }

    // Validate touched field
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(
          name,
          nextValue,
          nextForm
        ),

        // If password changes, validate confirm password again
        ...(name === "password" &&
        touched.confirmPassword
          ? {
              confirmPassword: validateField(
                "confirmPassword",
                nextForm.confirmPassword,
                nextForm
              ),
            }
          : {}),
      }));
    }
  };

  // ====================================================
  // HANDLE BLUR
  // ====================================================

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(
        name,
        value,
        form
      ),
    }));
  };

  // ====================================================
  // VALIDATE COMPLETE FORM
  // ====================================================

  const validateAll = () => {
    const newErrors = {};

    Object.keys(form).forEach((key) => {
      newErrors[key] = validateField(
        key,
        form[key],
        form
      );
    });

    setErrors(newErrors);

    setTouched({
      fullName: true,
      phone: true,
      email: true,
      password: true,
      confirmPassword: true,
      city: true,
    });

    return Object.values(newErrors).every(
      (message) => !message
    );
  };

  // ====================================================
  // HANDLE SIGN UP
  // ====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitError("");
    setSuccessMessage("");

    // -----------------------------------------------
    // Frontend validation
    // -----------------------------------------------

    if (!validateAll()) {
      return;
    }

    try {
      setSubmitting(true);

      console.log("=================================");
      console.log("Sending signup request...");
      console.log("=================================");

      console.log({
        name: form.fullName,
        phone: form.phone,
        email: form.email,
        city: form.city,
      });

      // ---------------------------------------------
      // SEND REQUEST TO BACKEND
      // ---------------------------------------------

      const response = await api.post("/auth/signup", {
        name: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        city: form.city,
      });

      const data = response.data;

      console.log(
        "Backend response status:",
        response.status
      );

      console.log(
        "Backend response:",
        data
      );

      if (!response.status || response.status >= 400) {
        throw new Error(
          data.message ||
            "Signup failed"
        );
      }

      // ---------------------------------------------
      // SUCCESS
      // ---------------------------------------------

      console.log(
        "Signup successful!"
      );

      setSuccessMessage(
        "Account created successfully!"
      );

      // ---------------------------------------------
      // Clear form
      // ---------------------------------------------

      setForm({
        fullName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        city: "",
      });

      setErrors({});
      setTouched({});

      // ---------------------------------------------
      // Redirect to login after short delay
      // ---------------------------------------------

      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (error) {
      console.error(
        "Signup request error:",
        error
      );

      // ---------------------------------------------
      // Network / Fetch error
      // ---------------------------------------------

      if (
        error instanceof TypeError
      ) {
        setSubmitError(
          "Unable to connect to the backend. Check the API configuration and make sure the server is running."
        );
      } else {
        setSubmitError(
          error.message ||
            "Something went wrong. Please try again."
        );
      }

    } finally {
      setSubmitting(false);
    }
  };

  // ====================================================
  // FIELD CSS
  // ====================================================

  const fieldClass = (name) =>
    `block w-full pl-11 pr-4 py-3 text-sm bg-white border rounded-xl placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all ${
      touched[name] && errors[name]
        ? "border-red-400 focus:border-red-400"
        : "border-slate-200 focus:border-sky-400"
    }`;

  // ====================================================
  // UI
  // ====================================================

  return (
    <div
      className="min-h-screen flex items-center justify-center p-3 sm:p-5 text-slate-800 antialiased selection:bg-sky-500 selection:text-white"
      style={{
        background:
          "radial-gradient(circle at 50% 20%, rgb(30, 58, 138) 0%, rgb(10, 17, 40) 55%, rgb(7, 13, 30) 100%)",

        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <main
        className="w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row-reverse my-auto"
        style={{
          maxWidth: 980,
          minHeight: 560,

          boxShadow:
            "rgba(10, 25, 47, 0.4) 0px 25px 50px -12px, rgba(186, 230, 253, 0.25) 0px 0px 0px 1px",
        }}
      >

        {/* ==================================================
            SIGN UP FORM
        ================================================== */}

        <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center">

          <form
            className="space-y-4"
            onSubmit={handleSubmit}
            noValidate
          >

            {/* ERROR MESSAGE */}

            {submitError && (
              <div className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-3">
                {submitError}
              </div>
            )}

            {/* SUCCESS MESSAGE */}

            {successMessage && (
              <div className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-3">
                {successMessage}
              </div>
            )}

            {/* LOGO */}

            <div className="mb-6 flex items-center">
              <img
                src={logo}
                alt="BookApp"
                className="h-16 w-auto"
              />
            </div>

            {/* ==================================================
                FULL NAME
            ================================================== */}

            <div>
              <div className="relative rounded-xl">

                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>

                <input
                  className={fieldClass(
                    "fullName"
                  )}
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="name"
                />

              </div>

              {touched.fullName &&
                errors.fullName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.fullName}
                  </p>
                )}
            </div>

            {/* ==================================================
                PHONE
            ================================================== */}

            <div>
              <div className="relative rounded-xl">

                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>

                <input
                  className={fieldClass(
                    "phone"
                  )}
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="tel"
                />

              </div>

              {touched.phone &&
                errors.phone && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.phone}
                  </p>
                )}
            </div>

            {/* ==================================================
                EMAIL
            ================================================== */}

            <div>
              <div className="relative rounded-xl">

                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>

                <input
                  className={fieldClass(
                    "email"
                  )}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                />

              </div>

              {touched.email &&
                errors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.email}
                  </p>
                )}
            </div>

            {/* ==================================================
                PASSWORD
            ================================================== */}

            <div>
              <div className="relative rounded-xl">

                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>

                <input
                  className={`${fieldClass(
                    "password"
                  )} pr-10`}
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                />

                <button
                  aria-label="Toggle password visibility"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>

              </div>

              {touched.password &&
                errors.password && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.password}
                  </p>
                )}
            </div>

            {/* ==================================================
                CONFIRM PASSWORD
            ================================================== */}

            <div>
              <div className="relative rounded-xl">

                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>

                <input
                  className={`${fieldClass(
                    "confirmPassword"
                  )} pr-10`}
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm Password"
                  value={
                    form.confirmPassword
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                />

                <button
                  aria-label="Toggle confirm password visibility"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (value) => !value
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>

              </div>

              {touched.confirmPassword &&
                errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
            </div>

            {/* ==================================================
                CITY
            ================================================== */}

            <div>
              <div className="relative rounded-xl">

                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
                  <MapPin className="h-4 w-4" />
                </div>

                <select
                  className={`${fieldClass(
                    "city"
                  )} appearance-none cursor-pointer ${
                    form.city
                      ? ""
                      : "text-slate-400"
                  }`}
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option
                    value=""
                    disabled
                    hidden
                  >
                    Select City
                  </option>

                  {CITIES.map((city) => (
                    <option
                      key={city.value}
                      value={city.value}
                      className="text-slate-700"
                    >
                      {city.label}
                    </option>
                  ))}
                </select>

                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown className="h-4 w-4" />
                </div>

              </div>

              {touched.city &&
                errors.city && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.city}
                  </p>
                )}
            </div>

            {/* ==================================================
                SIGN UP BUTTON
            ================================================== */}

            <div className="pt-2">

              <button
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl shadow-md text-white font-semibold text-sm transition duration-150 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(10, 25, 47) 0%, rgb(15, 40, 78) 60%, rgb(37, 65, 152) 100%)",

                  boxShadow:
                    "rgba(37, 65, 152, 0.35) 0px 4px 14px -1px",
                }}
                type="submit"
                disabled={submitting}
              >
                <span>
                  {submitting
                    ? "Signing Up..."
                    : "Sign Up"}
                </span>

                {!submitting && (
                  <span className="text-base leading-none">
                    →
                  </span>
                )}
              </button>

            </div>

          </form>
        </div>

        {/* ==================================================
            WELCOME PANEL
        ================================================== */}

        <section
          className="flex-1 px-8 py-10 sm:px-12 text-white flex flex-col items-start justify-center"
          style={{
            background:
              "linear-gradient(160deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)",
          }}
        >

          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Welcome Back!
          </h3>

          <p
            className="text-sm max-w-xs mb-6"
            style={{
              color:
                "rgba(224, 242, 254, 0.9)",
            }}
          >
            Already have an account?
            Sign in to continue.
          </p>

          <Link
            className="inline-flex items-center justify-center px-8 py-2.5 text-sm font-semibold text-white rounded-full hover:bg-white hover:text-slate-900 active:scale-95 transition-all duration-150 shadow-sm"
            style={{
              border:
                "1.5px solid rgba(255, 255, 255, 0.85)",

              background:
                "rgba(255, 255, 255, 0.08)",

              backdropFilter:
                "blur(4px)",
            }}
            to="/"
          >
            Sign In
          </Link>

        </section>

      </main>
    </div>
  );
}