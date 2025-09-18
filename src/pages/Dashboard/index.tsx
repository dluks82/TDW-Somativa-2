import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <section className="page-card">
      <h2>Dashboard</h2>
      <p>Área principal aguardando integração com Firestore.</p>
      <div className="page-actions">
        <Link className="link-button secondary" to="/login">
          Sair (mock)
        </Link>
      </div>
    </section>
  );
}
