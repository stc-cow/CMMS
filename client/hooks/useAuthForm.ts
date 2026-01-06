import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp } from "@/lib/auth";

interface AuthFormState {
  email: string;
  password: string;
  confirmPassword?: string;
  fullName?: string;
}

interface UseAuthFormReturn {
  formData: AuthFormState;
  setFormData: (data: Partial<AuthFormState>) => void;
  isLoading: boolean;
  error: string | null;
  handleSignIn: () => Promise<void>;
  handleSignUp: () => Promise<void>;
  clearError: () => void;
}

export function useAuthForm(): UseAuthFormReturn {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AuthFormState>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleSignIn = async () => {
    clearError();

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      const { error: signInError } = await signIn(
        formData.email,
        formData.password
      );

      if (signInError) {
        setError(signInError.message || "Failed to sign in");
        return;
      }

      // Sign in successful
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    clearError();

    if (!formData.email || !formData.password) {
      setError("Please enter email and password");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const { error: signUpError, data } = await signUp(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (signUpError) {
        setError(signUpError.message || "Failed to create account");
        return;
      }

      // Check if email confirmation is required
      if (data?.user && !data.user.confirmed_at) {
        setError(
          "Account created! Please check your email to confirm your account."
        );
        // Still navigate after 3 seconds to show the message
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        // Auto-login if email confirmation is not required
        navigate("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData: (data) => setFormData((prev) => ({ ...prev, ...data })),
    isLoading,
    error,
    handleSignIn,
    handleSignUp,
    clearError,
  };
}
