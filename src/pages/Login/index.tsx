import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { loginUser } from "../../services/firebase/auth";

type LoginField = "email" | "password";

type LoginFormState = Record<LoginField, string>;

const initialFormState: LoginFormState = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<LoginFormState>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<LoginField, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: LoginField) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormValues((currentValues) => ({ ...currentValues, [field]: event.target.value }));
    setFieldErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    setSubmitError(null);
  };

  const validateForm = () => {
    const validationErrors: Partial<Record<LoginField, string>> = {};
    const trimmedEmail = formValues.email.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      validationErrors.email = "Informe o e-mail cadastrado";
    } else if (!emailPattern.test(trimmedEmail)) {
      validationErrors.email = "E-mail inválido";
    }

    if (!formValues.password) {
      validationErrors.password = "Informe a senha";
    }

    setFieldErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await loginUser({
        email: formValues.email.trim(),
        password: formValues.password,
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setSubmitError(resolveLoginError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-card page-card--auth">
      <h2>Bem-vindo de volta</h2>
      <p>Entre com suas credenciais registradas para acessar a página principal.</p>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nome@exemplo.com"
              value={formValues.email}
              onChange={handleInputChange("email")}
              className={fieldErrors.email ? "error" : undefined}
            />
            {fieldErrors.email ? <span className="field-error">{fieldErrors.email}</span> : null}
          </div>

          <div className="form-field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formValues.password}
              onChange={handleInputChange("password")}
              className={fieldErrors.password ? "error" : undefined}
            />
            {fieldErrors.password ? <span className="field-error">{fieldErrors.password}</span> : null}
          </div>
        </div>

        {submitError ? (
          <div className="form-feedback" role="alert">
            {submitError}
          </div>
        ) : null}

        <div className="form-actions">
          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
          <p className="page-helper">
            Ainda não possui conta? <Link to="/register">Criar agora</Link>
          </p>
        </div>
      </form>
    </section>
  );
}

function resolveLoginError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/user-not-found":
      case "auth/invalid-credential":
      case "auth/wrong-password":
        return "Usuário não está cadastrado ou a senha está incorreta.";
      case "auth/too-many-requests":
        return "Muitas tentativas com falha. Aguarde alguns instantes e tente novamente.";
      default:
        return "Não foi possível fazer login. Tente novamente.";
    }
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}
