import { useAuth } from "./features/auth/useAuth";

function App() {
  const { user, loading, error } = useAuth();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;

  return (
    <div>
      <h1>Bienvenue 👋</h1>
      <p>Utilisateur connecté : {user?.uid}</p>
    </div>
  );
}

export default App;
