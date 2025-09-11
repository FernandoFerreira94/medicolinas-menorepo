export interface UsuarioProps {
  token?: string;
  nome_completo: string;
  cpf: string;
  matricula: string;
  is_adm: boolean;
  permissao_energia: boolean;
  permissao_agua: boolean;
  permissao_gas: boolean;
  funcao: string;
}

export interface LoginProps {
  matricula: string;
  password: string;
}

export interface UserProps {
  token: string;
  user: UsuarioProps;
}

export interface InputDateProps {
  month: number;
  setMonth: (month: number) => void;
  year: number;
  setYear: (year: number) => void;
}
