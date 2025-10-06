import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "./src/routes";

export default function App() {
  console.log("aosdias");
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#3D3C6C" />
      <Routes />
    </NavigationContainer>
  );
}
