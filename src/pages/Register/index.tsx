import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { registerUser } from "../../services/firebase/auth";

type RegisterField = "email" | "password" | "firstName" | "lastName" | "birthDate";

type RegisterFormState = Record<RegisterField, string>;

const initialFormState: RegisterFormState = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  birthDate: "",
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<RegisterFormState>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<RegisterField, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: RegisterField) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormValues((currentValues) => ({ ...currentValues, [field]: event.target.value }));
    setFieldErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    setSubmitError(null);
  };

  const validateForm = () => {
    const validationErrors: Partial<Record<RegisterField, string>> = {};
    const trimmedEmail = formValues.email.trim();
    const trimmedFirstName = formValues.firstName.trim();
    const trimmedLastName = formValues.lastName.trim();

    if (!trimmedFirstName) {
      validationErrors.firstName = "Informe o nome";
    }

    if (!trimmedLastName) {
      validationErrors.lastName = "Informe o sobrenome";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // simplicidade suficiente para validação básica
    if (!trimmedEmail) {
      validationErrors.email = "Informe um e-mail";
    } else if (!emailPattern.test(trimmedEmail)) {
      validationErrors.email = "E-mail inválido";
    }

    if (!formValues.password) {
      validationErrors.password = "Informe uma senha";
    } else if (formValues.password.length < 6) {
      validationErrors.password = "A senha deve conter ao menos 6 caracteres";
    }

    if (!formValues.birthDate) {
      validationErrors.birthDate = "Informe a data de nascimento";
    } else {
      const date = new Date(formValues.birthDate);
      const now = new Date();
      if (Number.isNaN(date.getTime())) {
        validationErrors.birthDate = "Data inválida";
      } else if (date > now) {
        validationErrors.birthDate = "A data não pode ser futura";
      }
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

    const payload = {
      email: formValues.email.trim(),
      password: formValues.password,
      firstName: formValues.firstName.trim(),
      lastName: formValues.lastName.trim(),
      birthDate: formValues.birthDate,
    };

    try {
      await registerUser(payload);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setSubmitError(resolveFirebaseError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-card page-card--auth">
      <h2>Crie sua conta</h2>
      <p>
        Preencha os campos abaixo para criar sua conta. Seus dados serão registrados
        com segurança no Firebase Authentication e Firestore.
      </p>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="firstName">Nome</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Ex.: Maria"
              value={formValues.firstName}
              onChange={handleInputChange("firstName")}
              className={fieldErrors.firstName ? "error" : undefined}
            />
            {fieldErrors.firstName ? <span className="field-error">{fieldErrors.firstName}</span> : null}
          </div>

          <div className="form-field">
            <label htmlFor="lastName">Sobrenome</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Ex.: Silva"
              value={formValues.lastName}
              onChange={handleInputChange("lastName")}
              className={fieldErrors.lastName ? "error" : undefined}
            />
            {fieldErrors.lastName ? <span className="field-error">{fieldErrors.lastName}</span> : null}
          </div>

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
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              value={formValues.password}
              onChange={handleInputChange("password")}
              className={fieldErrors.password ? "error" : undefined}
            />
            {fieldErrors.password ? <span className="field-error">{fieldErrors.password}</span> : null}
          </div>

          <div className="form-field">
            <label htmlFor="birthDate">Data de nascimento</label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              autoComplete="bday"
              value={formValues.birthDate}
              onChange={handleInputChange("birthDate")}
              className={fieldErrors.birthDate ? "error" : undefined}
            />
            {fieldErrors.birthDate ? <span className="field-error">{fieldErrors.birthDate}</span> : null}
          </div>
        </div>

        {submitError ? (
          <div className="form-feedback" role="alert">
            {submitError}
          </div>
        ) : null}

        <div className="form-actions">
          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Cadastrando..." : "Criar conta"}
          </button>

          <p className="page-helper">
            Já tem acesso? <Link to="/login">Ir para o Login</Link>
          </p>
        </div>
      </form>
    </section>
  );
}

function resolveFirebaseError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Este e-mail já está cadastrado.";
      case "auth/invalid-email":
        return "Informe um e-mail válido.";
      case "auth/weak-password":
        return "A senha informada é demasiadamente fraca.";
      default:
        return "Não foi possível concluir o cadastro. Tente novamente.";
    }
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}
