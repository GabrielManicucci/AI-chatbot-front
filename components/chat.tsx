"use client";

import { Bot, Loader2Icon, Send, User } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// --- NOVOS ENDPOINTS DA API ---
const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

type Message = {
  id: string;
  role: "user" | "assistant" | "model";
  content: string;
};

export function Chat() {
  // --- Estados Manuais ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);

  // 1. CRIAR UMA REFERÊNCIA PARA UM ELEMENTO "ÂNCORA" NO FINAL DA LISTA
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Lógica de Inicialização ---
  // Roda uma única vez para verificar se já existe uma conversa ou se precisa criar uma nova.
  useEffect(() => {
    const storedId = localStorage.getItem("conversationId");

    const initializeConversation = async () => {
      setIsLoading(true);
      try {
        if (storedId) {
          // Se encontrou um ID, busca o histórico
          const response = await fetch(
            `${BASE_API_URL}/conversation/${storedId}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data?.conversation?.messages) {
              const history = data.conversation.messages.map(
                (msg: Message) => ({
                  id: msg.id,
                  role: msg.role === "model" ? "assistant" : "user",
                  content: msg.content,
                })
              );
              setMessages(history);
              setConversationId(storedId);
            }
          } else {
            // Se o ID for inválido (ex: banco foi limpo), cria uma nova conversa
            localStorage.removeItem("conversationId");
            const newConvResponse = await fetch(
              `${BASE_API_URL}/conversation`,
              { method: "POST" }
            );
            const newConvData = await newConvResponse.json();
            localStorage.setItem("conversationId", newConvData.id);
            setConversationId(newConvData.id);
          }
        } else {
          // Se não há ID, cria uma nova conversa
          const response = await fetch(`${BASE_API_URL}/conversation`, {
            method: "POST",
          });
          const data = await response.json();
          localStorage.setItem("conversationId", data.conversation.id);
          setConversationId(data.conversation.id);
        }
      } catch (error) {
        console.error("Erro ao inicializar a conversa:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeConversation();
  }, []);

  // Efeito para rolar para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Dispara toda vez que `messages` é atualizado

  // --- Funções de Controle Manual ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !conversationId) return;

    // 1. Atualização Otimista da mensagem do usuário
    const userMessage: Message = { id: "", role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // 2. Chama a API para registrar a mensagem e obter a resposta da IA
      const response = await fetch(
        `${BASE_API_URL}/message/${conversationId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: "user",
            question: currentInput, // Enviando o conteúdo da mensagem do usuário
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao registrar a mensagem.");
      }

      const data = await response.json();
      const aiMessage: Message = {
        id: data.conversationId,
        role: "assistant",
        content: data.modelMessage,
      };

      // 3. Adiciona a resposta da IA ao estado
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Erro no handleSubmit:", error);
      // Opcional: Adicionar uma mensagem de erro na UI
      const errorMessage: Message = {
        id: nanoid(),
        role: "assistant",
        content: "Desculpe, ocorreu um erro. Por favor, tente novamente.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl h-[90vh] grid grid-rows-[auto_1fr_auto]">
      <CardHeader>
        <CardTitle>Atendente Virtual</CardTitle>
        <CardDescription>Pizzaria Genial</CardDescription>
      </CardHeader>

      <CardContent className="overflow-auto">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div key={index} className="flex gap-3">
              <Avatar>
                <AvatarFallback>
                  {message.role === "user" ? <User /> : <Bot />}
                </AvatarFallback>
              </Avatar>
              <div className="pt-1.5 prose prose-invert prose-p:leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && messages.length === 0 && <p>Carregando histórico...</p>}

          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <div>
        {isLoading && (
          <div className="flex gap-2 items-center justify-start px-6 py-2">
            <Loader2Icon className="animate-spin text-gray-600" />
            <p className="text-base text-gray-600">Gerando Resposta</p>
          </div>
        )}
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Qual pizza você gostaria de pedir hoje?"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </div>
    </Card>
  );
}
