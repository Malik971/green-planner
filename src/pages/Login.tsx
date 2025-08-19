import { useState } from "react";
import { Box, Button, Card, CardBody, FormControl, FormLabel, Input, Heading, Text, VStack, Alert } from "@chakra-ui/react";
import { useAuth } from "../features/auth/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { redirectTo?: string } };
  const redirectTo = location.state?.redirectTo ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate(redirectTo, { replace: true });
    } catch (error: any) {
      setErr(error?.message ?? "Échec de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box py={12} px={6} maxW="md" mx="auto">
      <Card>
        <CardBody>
          <VStack as="form" spacing={4} align="stretch" onSubmit={onSubmit}>
            <Heading size="lg" textAlign="center">Connexion</Heading>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              Entrez vos identifiants Sandaya
            </Text>

            {err && <Alert status="error">{err}</Alert>}

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Mot de passe</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>

            <Button type="submit" colorScheme="blue" isLoading={loading}>
              Se connecter
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
