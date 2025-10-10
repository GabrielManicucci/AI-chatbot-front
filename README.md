# AI Chatbot UI - Interface do Atendente Virtual

#### Interface de usuário para a api do assistente virtual para pizzarias

## Principais Funcionalidades da Interface

- Interface de chat limpa e moderna, inspirada em assistentes de IA como o Gemini.

- Persistência de conversa: o histórico do chat é mantido mesmo que o usuário recarregue a página.

- Atualização otimista para uma experiência de usuário fluida e responsiva.

- Layout totalmente responsivo, adaptando-se a desktops e dispositivos móveis.

- Renderização de respostas da IA formatadas em Markdown (listas, negrito, etc.).

</br>

## Tecnologias Utilizadas

- Next.js: Framework React para produção, com renderização no servidor e otimizações automáticas.
- React: Biblioteca para a construção de interfaces de usuário reativas.
- TypeScript: Superset do JavaScript que adiciona tipagem estática para um código mais robusto.
- Tailwind CSS: Framework CSS utility-first para estilização rápida e moderna.
- shadcn/ui: Coleção de componentes de UI reutilizáveis, acessíveis e customizáveis.
- Lucide React: Biblioteca de ícones SVG limpos e consistentes.
- React Markdown: Componente para renderizar o conteúdo das mensagens que vêm da IA, suportando formatação Markdown.
- Zod: Validação de esquemas para garantir a integridade dos dados recebidos da API.

</br>

## Pré-requisitos

- Antes de executar a aplicação, garanta que você tenha:
- Node.js (versão 18 ou superior).
- pnpm (ou npm/yarn) como gerenciador de pacotes.
- A API do chatbot (AI-chatbot-api) deve estar em execução, seja localmente ou em produção.

</br>

## Como Executar a Aplicação Localmente

#### Siga os passos abaixo para rodar o projeto em seu ambiente de desenvolvimento.

**Clone o repositório:**
git clone [https://github.com/seu-usuario/ai-chatbot-ui.git](https://github.com/seu-usuario/ai-chatbot-ui.git)
cd ai-chatbot-ui

**Instale as dependências:**
pnpm install

**Configure as Variáveis de Ambiente:**
Crie um arquivo chamado .env.local na raiz do projeto.

**Adicione a seguinte variável, apontando para a URL da sua API:**
NEXT_PUBLIC_BASE_API_URL=http://localhost:3333

Substitua http://localhost:3333 pela URL da sua API em produção (https://ai-chatbot-api-production.up.railway.app) se desejar testar com o back-end já em deploy.

**Inicie o servidor de desenvolvimento:**
pnpm run dev

**Acesse a aplicação:**
Abra seu navegador e acesse http://localhost:3000.

</br>

## Lógica da Aplicação Front-End

Gerenciamento de Conversa: Ao iniciar, a aplicação verifica o localStorage do navegador por um conversationId.

Se um ID existe, a rota GET /conversation/:id é chamada para recuperar o histórico do chat.

Se não existe, a rota POST /conversation é chamada para criar uma nova sessão, e o ID retornado é salvo no localStorage para persistência.

Envio de Mensagens: Cada nova pergunta do usuário é enviada para a rota POST /message/:id, que processa a pergunta e retorna a resposta da IA.

Atualização Otimista: A mensagem do usuário é exibida na tela instantaneamente, antes mesmo de a API responder, proporcionando uma sensação de agilidade.

</br>

## Deploy da Aplicação

Esta aplicação Next.js está pronta para ser implantada em plataformas de hospedagem como Vercel ou Netlify com configuração zero.

Basta conectar seu repositório Git à plataforma e configurar a variável de ambiente NEXT_PUBLIC_BASE_API_URL para apontar para a URL de produção da sua API (https://ai-chatbot-api-production.up.railway.app).
