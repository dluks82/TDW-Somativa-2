import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <section className="page-card">
      <h2>Bem-vindo de volta</h2>
      <p>Esta é a tela de login inicial da atividade.</p>
      <div className="page-actions">
        <Link className="link-button" to="/dashboard">
          Entrar (mock)
        </Link>
        <p className="page-helper">
          Ainda não possui uma conta? <Link to="/register">Criar conta</Link>
        </p>
      </div>
    </section>
  );
}
