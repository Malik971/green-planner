import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  VStack,
  Alert,
  HStack,
  Divider,
  Link,
} from "@chakra-ui/react";
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

  const handleGoogleSignIn = () => {
    // Ici tu peux intégrer ton OAuth Google
    alert("Connexion Google (placeholder)");
  };

  return (
    <Box py={12} px={6} maxW="md" mx="auto">
      <Button mb={4} variant="ghost" onClick={() => navigate(-1)}>
        ← Retour
      </Button>

      <Card shadow="lg" borderRadius="md">
        <CardBody>
          <VStack as="form" spacing={4} align="stretch" onSubmit={onSubmit}>
            <Heading size="lg" textAlign="center">
              Connexion
            </Heading>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              Entrez vos identifiants Sandaya
            </Text>

            {err && <Alert status="error">{err}</Alert>}

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="votre.email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Mot de passe</FormLabel>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <Link
              color="blue.500"
              fontSize="sm"
              alignSelf="flex-end"
              onClick={() => alert("Redirection mot de passe oublié")}
            >
              Mot de passe oublié ?
            </Link>

            <Button type="submit" colorScheme="blue" isLoading={loading}>
              Se connecter
            </Button>

            <HStack my={2}>
              <Divider />
              <Text fontSize="sm" color="gray.500">
                ou
              </Text>
              <Divider />
            </HStack>

            <Button
              variant="outline"
              colorScheme="red"
              onClick={handleGoogleSignIn}
            >
              Se connecter avec Google
            </Button>

            <Text fontSize="xs" color="gray.500" textAlign="center" mt={4}>
              En vous connectant, vous acceptez notre{" "}
              <Link color="blue.500" href="/privacy-policy">
                politique de confidentialité
              </Link>
              . Vos données sont sécurisées et utilisées uniquement pour
              l'accès à votre compte.
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
