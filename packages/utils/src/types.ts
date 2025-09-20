// Tipos de Dados Básicos
export interface UsuarioProps {
  user_id?: string;
  token?: string;
  nome_completo: string;
  cpf: string;
  matricula: string;
  is_adm: boolean;
  permissao_energia: boolean;
  permissao_agua: boolean;
  permissao_gas: boolean;
  funcao: string;
  created_at?: string;
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

// Tipos Relacionados a Lojas e Medidores
export interface LojaProps {
  nome_loja: string;
  numero_loja: number;
  prefixo_loja: string;
  complexo: string;
  ativa: boolean;
  tem_energia: boolean;
  tem_agua: boolean;
  tem_gas: boolean;
}

export interface MedidorDadosForm {
  tipo_medicao: string;
  numero_relogio: string;
  localidade: string;
  ultima_leitura: number;
  detalhes: string | null;
}

export interface MedidorProps extends MedidorDadosForm {
  loja_id: string;
}

export interface CreateLojaData {
  loja: LojaProps;
  medidores: MedidorDadosForm[];
}

export interface LeituraProps {
  leitura_atual: number;
  consumo_mensal: number;
  mes: number;
  ano: number;

  created_at: string;
}

export interface Medidor {
  id: string;
  tipo_medicao: string;
  localidade: string;
  numero_relogio: string;
  ultima_leitura: number;
  detalhes: string | null;
  data_instalacao: string;
  leituras: LeituraProps[];
}

// Tipos para dados de leitura
export interface CreateLeituraProps {
  medidor_id: string;
  mes: number;
  ano: number;
  leitura_anterior: number;
  leitura_atual: number;
  foto_url: string | null;
  nome_usuario: string;
  detalhes_leitura: string | null;
}

export interface MedidorComLeitura {
  id: string;
  tipo_medicao: string;
  localidade: string;
  numero_relogio: string;
  ultima_leitura: number;
  detalhes: string;
  data_instalacao: string;
  leituras: LeituraProps[]; // Adicione a leitura aqui, como um array
}

export interface LojaComMedidores {
  id: string;
  prefixo_loja: string;
  complexo: string;
  nome_loja: string;
  numero_loja: number;
  ativa: boolean;
  tem_energia: boolean;
  tem_agua: boolean;
  tem_gas: boolean;
  medidores: Medidor[] | MedidorComLeitura[]; // Tipagem ajustada para flexibilidade
}

export interface DetalhesProps {
  params: Promise<{
    id: string;
    medidorId: string;
  }>;
}

export interface ChartDataItem {
  consumo: number;
  detalhes: string;
  month: string;
}

export interface TooltipPayload {
  active?: boolean;
  label?: string;
  payload?: {
    payload: ChartDataItem;
    value: number;
  }[];
}

export interface EditLeitura {
  leitura_atual?: number | null;
  detalhes_leitura?: string | null;
}

export interface EditMedidor {
  localidade: string;
  numero_relogio: string;
  quadro_distribuicao?: string | null;
  ultima_leitura?: number;
}

export interface EditLoja {
  nome_loja: string;
  numero_loja: number;
  prefixo_loja: string;
}
