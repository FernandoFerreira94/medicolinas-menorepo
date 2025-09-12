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

export interface LojaProps {
  nome_loja: string;
  numero_loja: string;
  complexo: string;
  ativa: boolean;
  tem_energia: boolean;
  tem_agua: boolean;
  tem_gas: boolean;
}

export interface MEdidorDadosForm {
  tipo_medicao: string;
  numero_relogio: string;
  localidade: string;
  ultima_leitura: number;
  detalhes: string;
}

export interface MedidorProps extends MEdidorDadosForm {
  loja_id: string;
}

export interface CreateLojaData {
  loja: LojaProps;
  medidores: MEdidorDadosForm[];
}
