import { Navigate } from 'react-router-dom';

// A recuperação de senha via CPF é feita em /forgot-password
// Esta rota redireciona para manter compatibilidade com links existentes
export function ResetPassword() {
  return <Navigate to="/forgot-password" replace />;
}
