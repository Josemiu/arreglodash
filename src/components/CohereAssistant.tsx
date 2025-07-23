import { useState } from "react";
import { CohereClient } from "cohere-ai";
import { Button, TextField, Paper, Typography } from "@mui/material";

interface CohereAssistantProps {
  apiKey: string;
  initialQuery?: string;
}

export default function CohereAssistant({ apiKey, initialQuery = "" }: CohereAssistantProps) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>("");

  const handleAskCohere = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const cohere = new CohereClient({ token: apiKey });

      const chatResponse = await cohere.chat({
        model: "command-r-plus",
        message: `Eres un asistente meteorológico. Responde de forma clara y breve: ${query}`,
        temperature: 0.6
      });

      setResponse(chatResponse.text);
    } catch (err: any) {
      console.error(err);
      setResponse("❌ Error al consultar Cohere");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2, textAlign: "center", mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Asistente de Clima con Cohere
      </Typography>

      {/* Entrada para preguntas */}
      <TextField
        fullWidth
        label="Haz una pregunta sobre el clima"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* Botón para preguntar */}
      <Button variant="contained" color="primary" onClick={handleAskCohere} disabled={loading}>
        {loading ? "Consultando..." : "Preguntar"}
      </Button>

      {/* Respuesta */}
      {response && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Respuesta:</strong> {response}
        </Typography>
      )}
    </Paper>
  );
}
