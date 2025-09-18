import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../../services/firebase";
import { useUserProfile } from "../../hooks/useUserProfile";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const currentUid = firebaseAuth.currentUser?.uid ?? null;
  const { profile, loading, error } = useUserProfile({ uid: currentUid });

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await firebaseAuth.signOut();
      navigate("/login", { replace: true });
    } finally {
      setIsSigningOut(false);
    }
  };

  const formattedBirthDate = profile ? formatBirthDate(profile.birthDate) : null;

  return (
    <section className="page-card page-card--dashboard">
      <h2>{profile ? `Olá, ${profile.firstName}!` : "Bem-vindo ao painel"}</h2>

      {currentUid == null ? (
        <p>Não foi possível identificar o usuário autenticado. Faça login novamente.</p>
      ) : loading ? (
        <p>Carregando dados do usuário...</p>
      ) : error ? (
        <p className="form-feedback" role="alert">
          {error}
        </p>
      ) : profile ? (
        <div className="dashboard-summary">
          <p>
            <strong>Nome:</strong> {profile.firstName}
          </p>
          <p>
            <strong>Sobrenome:</strong> {profile.lastName}
          </p>
          <p>
            <strong>Data de nascimento:</strong> {formattedBirthDate ?? profile.birthDate}
          </p>
          <p>
            <strong>E-mail:</strong> {profile.email}
          </p>
        </div>
      ) : (
        <p>Usuário autenticado, mas nenhum dado foi encontrado no Firestore.</p>
      )}

      <div className="dashboard-actions">
        <button
          className="button button--secondary"
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? "Saindo..." : "Sair"}
        </button>
      </div>
    </section>
  );
}

function formatBirthDate(birthDate: string) {
  try {
    const date = new Date(birthDate);
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(date);
  } catch (error) {
    return birthDate;
  }
}
