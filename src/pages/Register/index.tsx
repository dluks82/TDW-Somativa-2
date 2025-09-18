import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <section className="page-card">
      <h2>Crie sua conta</h2>
      <p>Página de cadastro inicial aguardando integração com Firebase.</p>
      <div className="page-actions">
        <Link className="link-button" to="/dashboard">
          Finalizar cadastro (mock)
        </Link>
        <p className="page-helper">
          Já tem acesso?<span> </span>
          <Link to="/login">Ir para o Login</Link>
        </p>
      </div>
    </section>
  );
}
