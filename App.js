import React, {useState, useEffect} from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import firebase from "firebase"
import Home from './screens/Home';
import ToDoList from "./screens/ToDoList";
import EditList from "./screens/EditList";
import Colors from "./constants/Colors";
import Login from './screens/Login'
import Settings from './screens/Settings'

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

const AuthScreens = () => {
  return (
      <AuthStack.Navigator>
          <AuthStack.Screen options={()=>{
          return({ 
            headerStyle: {
              backgroundColor: "black",
            },
            headerTintColor: "white"
          })
        }} name="Login" component={Login} />
      </AuthStack.Navigator>
  );
};

const Screens = () => {
  return(
    <Stack.Navigator>
      <Stack.Screen name="Smart List" component={Home} 
        options={()=>{
          return({ 
            headerStyle: {
              backgroundColor: "black",
            },
            headerTintColor: "white"
          })
        }}
      />
      <Stack.Screen name="Settings" component={Settings} options={()=>{
          return({ 
            headerStyle: {
              backgroundColor: "black",
            },
            headerTintColor: "white"
          })
        }} />
      <Stack.Screen 
        name="ToDoList" 
        component={ToDoList}
        options={({route})=>{
          return({
            title: route.params.title, 
            headerStyle: {
              backgroundColor: route.params.color
            },
            headerTintColor: "white"
          })
        }}
      />
      <Stack.Screen 
      name="Edit" 
      component={EditList}
      options={({route})=>{
          return({
            title: route.params.title ? `Edit ${route.params.title} list` : "Create new List", 
            headerStyle: {
              backgroundColor: route.params.color || Colors.blue
            },
            headerTintColor: "white"
          })
        }}
      />
    </Stack.Navigator>
  )
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    if (firebase.auth().currentUser) {
        setIsAuthenticated(true);
    }
    firebase.auth().onAuthStateChanged((user) => {
        console.log("Checking auth state...");
        if (user) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    });
}, []);
  return (
    <NavigationContainer>  
     {isAuthenticated ? <Screens /> : <AuthScreens />} 
    </NavigationContainer>
    
  );
}

const firebaseConfig = {
  apiKey: "AIzaSyBCLWnCh35ALME7ZqY3djXMg649xEAtVWc",
  authDomain: "smart-list-8d1d4.firebaseapp.com",
  databaseURL: "https://smart-list-8d1d4.firebaseio.com",
  projectId: "smart-list-8d1d4",
  storageBucket: "smart-list-8d1d4.appspot.com",
  messagingSenderId: "1015690951500",
  appId: "1:1015690951500:web:b8f4eb0886b853e9a36de9"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}