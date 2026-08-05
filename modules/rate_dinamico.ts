// Importa os tipos necessários do runtime do Zuplo.
// Eles fornecem acesso à requisição, ao contexto de execução
// e ao objeto que será retornado para a política de Rate Limiting.
import {
  CustomRateLimitDetails,
  ZuploContext,
  ZuploRequest,
} from "@zuplo/runtime";

// Função chamada pela política de Rate Limiting.
// Ela será executada a cada requisição para determinar
// dinamicamente qual limite deverá ser aplicado ao consumidor.
export function dynamicRateLimit(
  request: ZuploRequest,
  context: ZuploContext,
  policyName: string,
): CustomRateLimitDetails {

  // Verifica se existe um consumidor autenticado.
  // O objeto request.user é criado pela política de API Key Authentication.
  // Caso a autenticação ainda não tenha ocorrido, interrompemos a execução.
  if (!request.user) {
    throw new Error("Consumidor não autenticado.");
  }

  // Lê dos metadados do consumidor a quantidade máxima de
  // requisições permitidas na janela configurada.
  //
  // Caso o campo não exista, será utilizado o valor padrão 2.
  const requestsAllowed = Number(
    request.user.data?.requestsAllowed ?? 2,
  );

  // Lê dos metadados o tamanho da janela de Rate Limiting.
  //
  // Neste exemplo, caso o valor não esteja definido,
  // será utilizada uma janela padrão de 1 minuto.
  const timeWindowMinutes = Number(
    request.user.data?.timeWindowMinutes ?? 1,
  );

  // Retorna as informações que serão utilizadas pela política.
  return {

    // Define a chave do contador.
    // Como utilizamos o identificador do consumidor (sub),
    // cada API Key possuirá seu próprio contador independente.
    key: request.user.sub,

    // Quantidade máxima de requisições permitidas.
    requestsAllowed,

    // Tamanho da janela de tempo em minutos.
    timeWindowMinutes,
  };
}