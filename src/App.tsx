import "./App.css";
import AppRoutes from "./routes";

export default function App() {
  return (
    <div className="app-shell">
      <main className="app-main">
        <AppRoutes />
      </main>
    </div>
  );
}
