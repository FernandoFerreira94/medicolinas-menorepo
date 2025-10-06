import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import Logo from "../../../assets/Logo.png";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log("aosdias");

  function handleLogin() {}

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // 'padding' é ideal para iOS, 'height' ou 'position' para Android
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Ajuste este valor se o topo da tela também for cortado
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.loginContainer}>
            <Image source={Logo} style={styles.logo} />
            <View style={styles.loginContetn}>
              <Text style={styles.label}>N° matrícula</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder="Digite sua matrícula"
                keyboardType="email-address" // Sugestão para matrícula, pode ser 'numeric' ou 'default'
                autoCapitalize="none" // Evita capitalizar a matrícula automaticamente
              />
              <TouchableOpacity style={styles.containerLink}>
                <Text>Esqueci sua matricula?</Text>
              </TouchableOpacity>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                placeholder="Digite sua senha" // Placeholder mais adequado
                secureTextEntry={true}
                keyboardType="default" // Senha geralmente é 'default'
              />
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Acessar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3D3C6C",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  loginContainer: {
    width: "90%",
    paddingBottom: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  logo: {
    width: "65%",
    objectFit: "contain",
  },
  loginContetn: {
    width: "80%",
    justifyContent: "flex-start",
  },
  label: {
    fontSize: 16,
    fontWeight: "600", // 'semibold' não é uma string válida para fontWeight, use '600' ou 'bold'
  },
  input: {
    borderWidth: 1,
    height: 40,
    paddingLeft: 10,
    borderColor: "#3D3C6C",
    marginTop: 4,
    borderRadius: 10,
    color: "#000",
  },
  containerLink: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: 5,
  },
  button: {
    width: "100%",
    backgroundColor: "#3D3C6C",
    height: 45,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10, // Aumentado para melhor espaçamento
  },
  buttonText: {
    color: "#fff",
    fontSize: 16, // Sugestão para melhorar a legibilidade
  },
});
