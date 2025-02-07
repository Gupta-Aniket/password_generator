import { StatusBar } from "expo-status-bar";
import { isValidElement, useState } from "react";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import BouncyCheckbox from "react-native-bouncy-checkbox";

import { Formik } from "formik";
import * as Yup from "yup";
import { use } from "react";

const passwordSchema = Yup.object().shape({
  passwordLength: Yup.number()
    .min(4, "Should be min 4 length")
    .max(16, "only a max of 16 length is allowed")
    .required("This feild is required"),
});

export default function App() {
  const [password, setPassword] = useState("");
  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false);
  const [useDigits, setUseDigits] = useState(false);
  const [useSpecialChars, setUseSpecialChars] = useState(false);
  const [useUpperCase, setUseUpperCase] = useState(false);

  const generatePasswordString = (passwordLength) => {
    let charList = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const specailChars = "~!@#$%^&*()";
    const upperCase = "ABDEFGHIJKLMNOPQRSTUVWXYZ";

    if (useDigits) charList += digits;
    if (useSpecialChars) charList += specailChars;
    if (useUpperCase) charList += upperCase;

    const passwordString = createPassword(charList, passwordLength);
    setPassword(passwordString);
    setIsPasswordGenerated(true);
  };
  const createPassword = (charList, passwordLength) => {
    var passwordString = "";
    for (let i = 0; i < passwordLength; i++) {
      passwordString += charList.charAt(
        Math.round(Math.random() * charList.length)
      );
    }
    return passwordString;
  };
  const resetPasswordState = () => {
    setIsPasswordGenerated(false);
    setPassword("");
    setUseDigits(false);
    setUseUpperCase(false);
    setUseSpecialChars(false);
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.appContainer}>
        <View style={styles.formContainer}>
          <Formik
            initialValues={{ passwordLength: "" }}
            validationSchema={passwordSchema}
            onSubmit={(values) => {
              console.log(values.passwordLength);
              generatePasswordString(values.passwordLength);
              // + is used to convert string to number, in native
            }}
          >
            {({
              values,
              errors,
              touched,
              isValid,
              handleChange,
              handleReset,
              handleSubmit,
              /* and other goodies */
            }) => (
              <>
                <Text style={styles.heading}>Password Generator</Text>
                <View style={styles.inputWrapper}>
                  <View>
                    <Text style={styles.title}>Password Length</Text>
                    <View>
                      {touched.passwordLength && errors.passwordLength && (
                        <Text style={styles.errorText}>
                          {errors.passwordLength}
                        </Text>
                      )}
                    </View>
                  </View>

                  <TextInput
                    style={styles.inputStyle}
                    value={values.passwordLength}
                    onChangeText={handleChange("passwordLength")}
                    placeholder="Ex. 8"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text> Use Upper Case </Text>
                  <View>
                    <BouncyCheckbox
                      fillColor="#fc80a5"
                      isChecked={useUpperCase}
                      onPress={() => setUseUpperCase(!useUpperCase)}
                    />
                  </View>
                </View>
                <View style={styles.inputWrapper}>
                  <Text> Use Digits </Text>
                  <View>
                    <BouncyCheckbox
                      fillColor="#fc80a5"
                      isChecked={useDigits}
                      onPress={() => setUseDigits(!useDigits)}
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text> Use Special Chars </Text>
                  <View>
                    <BouncyCheckbox
                      fillColor="#fc80a5"
                      isChecked={useSpecialChars}
                      onPress={() => setUseSpecialChars(!useSpecialChars)}
                    />
                  </View>
                </View>

                <View style={styles.formActions}>
                  <TouchableOpacity
                    style={styles.primaryBtn}
                    disabled={!isValid}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.primaryBtnTxt}>Generate Password</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => {
                      handleReset();
                      resetPasswordState();
                    }}
                  >
                    <Text style={styles.primaryBtnTxt}>Reset Password</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>

          {isPasswordGenerated ? (
            <View style={styles.cardElevated}>

              <Text selectable style={styles.generatedPassword}>{password}</Text>


            </View>
          ) : null}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  formContainer: {
    margin: 8,
    padding: 8,
  },
  heading: {
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 2,
  },
  description: {
    color: "#758283",
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
  },
  inputWrapper: {
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  inputColumn: {
    flexDirection: "column",
  },
  inputStyle: {
    padding: 8,
    width: "30%",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#16213e",
  },
  errorText: {
    fontSize: 12,
    color: "#ff0d10",
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "center",
  },
  primaryBtn: {
    width: 120,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: "#5DA3FA",
  },
  primaryBtnTxt: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  secondaryBtn: {
    width: 120,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: "#CAD5E2",
  },
  secondaryBtnTxt: {
    textAlign: "center",
  },
  card: {
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 12,
  },
  cardElevated: {
    backgroundColor: "#f2f2f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    elevation: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: "#333",
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  generatedPassword: {
    paddingTop: 8,
    fontSize: 22,
    textAlign: "center",
    marginBottom: 12,
  },
  copyIcon: {
    paddingLeft: 12,
  },
});
