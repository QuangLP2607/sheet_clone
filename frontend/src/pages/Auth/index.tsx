import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import authApi from "@/services/auth";

import styles from "./Auth.module.scss";

type AuthMode = "login" | "register";

interface AuthForm {
  email: string;
  password: string;
  name: string;
}

const INITIAL_FORM: AuthForm = {
  email: "",
  password: "",
  name: "",
};

const Auth = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState<AuthForm>(INITIAL_FORM);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLogin = mode === "login";

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const result = await authApi.signIn({
          email: form.email,
          password: form.password,
        });

        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);
        localStorage.setItem("user", JSON.stringify(result.user));

        navigate("/");
        return;
      }

      await authApi.signUp({
        email: form.email,
        password: form.password,
        name: form.name.trim() || undefined,
      });

      setMode("login");
      setForm(INITIAL_FORM);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
    setForm(INITIAL_FORM);
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <h1>SheetClone</h1>

          <p>
            {isLogin ? "Sign in to continue" : "Create your SheetClone account"}
          </p>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={isLogin ? styles.activeTab : ""}
            onClick={() => handleModeChange("login")}
          >
            Sign in
          </button>

          <button
            type="button"
            className={!isLogin ? styles.activeTab : ""}
            onClick={() => handleModeChange("register")}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.field}>
              <label htmlFor="name">Name</label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading
              ? "Please wait..."
              : isLogin
                ? "Sign in"
                : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Auth;
